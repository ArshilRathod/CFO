from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User
from backend.app.calculations.cashflow import calculate_monthly_cashflow
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/cashflow", tags=["Cash Flow"])

@router.get("")
def get_cashflow_details(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    cashflow = calculate_monthly_cashflow(user.id, db)
    return cashflow
