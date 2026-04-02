import json
import logging
import re
import time
from typing import Any

from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

MAX_RETRIES = 2
RETRY_BACKOFF_SECONDS = [1, 3]

COVER_LETTER_SYSTEM_PROMPT = """You are a professional cover letter writer. Generate a personalized, compelling cover letter based on the candidate's resume data and the target job description.

CRITICAL RULES:
1) Use ONLY information from the provided resume data. Do NOT invent qualifications or experiences.
2) Tailor the letter specifically to the job description provided.
3) Match the requested tone exactly.
4) If the company name or hiring manager name cannot be determined from the job description, use "Hiring Manager" and "[Company Name]" as placeholders.
5) The date should be today's date in a professional format (e.g., "March 2, 2026").
8) For senderName, ALWAYS use the candidate's full name from their resume data. NEVER use placeholders like "[Your Name]".
6) Body paragraphs should each focus on a distinct theme: relevant experience, key skills/achievements, cultural fit, etc.
7) Keep the letter concise — 3-4 paragraphs total across opening, body, and closing.

OUTPUT FORMAT:
Return ONLY valid JSON with this exact schema (no markdown, no prose):

{
  "recipientName": "string",
  "companyName": "string",
  "date": "string",
  "greeting": "string",
  "opening": "string",
  "body": ["string", "string"],
  "closing": "string",
  "signOff": "string",
  "senderName": "string"
}"""

REFINE_SYSTEM_PROMPT = """You are a professional cover letter editor. Refine the given paragraph based on the user's instructions while maintaining the overall context and flow of the cover letter.

Rules:
- Return ONLY the refined paragraph text, no quotes, no labels, no markdown.
- Preserve the general meaning unless the user asks for a change in direction.
- Keep the same approximate length unless the user requests otherwise.
- Match the existing tone of the letter."""


def _get_llm_client() -> tuple[OpenAI, str] | None:
    """Resolve LLM client and model based on RESUME_FILL_PROVIDER setting."""
    provider = settings.RESUME_FILL_PROVIDER.strip().lower()
    if provider == "nebius":
        if not settings.NEBIUS_API_KEY:
            logger.warning("NEBIUS_API_KEY not configured for cover letter")
            return None
        return OpenAI(base_url=settings.NEBIUS_BASE_URL, api_key=settings.NEBIUS_API_KEY), settings.NEBIUS_FILL_MODEL
    elif provider == "chutes":
        if not settings.CHUTES_API_TOKEN:
            logger.warning("CHUTES_API_TOKEN not configured for cover letter")
            return None
        return OpenAI(base_url=settings.CHUTES_BASE_URL, api_key=settings.CHUTES_API_TOKEN), settings.CHUTES_FILL_MODEL
    elif provider == "nvidia":
        if not settings.NVIDIA_API_KEY:
            logger.warning("NVIDIA_API_KEY not configured for cover letter")
            return None
        return OpenAI(base_url=settings.NVIDIA_BASE_URL, api_key=settings.NVIDIA_API_KEY), settings.NVIDIA_FILL_MODEL
    else:
        logger.warning("Unknown provider '%s' for cover letter", provider)
        return None


def _extract_json_from_text(raw_text: str) -> dict[str, Any] | None:
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


def _build_user_message(
    extracted_data: dict[str, Any],
    job_description: str,
    tone: str,
    additional_instructions: str,
) -> str:
    parts: list[str] = []

    # Extract personal info
    personal = extracted_data.get("personal", {})
    if isinstance(personal, dict):
        if personal.get("fullName"):
            parts.append(f"Candidate Name: {personal['fullName']}")
        if personal.get("role"):
            parts.append(f"Current Role: {personal['role']}")
        if personal.get("summary"):
            parts.append(f"Professional Summary: {personal['summary']}")

    # Extract experience summary
    experience = extracted_data.get("experience", [])
    if isinstance(experience, list) and experience:
        exp_items = []
        for exp in experience[:5]:
            if isinstance(exp, dict):
                role = exp.get("role", "")
                company = exp.get("company", "")
                if role or company:
                    exp_items.append(f"{role} at {company}".strip(" at "))
        if exp_items:
            parts.append(f"Experience: {'; '.join(exp_items)}")

    # Extract skills
    skills = extracted_data.get("skills", [])
    if isinstance(skills, list) and skills:
        parts.append(f"Key Skills: {', '.join(str(s) for s in skills[:20])}")

    # Fall back to transcription if structured data is sparse
    if len(parts) <= 1:
        transcription = extracted_data.get("transcription")
        if isinstance(transcription, str) and transcription.strip():
            parts.append(f"Resume Content:\n{transcription.strip()[:3000]}")

    parts.append(f"\n--- JOB DESCRIPTION ---\n{job_description.strip()}")
    parts.append(f"Tone: {tone}")

    if additional_instructions.strip():
        parts.append(f"Additional Instructions: {additional_instructions.strip()}")

    return "\n\n".join(parts)


