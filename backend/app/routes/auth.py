from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import LoginRequest, TokenResponse
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)
    
    return {
        "access_token": "demo-token-session-123",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_demo": user.is_demo
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # For prototype simplicity, auto-seed demo account if requested or create simple session
        user = seed_demo_data(db)
    
    return {
        "access_token": "token-session-123",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_demo": user.is_demo
        }
    }

@router.get("/me")
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "is_demo": user.is_demo
    }
