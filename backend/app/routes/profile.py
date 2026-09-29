from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, FinancialProfile
from backend.app.schemas.schemas import FinancialProfileBase, FinancialProfileResponse
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=FinancialProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user or not user.profile:
        user = seed_demo_data(db)
    return user.profile

@router.put("", response_model=FinancialProfileResponse)
def update_profile(profile_data: FinancialProfileBase, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)
    
    profile = user.profile
    if not profile:
        profile = FinancialProfile(user_id=user.id)
        db.add(profile)

    for field, val in profile_data.model_dump().items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
