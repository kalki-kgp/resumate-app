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

MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = [2, 4, 8]

_SECTION_HINTS = {
    "projects": ["PROJECTS", "PROJECT", "ACADEMIC PROJECT", "PERSONAL PROJECT"],
    "experience": ["EXPERIENCE", "WORK EXPERIENCE", "INTERNSHIP", "EMPLOYMENT"],
    "education": ["EDUCATION", "ACADEMIC"],
    "skills": ["SKILLS", "TECHNICAL SKILLS", "TECHNOLOGIES"],
}


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


def _build_retry_message(data_block: str, missing: list[str], all_sections: list[str]) -> str:
    """Build a more explicit retry message when sections are missing."""
    missing_str = ", ".join(missing)
    return (
        f"{FILL_TEMPLATE_PROMPT}\n\n"
        f"IMPORTANT: Your previous response was MISSING these sections: {missing_str}\n"
        f"The resume CLEARLY contains these sections. You MUST include them.\n"
        f"The resume contains these sections: {', '.join(all_sections)}\n"
        f"ALL sections MUST have non-empty arrays in your response.\n\n"
        f"Here is the resume transcription to map:\n\n{data_block}"
    )


def _detect_sections_in_text(text: str) -> list[str]:
    """Detect which resume sections are present in the transcription text."""
    upper_text = text.upper()
    found: list[str] = []
    for section_key, hints in _SECTION_HINTS.items():
        if any(hint in upper_text for hint in hints):
            found.append(section_key)
    return found


def _check_missing_sections(result: dict[str, Any], transcription: str) -> list[str]:
    """Check if the fill result is missing sections that are present in the transcription."""
    upper_text = transcription.upper()
    missing: list[str] = []
    for section_key, hints in _SECTION_HINTS.items():
        section_data = result.get(section_key)
        section_empty = not section_data or (isinstance(section_data, list) and len(section_data) == 0)
        if section_empty and any(hint in upper_text for hint in hints):
            missing.append(section_key)
    return missing


_SYSTEM_MESSAGE = (
    "You are a precise resume data mapper. You MUST map ALL sections from the resume "
    "transcription to JSON. Pay special attention to PROJECTS — these are distinct from "
    "EXPERIENCE. Projects are things the person built (hackathons, academic, personal). "
    "Experience is employment at companies. Both sections MUST be populated if present "
    "in the input. Return complete, valid JSON with every section filled."
)


def _make_llm_call(
    client: OpenAI,
    model: str,
    user_message: str,
    max_tokens: int,
    temperature: float,
) -> str:
    request_kwargs: dict[str, Any] = {
        "model": model,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "messages": [
            {
                "role": "system",
                "content": _SYSTEM_MESSAGE,
            },
            {
                "role": "user",
                "content": user_message,
            }
        ],
    }

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

        finish_reason = getattr(choices[0], "finish_reason", None)
        if finish_reason and finish_reason != "stop":
            logger.warning(
                "Template fill finish_reason=%s (model=%s, length=%d)",
                finish_reason, model, len(raw_text),
            )

    return raw_text


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
    elif provider == "nvidia":
        if not settings.NVIDIA_API_KEY:
            logger.warning("NVIDIA_API_KEY not configured for template fill")
            return None
        client = OpenAI(base_url=settings.NVIDIA_BASE_URL, api_key=settings.NVIDIA_API_KEY)
        model = settings.NVIDIA_FILL_MODEL
    else:
        logger.warning("Unknown provider '%s' for template fill", provider)
        return None

    transcription = extracted_data.get("transcription")
    if isinstance(transcription, str) and transcription.strip():
        data_block = transcription.strip()
    else:
        data_block = json.dumps(extracted_data, ensure_ascii=False, indent=2)

    sections_found = _detect_sections_in_text(data_block)
    sections_hint = ""
    if sections_found:
        sections_hint = (
            "\n\nSECTIONS DETECTED IN THIS RESUME (you MUST include non-empty arrays for each):\n"
            + ", ".join(sections_found)
            + "\n\nDo NOT leave any detected section empty. Map every entry to the correct section."
        )

    user_message = (
        f"{FILL_TEMPLATE_PROMPT}{sections_hint}\n\n"
        f"Here is the resume transcription to map:\n\n{data_block}"
    )

    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES):
        started = time.perf_counter()
        try:
            raw_text = _make_llm_call(
                client=client,
                model=model,
                user_message=user_message,
                max_tokens=settings.RESUME_FILL_TEMPLATE_MAX_TOKENS,
                temperature=settings.RESUME_FILL_TEMPLATE_TEMPERATURE,
            )

            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.info(
                "Template fill attempt %d/%d completed in %.1fms (provider=%s, length=%d)",
                attempt + 1, MAX_RETRIES, elapsed_ms, provider, len(raw_text),
            )

            if not raw_text.strip():
                logger.warning(
                    "Template fill attempt %d/%d returned empty response, retrying...",
                    attempt + 1, MAX_RETRIES,
                )
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_BACKOFF_SECONDS[attempt])
                continue

            result = _extract_json_from_text(raw_text)
            if result is not None:
                missing = _check_missing_sections(result, data_block)
                if missing and attempt < MAX_RETRIES - 1:
                    logger.warning(
                        "Template fill attempt %d/%d missing sections %s, retrying with explicit instructions...",
                        attempt + 1, MAX_RETRIES, missing,
                    )
                    user_message = _build_retry_message(data_block, missing, sections_found)
                    time.sleep(RETRY_BACKOFF_SECONDS[attempt])
                    continue
                return result

            logger.warning(
                "Template fill attempt %d/%d returned non-JSON response (length=%d), retrying...",
                attempt + 1, MAX_RETRIES, len(raw_text),
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

        except Exception as exc:
            last_error = exc
            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.warning(
                "Template fill attempt %d/%d failed after %.1fms: %s",
                attempt + 1, MAX_RETRIES, elapsed_ms, exc,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

    if last_error:
        logger.exception("Template fill failed after %d attempts", MAX_RETRIES, exc_info=last_error)
    else:
        logger.error("Template fill failed after %d attempts (empty/invalid responses)", MAX_RETRIES)
    return None
