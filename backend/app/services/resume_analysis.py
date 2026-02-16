import base64
import json
import logging
import re
import time
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import Any
from uuid import UUID

import pypdfium2 as pdfium
from openai import BadRequestError, OpenAI

from app.core.config import settings
from app.schemas.onboarding import (
    ResumeAnalysisBullet,
    ResumeAnalysisCategoryScores,
    ResumeAnalysisResult,
    ResumeAnalysisRole,
    ResumeAnalysisSectionScores,
)

logger = logging.getLogger(__name__)

RESUME_ANALYSIS_PROMPT = """
You are a senior resume strategist combining ATS screening expertise and hiring-manager judgment.

INPUT:
- You receive resume page images in order (page 1, page 2, ...).
- Treat the images as the complete source of truth.

TASK:
Produce a high-signal, practical resume analysis that can be used immediately for job search decisions.

ANALYSIS RULES:
1) Ground every finding in visible resume evidence.
2) If data is missing, unclear, or implied, say that clearly.
3) Do NOT invent employers, metrics, dates, certifications, or tools.
4) Keep feedback specific, concise, and actionable.
5) Prioritize changes that materially improve interview conversion.

SCORING RUBRIC (ats_score_estimate):
- 90-100: highly ATS-friendly, quantified impact, strong role alignment.
- 75-89: solid baseline, some keyword/impact gaps.
- 60-74: moderate issues in phrasing, structure, or targeting.
- <60: significant ATS and clarity issues.

OUTPUT CONTRACT:
- Return ONLY valid JSON (no markdown, no prose outside JSON).
- Include ALL keys exactly as specified.
- Use empty arrays when no items exist.
- Keep each bullet concise.

JSON schema:
{
  "candidate_headline": "string",
  "summary": "string",
  "ats_score_estimate": 0,
  "category_scores": {
    "impact": 0,
    "brevity": 0,
    "style": 0,
    "soft_skills": 0
  },
  "section_scores": {
    "headline": 0,
    "summary": 0,
    "experience": 0,
    "education": 0
  },
  "strengths": ["string"],
  "gaps": ["string"],
  "priority_fixes": ["string"],
  "keywords_to_add": ["string"],
  "recommended_roles": [
    { "title": "string", "reason": "string" }
  ],
  "improved_bullets": [
    { "original": "string", "improved": "string" }
  ],
  "confidence_note": "string"
}

QUALITY TARGETS:
- strengths: 3-6
- gaps: 3-6
- priority_fixes: 5-8
- keywords_to_add: 8-15
- recommended_roles: 3-5
- improved_bullets: 4-8
- category_scores fields: integer 0-100
- section_scores fields: integer 0-10

STYLE:
- Prefer concrete hiring language and ATS keywords.
- Improved bullets should be stronger, clearer, and outcome-oriented.
""".strip()

RESUME_ANALYSIS_COMPACT_RETRY_APPENDIX = """
IMPORTANT RETRY MODE:
- Your previous response was likely truncated.
- Return valid JSON only, with compact values.
- Keep each list item to 6-14 words.
- Keep each role reason to <= 18 words.
- Keep each improved bullet field to <= 24 words.
- Use these exact counts:
  strengths: 4
  gaps: 4
  priority_fixes: 6
  keywords_to_add: 10
  recommended_roles: 3
  improved_bullets: 4
""".strip()


class ResumeAnalysisError(Exception):
    pass


def _analysis_debug(event: str, **payload: Any) -> None:
    if not settings.RESUME_ANALYSIS_DEBUG:
        return

    safe_payload: dict[str, Any] = {}
    for key, value in payload.items():
        if isinstance(value, (str, int, float, bool)) or value is None:
            safe_payload[key] = value
        else:
            safe_payload[key] = str(value)

    logger.warning("resume_analysis_debug %s %s", event, json.dumps(safe_payload, ensure_ascii=True))


def _user_resume_dir(user_id: UUID | str) -> Path:
    return Path(settings.UPLOAD_DIR) / "resumes" / str(user_id)


def latest_resume_pdf_path(user_id: UUID | str) -> Path | None:
    resume_dir = _user_resume_dir(user_id)
    if not resume_dir.exists():
        return None

    pdf_files = sorted(resume_dir.glob("*.pdf"), key=lambda item: item.stat().st_mtime, reverse=True)
    if not pdf_files:
        return None
    return pdf_files[0]


