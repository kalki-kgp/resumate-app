from typing import Any

from pydantic import BaseModel, Field


class ExtractedDataResponse(BaseModel):
    resume_id: str
    extracted_data: dict[str, Any] | None = None


class FillTemplateRequest(BaseModel):
    extracted_data_override: dict[str, Any] | None = Field(
        default=None,
        description="Optional override for extracted data instead of using stored data",
    )


class PersonalInfoFilled(BaseModel):
    fullName: str = ""
    role: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    summary: str = ""


class ExperienceFilled(BaseModel):
    id: int
    role: str = ""
    company: str = ""
    date: str = ""
    description: str = ""


class EducationFilled(BaseModel):
    id: int
    degree: str = ""
    school: str = ""
    date: str = ""


class ProjectFilled(BaseModel):
    id: int
    name: str = ""
    description: str = ""
    date: str = ""


class ResumeDataFilled(BaseModel):
    personal: PersonalInfoFilled = Field(default_factory=PersonalInfoFilled)
    experience: list[ExperienceFilled] = Field(default_factory=list)
    projects: list[ProjectFilled] = Field(default_factory=list)
    education: list[EducationFilled] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)


class FillTemplateResponse(BaseModel):
    resume_id: str
    data: ResumeDataFilled
