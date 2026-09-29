from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User
from backend.app.calculations.health import calculate_financial_health
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/financial-health", tags=["Financial Health"])

@router.get("")
def get_health_indicators(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    return calculate_financial_health(user.id, db)