def latest_analysis_result_path(user_id: UUID | str) -> Path:
    return _user_resume_dir(user_id) / "latest_analysis.json"


def clear_latest_analysis_result(user_id: UUID | str) -> None:
    path = latest_analysis_result_path(user_id)
    if path.exists():
        path.unlink(missing_ok=True)


def save_latest_analysis_result(
    user_id: UUID | str,
    resume_path: Path,
    analysis: ResumeAnalysisResult,
) -> None:
    output_path = latest_analysis_result_path(user_id)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "resume_filename": resume_path.name,
        "saved_at": datetime.now(timezone.utc).isoformat(),
        "analysis": analysis.model_dump(mode="json"),
    }
    output_path.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")


def load_latest_analysis_result(user_id: UUID | str) -> ResumeAnalysisResult | None:
    path = latest_analysis_result_path(user_id)
    if not path.exists():
        return None

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        analysis_payload = payload.get("analysis") if isinstance(payload, dict) else None
        if not isinstance(analysis_payload, dict):
            return None
        return ResumeAnalysisResult.model_validate(analysis_payload)
    except Exception:
        return None


def pdf_to_base64_png_images(pdf_path: Path, max_pages: int) -> list[str]:
    if max_pages < 1:
        return []

    images: list[str] = []
    document = pdfium.PdfDocument(str(pdf_path))

    try:
        page_count = len(document)
        pages_to_render = min(page_count, max_pages)

        for page_index in range(pages_to_render):
            page = document[page_index]
            rendered = page.render(scale=settings.RESUME_RENDER_SCALE, rotation=0)
            pil_image = rendered.to_pil()

            if pil_image.width > settings.RESUME_RENDER_MAX_WIDTH:
                ratio = settings.RESUME_RENDER_MAX_WIDTH / pil_image.width
                resized_height = max(1, int(pil_image.height * ratio))
                pil_image = pil_image.resize((settings.RESUME_RENDER_MAX_WIDTH, resized_height))

            buffer = BytesIO()
            pil_image.save(buffer, format="PNG", optimize=True)
            images.append(base64.b64encode(buffer.getvalue()).decode("utf-8"))

            if hasattr(rendered, "close"):
                rendered.close()
            if hasattr(page, "close"):
                page.close()
    finally:
        if hasattr(document, "close"):
            document.close()

    return images


def _extract_response_text(response: Any) -> str:
    try:
        choices = getattr(response, "choices", None) or []
        if not choices:
            return ""

        message = getattr(choices[0], "message", None)
        content = getattr(message, "content", None)

        if isinstance(content, str):
            return content

        if isinstance(content, list):
            text_parts: list[str] = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    value = item.get("text")
                    if isinstance(value, str):
                        text_parts.append(value)
            return "\n".join(text_parts).strip()
    except Exception:
        return ""

    return ""


def _extract_json_object(raw_text: str) -> dict[str, Any] | None:
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


def _as_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    output: list[str] = []
    for item in value:
        if isinstance(item, str):
            cleaned = item.strip()
            if cleaned:
                output.append(cleaned)
    return output


def _bounded_int(value: Any, min_value: int, max_value: int) -> int | None:
    if isinstance(value, bool):
        return None

    candidate = value
    if isinstance(candidate, str):
        trimmed = candidate.strip()
        if trimmed.isdigit():
            candidate = int(trimmed)
        else:
            return None
    elif isinstance(candidate, float):
        candidate = int(round(candidate))

    if not isinstance(candidate, int):
        return None

    return max(min_value, min(max_value, candidate))


