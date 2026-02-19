import json
import logging
import time
from typing import Any

from openai import BadRequestError, OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

FILL_TEMPLATE_PROMPT = """
You are a resume data mapper. Convert extracted resume data into the exact JSON schema used by the frontend editor.

INPUT:
- Extracted resume data (JSON) containing personal info, experience, education, skills, and other sections.

MAPPING RULES:
1) Map personal.full_name → personal.fullName
2) Map personal.role_title → personal.role
3) Map personal.email → personal.email
4) Map personal.phone → personal.phone
5) Map personal.location → personal.location
6) Map personal.summary → personal.summary (keep full text)
7) For each experience entry: combine all bullet points into a single description string joined by newlines. Use sequential IDs starting from 1.
8) For each education entry: map degree, institution → school, date_range → date. Use sequential IDs starting from 1.
9) Flatten all skill categories into a single flat array of skill strings. Remove duplicates.
10) Include ALL entries — do not truncate or limit.
11) If a field is missing or null, use an empty string.

OUTPUT CONTRACT:
- Return ONLY valid JSON (no markdown, no prose).
- Follow this exact schema:

{
  "personal": {
    "fullName": "string",
    "role": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string"
  },
  "experience": [
    {
      "id": 1,
      "role": "string",
      "company": "string",
      "date": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "id": 1,
      "degree": "string",
      "school": "string",
      "date": "string"
    }
  ],
  "skills": ["string"]
}
""".strip()


def _extract_json_from_text(raw_text: str) -> dict[str, Any] | None:
    import re

    if not raw_text:
        return None

    candidate = raw_text.strip()
    if candidate.startswith("```"):
        candidate = re.sub(r"^```(?:json)?", "", candidate).strip()
        candidate = re.sub(r"```$", "", candidate).strip()

    try:
        payload = json.loads(candidate)
        if isinstance(payload, dict):
            return payload
    except Exception:
        pass

    match = re.search(r"\{.*\}", raw_text, flags=re.DOTALL)
    if not match:
        return None

    try:
        payload = json.loads(match.group(0))
        if isinstance(payload, dict):
            return payload
    except Exception:
        return None

    return None


def fill_template_from_extracted_data(extracted_data: dict[str, Any]) -> dict[str, Any] | None:
    """Use LLM to map extracted resume data to the frontend ResumeData schema."""
    provider = settings.RESUME_FILL_PROVIDER.strip().lower()

    if provider == "nebius":
        if not settings.NEBIUS_API_KEY:
            logger.warning("NEBIUS_API_KEY not configured for template fill")
            return None
        client = OpenAI(base_url=settings.NEBIUS_BASE_URL, api_key=settings.NEBIUS_API_KEY)
        model = settings.NEBIUS_FILL_MODEL
    elif provider == "chutes":
        if not settings.CHUTES_API_TOKEN:
            logger.warning("CHUTES_API_TOKEN not configured for template fill")
            return None
        client = OpenAI(base_url=settings.CHUTES_BASE_URL, api_key=settings.CHUTES_API_TOKEN)
        model = settings.CHUTES_FILL_MODEL
    else:
        logger.warning("Unknown provider '%s' for template fill", provider)
        return None

    user_message = (
        f"{FILL_TEMPLATE_PROMPT}\n\n"
        f"Here is the extracted resume data to map:\n"
        f"```json\n{json.dumps(extracted_data, ensure_ascii=False, indent=2)}\n```"
    )

    request_kwargs: dict[str, Any] = {
        "model": model,
        "max_tokens": settings.RESUME_FILL_TEMPLATE_MAX_TOKENS,
        "temperature": settings.RESUME_FILL_TEMPLATE_TEMPERATURE,
        "messages": [
            {
                "role": "user",
                "content": user_message,
            }
        ],
    }

    started = time.perf_counter()
    try:
        try:
            response = client.chat.completions.create(
                **request_kwargs,
                response_format={"type": "json_object"},
            )
        except BadRequestError:
            response = client.chat.completions.create(**request_kwargs)

        raw_text = ""
        choices = getattr(response, "choices", None) or []
        if choices:
            message = getattr(choices[0], "message", None)
            content = getattr(message, "content", None)
            if isinstance(content, str):
                raw_text = content

        logger.info(
            "Template fill completed in %.1fms (provider=%s, length=%d)",
            (time.perf_counter() - started) * 1000,
            provider,
            len(raw_text),
        )

        return _extract_json_from_text(raw_text)

    except Exception:
        logger.exception("Template fill LLM call failed")
        return None