def generate_cover_letter(
    extracted_data: dict[str, Any],
    job_description: str,
    tone: str = "professional",
    additional_instructions: str = "",
) -> dict[str, Any] | None:
    """Generate a cover letter using LLM based on resume data and job description."""
    result = _get_llm_client()
    if result is None:
        return None
    client, model = result

    user_message = _build_user_message(
        extracted_data, job_description, tone, additional_instructions
    )

    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES):
        started = time.perf_counter()
        try:
            response = client.chat.completions.create(
                model=model,
                max_tokens=settings.COVER_LETTER_MAX_TOKENS,
                temperature=settings.COVER_LETTER_TEMPERATURE,
                messages=[
                    {"role": "system", "content": COVER_LETTER_SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
            )

            raw_text = ""
            choices = getattr(response, "choices", None) or []
            if choices:
                message = getattr(choices[0], "message", None)
                content = getattr(message, "content", None)
                if isinstance(content, str):
                    raw_text = content.strip()

            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.info(
                "Cover letter attempt %d/%d completed in %.1fms (length=%d)",
                attempt + 1, MAX_RETRIES, elapsed_ms, len(raw_text),
            )

            if not raw_text:
                logger.warning(
                    "Cover letter attempt %d/%d returned empty response",
                    attempt + 1, MAX_RETRIES,
                )
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_BACKOFF_SECONDS[attempt])
                continue

            result = _extract_json_from_text(raw_text)
            if result is not None:
                return result

            logger.warning(
                "Cover letter attempt %d/%d returned non-JSON response (length=%d)",
                attempt + 1, MAX_RETRIES, len(raw_text),
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

        except Exception as exc:
            last_error = exc
            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.warning(
                "Cover letter attempt %d/%d failed after %.1fms: %s",
                attempt + 1, MAX_RETRIES, elapsed_ms, exc,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

    if last_error:
        logger.exception(
            "Cover letter generation failed after %d attempts", MAX_RETRIES, exc_info=last_error
        )
    else:
        logger.error("Cover letter generation failed after %d attempts (empty/invalid responses)", MAX_RETRIES)
    return None


def refine_paragraph(
    paragraph_text: str,
    paragraph_type: str,
    prompt: str,
    context: dict[str, Any] | None = None,
) -> str | None:
    """Refine a single cover letter paragraph using LLM."""
    result = _get_llm_client()
    if result is None:
        return None
    client, model = result

    parts: list[str] = []
    parts.append(f"Paragraph type: {paragraph_type}")
    parts.append(f"Current text:\n{paragraph_text}")
    parts.append(f"User request: {prompt}")

    ctx = context or {}
    if ctx.get("job_description"):
        parts.append(f"Job description context: {ctx['job_description'][:500]}")
    if ctx.get("tone"):
        parts.append(f"Desired tone: {ctx['tone']}")

    user_message = "\n\n".join(parts)

    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES):
        started = time.perf_counter()
        try:
            response = client.chat.completions.create(
                model=model,
                max_tokens=settings.AI_WRITE_MAX_TOKENS,
                temperature=settings.AI_WRITE_TEMPERATURE,
                messages=[
                    {"role": "system", "content": REFINE_SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
            )

            raw_text = ""
            choices = getattr(response, "choices", None) or []
            if choices:
                message = getattr(choices[0], "message", None)
                content = getattr(message, "content", None)
                if isinstance(content, str):
                    raw_text = content.strip()

            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.info(
                "Paragraph refine attempt %d/%d completed in %.1fms (type=%s, length=%d)",
                attempt + 1, MAX_RETRIES, elapsed_ms, paragraph_type, len(raw_text),
            )

            if raw_text:
                return raw_text

            logger.warning(
                "Paragraph refine attempt %d/%d returned empty response",
                attempt + 1, MAX_RETRIES,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

        except Exception as exc:
            last_error = exc
            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.warning(
                "Paragraph refine attempt %d/%d failed after %.1fms: %s",
                attempt + 1, MAX_RETRIES, elapsed_ms, exc,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

    if last_error:
        logger.exception(
            "Paragraph refinement failed after %d attempts", MAX_RETRIES, exc_info=last_error
        )
    else:
        logger.error("Paragraph refinement failed after %d attempts (empty responses)", MAX_RETRIES)
    return None
