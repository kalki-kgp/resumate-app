import json
import logging
import time
from typing import Any

from openai import BadRequestError, OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

FILL_TEMPLATE_PROMPT = """
You are a resume data mapper. Convert a plain-text resume transcription into the exact JSON schema used by the frontend editor.

INPUT:
- A plain-text transcription of a resume, organized by section headings.

CRITICAL RULES:
1) ONLY use information that is explicitly present in the transcription. Do NOT invent, infer, or fabricate any data.
2) If something is not mentioned, use an empty string — do NOT make it up.
3) Clearly distinguish between EXPERIENCE (jobs, internships at companies) and PROJECTS (academic, personal, competition, or hackathon projects).
   - Experience entries have a company/organization they worked AT.
   - Projects are things the person BUILT — often for competitions, coursework, or personal interest.
4) For each experience/project entry: combine all bullet points into a single description string joined by newlines.
5) Use sequential IDs starting from 1 for experience, projects, and education.
6) Flatten all skills into a single flat array of skill strings. Remove duplicates.
7) Include ALL entries — do not truncate or limit.
8) If a field is missing or null, use an empty string.

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
  "projects": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "date": "string"
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

    # extracted_data may be {"transcription": "..."} (plain text) or legacy JSON
    transcription = extracted_data.get("transcription")
    if isinstance(transcription, str) and transcription.strip():
        data_block = transcription.strip()
    else:
        data_block = json.dumps(extracted_data, ensure_ascii=False, indent=2)

    user_message = (
        f"{FILL_TEMPLATE_PROMPT}\n\n"
        f"Here is the resume transcription to map:\n\n{data_block}"
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