def _build_analysis_result(parsed_json: dict[str, Any] | None, raw_text: str) -> ResumeAnalysisResult:
    if not isinstance(parsed_json, dict):
        fallback_summary = raw_text.strip()[:1800] if raw_text else "No analysis details returned by model."
        return ResumeAnalysisResult(summary=fallback_summary, raw_response=raw_text, analyzed_at=datetime.now(timezone.utc))

    ats_score = _bounded_int(parsed_json.get("ats_score_estimate"), min_value=0, max_value=100)

    roles_payload = parsed_json.get("recommended_roles")
    roles: list[ResumeAnalysisRole] = []
    if isinstance(roles_payload, list):
        for item in roles_payload:
            if not isinstance(item, dict):
                continue
            title = item.get("title")
            reason = item.get("reason")
            if isinstance(title, str) and title.strip() and isinstance(reason, str) and reason.strip():
                roles.append(ResumeAnalysisRole(title=title.strip(), reason=reason.strip()))

    bullets_payload = parsed_json.get("improved_bullets")
    bullets: list[ResumeAnalysisBullet] = []
    if isinstance(bullets_payload, list):
        for item in bullets_payload:
            if not isinstance(item, dict):
                continue
            original = item.get("original")
            improved = item.get("improved")
            if isinstance(original, str) and original.strip() and isinstance(improved, str) and improved.strip():
                bullets.append(ResumeAnalysisBullet(original=original.strip(), improved=improved.strip()))

    category_scores_payload = parsed_json.get("category_scores")
    category_scores: ResumeAnalysisCategoryScores | None = None
    if isinstance(category_scores_payload, dict):
        category_scores = ResumeAnalysisCategoryScores(
            impact=_bounded_int(category_scores_payload.get("impact"), min_value=0, max_value=100),
            brevity=_bounded_int(category_scores_payload.get("brevity"), min_value=0, max_value=100),
            style=_bounded_int(category_scores_payload.get("style"), min_value=0, max_value=100),
            soft_skills=_bounded_int(category_scores_payload.get("soft_skills"), min_value=0, max_value=100),
        )

    section_scores_payload = parsed_json.get("section_scores")
    section_scores: ResumeAnalysisSectionScores | None = None
    if isinstance(section_scores_payload, dict):
        section_scores = ResumeAnalysisSectionScores(
            headline=_bounded_int(section_scores_payload.get("headline"), min_value=0, max_value=10),
            summary=_bounded_int(section_scores_payload.get("summary"), min_value=0, max_value=10),
            experience=_bounded_int(section_scores_payload.get("experience"), min_value=0, max_value=10),
            education=_bounded_int(section_scores_payload.get("education"), min_value=0, max_value=10),
        )

    return ResumeAnalysisResult(
        candidate_headline=parsed_json.get("candidate_headline") if isinstance(parsed_json.get("candidate_headline"), str) else None,
        summary=parsed_json.get("summary") if isinstance(parsed_json.get("summary"), str) else None,
        ats_score_estimate=ats_score,
        category_scores=category_scores,
        section_scores=section_scores,
        strengths=_as_string_list(parsed_json.get("strengths")),
        gaps=_as_string_list(parsed_json.get("gaps")),
        priority_fixes=_as_string_list(parsed_json.get("priority_fixes")),
        keywords_to_add=_as_string_list(parsed_json.get("keywords_to_add")),
        recommended_roles=roles,
        improved_bullets=bullets,
        confidence_note=parsed_json.get("confidence_note") if isinstance(parsed_json.get("confidence_note"), str) else None,
        raw_response=raw_text,
        analyzed_at=datetime.now(timezone.utc),
    )


def _build_message_content(base64_png_images: list[str], prompt_text: str = RESUME_ANALYSIS_PROMPT) -> list[dict[str, Any]]:
    message_content: list[dict[str, Any]] = [
        {
            "type": "text",
            "text": prompt_text,
        }
    ]

    for image_base64 in base64_png_images:
        message_content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{image_base64}",
                },
            }
        )

    return message_content


