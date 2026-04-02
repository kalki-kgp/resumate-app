import logging
import time
from typing import Any

from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)


def _get_llm_client() -> tuple[OpenAI, str] | None:
    """Resolve LLM client and model based on RESUME_FILL_PROVIDER setting."""
    provider = settings.RESUME_FILL_PROVIDER.strip().lower()
    if provider == "nebius":
        if not settings.NEBIUS_API_KEY:
            logger.warning("NEBIUS_API_KEY not configured for AI write")
            return None
        return OpenAI(base_url=settings.NEBIUS_BASE_URL, api_key=settings.NEBIUS_API_KEY), settings.NEBIUS_FILL_MODEL
    elif provider == "chutes":
        if not settings.CHUTES_API_TOKEN:
            logger.warning("CHUTES_API_TOKEN not configured for AI write")
            return None
        return OpenAI(base_url=settings.CHUTES_BASE_URL, api_key=settings.CHUTES_API_TOKEN), settings.CHUTES_FILL_MODEL
    elif provider == "nvidia":
        if not settings.NVIDIA_API_KEY:
            logger.warning("NVIDIA_API_KEY not configured for AI write")
            return None
        return OpenAI(base_url=settings.NVIDIA_BASE_URL, api_key=settings.NVIDIA_API_KEY), settings.NVIDIA_FILL_MODEL
    else:
        logger.warning("Unknown provider '%s' for AI write", provider)
        return None


MAX_RETRIES = 2
RETRY_BACKOFF_SECONDS = [1, 3]

_SYSTEM_PROMPTS = {
    "summary": (
        "You are a professional resume writer. Write a concise, compelling professional summary "
        "for a resume. Write in first person implied (no 'I'). Focus on years of experience, "
        "key strengths, and career highlights. Keep it to 2-4 sentences. "
        "Return ONLY the summary text, no quotes, no labels, no markdown."
    ),
    "experience": (
        "You are a professional resume writer. Write strong, achievement-focused bullet points "
        "for a work experience entry on a resume. Use action verbs. Quantify results where possible. "
        "Each bullet should be one line. Separate bullets with newlines. "
        "Return ONLY the bullet points text, no quotes, no labels, no markdown formatting."
    ),
    "project": (
        "You are a professional resume writer. Write a concise, impactful description "
        "for a project on a resume. Highlight technologies used, your role, and outcomes. "
        "Use action verbs. Separate bullet points with newlines. "
        "Return ONLY the description text, no quotes, no labels, no markdown formatting."
    ),
    "skills": (
        "You are a professional resume writer. Generate a well-organized, comma-separated list "
        "of relevant technical and professional skills for a resume. Group related skills together. "
        "Return ONLY the comma-separated skills, no quotes, no labels, no categories, no markdown."
    ),
}


def _build_user_message(
    section_type: str,
    prompt: str,
    current_text: str,
    context: dict[str, Any],
) -> str:
    parts: list[str] = []

    if section_type == "summary":
        if context.get("fullName"):
            parts.append(f"Name: {context['fullName']}")
        if context.get("role"):
            parts.append(f"Role: {context['role']}")
        if context.get("experienceTitles"):
            parts.append(f"Experience: {context['experienceTitles']}")
    elif section_type == "experience":
        if context.get("role"):
            parts.append(f"Role: {context['role']}")
        if context.get("company"):
            parts.append(f"Company: {context['company']}")
        if context.get("date"):
            parts.append(f"Period: {context['date']}")
    elif section_type == "project":
        if context.get("name"):
            parts.append(f"Project: {context['name']}")
        if context.get("date"):
            parts.append(f"Period: {context['date']}")
    elif section_type == "skills":
        if context.get("role"):
            parts.append(f"Role: {context['role']}")
        if context.get("experienceTitles"):
            parts.append(f"Experience: {context['experienceTitles']}")

    if current_text.strip():
        parts.append(f"Current text:\n{current_text.strip()}")

    parts.append(f"User request: {prompt}")

    return "\n\n".join(parts)


def generate_ai_text(
    section_type: str,
    prompt: str,
    current_text: str = "",
    context: dict[str, Any] | None = None,
) -> str | None:
    """Generate text for a resume section using LLM."""
    result = _get_llm_client()
    if result is None:
        return None
    client, model = result

    system_prompt = _SYSTEM_PROMPTS.get(section_type, _SYSTEM_PROMPTS["summary"])
    user_message = _build_user_message(
        section_type, prompt, current_text, context or {}
    )

    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES):
        started = time.perf_counter()
        try:
            response = client.chat.completions.create(
                model=model,
                max_tokens=settings.AI_WRITE_MAX_TOKENS,
                temperature=settings.AI_WRITE_TEMPERATURE,
                messages=[
                    {"role": "system", "content": system_prompt},
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
                "AI write attempt %d/%d completed in %.1fms (section=%s, length=%d)",
                attempt + 1, MAX_RETRIES, elapsed_ms, section_type, len(raw_text),
            )

            if raw_text:
                return raw_text

            logger.warning(
                "AI write attempt %d/%d returned empty response",
                attempt + 1, MAX_RETRIES,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

        except Exception as exc:
            last_error = exc
            elapsed_ms = (time.perf_counter() - started) * 1000
            logger.warning(
                "AI write attempt %d/%d failed after %.1fms: %s",
                attempt + 1, MAX_RETRIES, elapsed_ms, exc,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF_SECONDS[attempt])

    if last_error:
        logger.exception(
            "AI write failed after %d attempts", MAX_RETRIES, exc_info=last_error
        )
    else:
        logger.error("AI write failed after %d attempts (empty responses)", MAX_RETRIES)
    return None
