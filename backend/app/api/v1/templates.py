from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User

router = APIRouter()

PREMIUM_TEMPLATES = {"executive"}
TEMPLATE_PRICE = 50


class AddCreditsRequest(BaseModel):
    credits: int = Field(gt=0, le=10000)


class AddCreditsResponse(BaseModel):
    credits_added: int
    credits_remaining: int


@router.post("/add-credits", response_model=AddCreditsResponse)
def add_credits(
    payload: AddCreditsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.credits += payload.credits
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return AddCreditsResponse(
        credits_added=payload.credits,
        credits_remaining=current_user.credits,
    )


class PurchaseTemplateRequest(BaseModel):
    template_id: str = Field(min_length=1, max_length=50)


class PurchaseTemplateResponse(BaseModel):
    template_id: str
    credits_remaining: int
    purchased_templates: list[str]


@router.post("/purchase", response_model=PurchaseTemplateResponse)
def purchase_template(
    payload: PurchaseTemplateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template_id = payload.template_id.strip().lower()

    if template_id not in PREMIUM_TEMPLATES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown premium template: {template_id}",
        )

    if template_id in (current_user.purchased_templates or []):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Template already purchased.",
        )

    if current_user.credits < TEMPLATE_PRICE:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. You need {TEMPLATE_PRICE} credits but have {current_user.credits}.",
        )

    current_user.credits -= TEMPLATE_PRICE
    current_user.purchased_templates = (current_user.purchased_templates or []) + [template_id]
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return PurchaseTemplateResponse(
        template_id=template_id,
        credits_remaining=current_user.credits,
        purchased_templates=current_user.purchased_templates,
    )