def _call_openai_compatible_chat_completion(
    *,
    client: OpenAI,
    request_kwargs: dict[str, Any],
    provider_name: str,
    request_id: str | None = None,
    call_mode: str = "normal",
):
    started = time.perf_counter()
    _analysis_debug(
        "call_start",
        request_id=request_id,
        provider=provider_name,
        mode=call_mode,
        max_tokens=request_kwargs.get("max_tokens"),
        has_extra_body="extra_body" in request_kwargs,
    )
    try:
        response = client.chat.completions.create(
            **request_kwargs,
            response_format={"type": "json_object"},
        )
        _analysis_debug(
            "call_success",
            request_id=request_id,
            provider=provider_name,
            mode=call_mode,
            variant="strict_json",
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
        )
        return response
    except BadRequestError:
        # Some providers may not support strict JSON response_format.
        _analysis_debug(
            "call_variant_fallback",
            request_id=request_id,
            provider=provider_name,
            mode=call_mode,
            from_variant="strict_json",
            to_variant="plain",
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
        )
        try:
            response = client.chat.completions.create(**request_kwargs)
            _analysis_debug(
                "call_success",
                request_id=request_id,
                provider=provider_name,
                mode=call_mode,
                variant="plain",
                elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
            )
            return response
        except BadRequestError:
            # Retry with minimal kwargs for stricter OpenAI-compatible implementations.
            minimal_request_kwargs = {
                "model": request_kwargs["model"],
                "messages": request_kwargs["messages"],
                "max_tokens": request_kwargs["max_tokens"],
                "temperature": request_kwargs["temperature"],
            }
            _analysis_debug(
                "call_variant_fallback",
                request_id=request_id,
                provider=provider_name,
                mode=call_mode,
                from_variant="plain",
                to_variant="minimal",
                elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
            )
            try:
                response = client.chat.completions.create(**minimal_request_kwargs)
                _analysis_debug(
                    "call_success",
                    request_id=request_id,
                    provider=provider_name,
                    mode=call_mode,
                    variant="minimal",
                    elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
                )
                return response
            except Exception as exc:
                _analysis_debug(
                    "call_error",
                    request_id=request_id,
                    provider=provider_name,
                    mode=call_mode,
                    variant="minimal",
                    elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
                    error=str(exc),
                )
                raise ResumeAnalysisError(f"{provider_name} analysis request failed: {exc}") from exc
        except Exception as exc:
            _analysis_debug(
                "call_error",
                request_id=request_id,
                provider=provider_name,
                mode=call_mode,
                variant="plain",
                elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
                error=str(exc),
            )
            raise ResumeAnalysisError(f"{provider_name} analysis request failed: {exc}") from exc
    except Exception as exc:
        _analysis_debug(
            "call_error",
            request_id=request_id,
            provider=provider_name,
            mode=call_mode,
            variant="strict_json",
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
            error=str(exc),
        )
        raise ResumeAnalysisError(f"{provider_name} analysis request failed: {exc}") from exc


def _is_likely_truncated_json(raw_text: str) -> bool:
    text = raw_text.strip()
    if not text.startswith("{"):
        return False
    return text.count("{") > text.count("}") or not text.endswith("}")


