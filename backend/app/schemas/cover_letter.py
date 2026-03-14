from typing import Any

from pydantic import BaseModel, Field


class GenerateCoverLetterRequest(BaseModel):
    job_description: str = Field(
        description="The job description to tailor the cover letter to",
    )
    tone: str = Field(
        default="professional",
        description="Tone of the cover letter: professional, conversational, confident, enthusiastic",
    )
    additional_instructions: str = Field(
        default="",
        description="Optional additional instructions for the AI",
    )


class CoverLetterData(BaseModel):
    recipientName: str = ""
    companyName: str = ""
    date: str = ""
    greeting: str = ""
    opening: str = ""
    body: list[str] = Field(default_factory=list)
    closing: str = ""
    signOff: str = ""
    senderName: str = ""


class GenerateCoverLetterResponse(BaseModel):
    resume_id: str
    cover_letter: CoverLetterData


class RefineParagraphRequest(BaseModel):
    paragraph_text: str = Field(
        description="Current text of the paragraph to refine",
    )
    paragraph_type: str = Field(
        description="Type of paragraph: opening, body, closing",
    )
    prompt: str = Field(
        description="User's instruction for how to refine the paragraph",
    )
    context: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional context (job description, tone, etc.)",
    )


class RefineParagraphResponse(BaseModel):
    refined_text: str
    paragraph_type: str


class SaveCoverLetterRequest(BaseModel):
    resume_id: str = ""
    job_description: str = ""
    tone: str = "professional"
    cover_letter: CoverLetterData


class SavedCoverLetterResponse(BaseModel):
    id: str
    resume_id: str | None
    company_name: str
    tone: str
    cover_letter: CoverLetterData
    created_at: str
    updated_at: str


class SavedCoverLetterListItem(BaseModel):
    id: str
    company_name: str
    tone: str
    sender_name: str
    created_at: str
