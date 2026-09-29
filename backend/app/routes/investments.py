from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Investment
from backend.app.schemas.schemas import InvestmentCreate, InvestmentResponse
from backend.app.calculations.investments import calculate_investment_portfolio
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/investments", tags=["Investments"])

@router.get("")
def get_investments_data(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    portfolio = calculate_investment_portfolio(user.id, db)
    holdings = db.query(Investment).filter(Investment.user_id == user.id).all()

    return {
        "summary": portfolio,
        "holdings": holdings
    }

@router.post("", response_model=InvestmentResponse)
def add_investment(inv: InvestmentCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    returns_pct = round(((inv.current_value - inv.invested_amount) / inv.invested_amount * 100.0), 1) if inv.invested_amount > 0 else 0.0

    new_inv = Investment(
        user_id=user.id,
        name=inv.name,
        asset_class=inv.asset_class,
        sector=inv.sector,
        invested_amount=inv.invested_amount,
        current_value=inv.current_value,
        returns_percentage=returns_pct,
        monthly_sip=inv.monthly_sip
    )
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)
    return new_inv

@router.delete("/{inv_id}")
def delete_investment(inv_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    inv = db.query(Investment).filter(Investment.id == inv_id, Investment.user_id == user.id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Holding not found")
    db.delete(inv)
    db.commit()
    return {"status": "success", "message": "Holding deleted"}