def _analyze_with_openai_compatible_provider(
    *,
    client: OpenAI,
    provider_name: str,
    model: str,
    base64_png_images: list[str],
    extra_body: dict[str, Any] | None = None,
) -> ResumeAnalysisResult:
    request_id = f"{provider_name.lower()}-{int(time.time() * 1000)}"
    started = time.perf_counter()
    _analysis_debug(
        "analysis_start",
        request_id=request_id,
        provider=provider_name,
        model=model,
        images=len(base64_png_images),
        max_tokens=settings.RESUME_ANALYSIS_MAX_TOKENS,
    )

    message_content = _build_message_content(base64_png_images)

    request_kwargs: dict[str, Any] = {
        "model": model,
        "max_tokens": settings.RESUME_ANALYSIS_MAX_TOKENS,
        "temperature": settings.RESUME_ANALYSIS_TEMPERATURE,
        "top_p": settings.RESUME_ANALYSIS_TOP_P,
        "messages": [
            {
                "role": "user",
                "content": message_content,
            }
        ],
    }
    if extra_body is not None:
        request_kwargs["extra_body"] = extra_body

    response = _call_openai_compatible_chat_completion(
        client=client,
        request_kwargs=request_kwargs,
        provider_name=provider_name,
        request_id=request_id,
        call_mode="normal",
    )
    raw_text = _extract_response_text(response)
    parsed_json = _extract_json_object(raw_text)
    _analysis_debug(
        "analysis_parse",
        request_id=request_id,
        provider=provider_name,
        mode="normal",
        raw_length=len(raw_text),
        parsed=parsed_json is not None,
        truncated_hint=_is_likely_truncated_json(raw_text),
        elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
    )
    if parsed_json is not None:
        _analysis_debug(
            "analysis_done",
            request_id=request_id,
            provider=provider_name,
            path="normal",
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
        )
        return _build_analysis_result(parsed_json, raw_text)

    if _is_likely_truncated_json(raw_text):
        compact_prompt = f"{RESUME_ANALYSIS_PROMPT}\n\n{RESUME_ANALYSIS_COMPACT_RETRY_APPENDIX}"
        compact_message_content = _build_message_content(base64_png_images, prompt_text=compact_prompt)
        _analysis_debug(
            "analysis_compact_retry_start",
            request_id=request_id,
            provider=provider_name,
            first_raw_length=len(raw_text),
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
        )
        retry_kwargs: dict[str, Any] = {
            "model": model,
            "max_tokens": max(settings.RESUME_ANALYSIS_MAX_TOKENS, 1800),
            "temperature": min(settings.RESUME_ANALYSIS_TEMPERATURE, 0.25),
            "top_p": settings.RESUME_ANALYSIS_TOP_P,
            "messages": [
                {
                    "role": "user",
                    "content": compact_message_content,
                }
            ],
        }
        if extra_body is not None:
            retry_kwargs["extra_body"] = extra_body

        retry_response = _call_openai_compatible_chat_completion(
            client=client,
            request_kwargs=retry_kwargs,
            provider_name=provider_name,
            request_id=request_id,
            call_mode="compact_retry",
        )
        retry_raw_text = _extract_response_text(retry_response)
        retry_parsed_json = _extract_json_object(retry_raw_text)
        _analysis_debug(
            "analysis_parse",
            request_id=request_id,
            provider=provider_name,
            mode="compact_retry",
            raw_length=len(retry_raw_text),
            parsed=retry_parsed_json is not None,
            truncated_hint=_is_likely_truncated_json(retry_raw_text),
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
        )
        _analysis_debug(
            "analysis_done",
            request_id=request_id,
            provider=provider_name,
            path="compact_retry",
            elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
        )
        return _build_analysis_result(retry_parsed_json, retry_raw_text)

    _analysis_debug(
        "analysis_done",
        request_id=request_id,
        provider=provider_name,
        path="fallback_raw",
        elapsed_ms=round((time.perf_counter() - started) * 1000, 1),
    )
    return _build_analysis_result(parsed_json, raw_text)


def analyze_resume_with_nebius(base64_png_images: list[str]) -> ResumeAnalysisResult:
    if not base64_png_images:
        raise ResumeAnalysisError("No resume pages were available for analysis")

    if not settings.NEBIUS_API_KEY:
        raise ResumeAnalysisError("NEBIUS_API_KEY is not configured on the backend")

    client = OpenAI(
        base_url=settings.NEBIUS_BASE_URL,
        api_key=settings.NEBIUS_API_KEY,
    )
    return _analyze_with_openai_compatible_provider(
        client=client,
        provider_name="Nebius",
        model=settings.NEBIUS_MODEL,
        base64_png_images=base64_png_images,
        extra_body={"top_k": settings.RESUME_ANALYSIS_TOP_K},
    )


def analyze_resume_with_chutes(base64_png_images: list[str]) -> ResumeAnalysisResult:
    if not base64_png_images:
        raise ResumeAnalysisError("No resume pages were available for analysis")

    if not settings.CHUTES_API_TOKEN:
        raise ResumeAnalysisError("CHUTES_API_TOKEN is not configured on the backend")

    client = OpenAI(
        base_url=settings.CHUTES_BASE_URL,
        api_key=settings.CHUTES_API_TOKEN,
    )
    return _analyze_with_openai_compatible_provider(
        client=client,
        provider_name="Chutes",
        model=settings.CHUTES_MODEL,
        base64_png_images=base64_png_images,
    )


def analyze_resume(base64_png_images: list[str]) -> ResumeAnalysisResult:
    provider = settings.RESUME_IMAGE_PROCESSING_PROVIDER.strip().lower()

    if provider == "nebius":
        return analyze_resume_with_nebius(base64_png_images)

    if provider == "chutes":
        return analyze_resume_with_chutes(base64_png_images)

    raise ResumeAnalysisError(
        "RESUME_IMAGE_PROCESSING_PROVIDER must be either 'nebius' or 'chutes'"
    )
