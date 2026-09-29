from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Scenario
from backend.app.schemas.schemas import SimulationRequest, SimulationResult
from backend.app.calculations.simulator import run_what_if_simulation
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/simulate", tags=["What-If Simulator"])

@router.post("", response_model=SimulationResult)
def simulate(req: SimulationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    result = run_what_if_simulation(user.id, db, req.model_dump())
    return result

@router.get("/scenarios")
def get_saved_scenarios(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    scenarios = db.query(Scenario).filter(Scenario.user_id == user.id).order_by(Scenario.created_at.desc()).all()
    return scenarios

@router.post("/save")
def save_scenario(name: str, req: SimulationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    scen = Scenario(
        user_id=user.id,
        name=name,
        description=f"Preset: {req.scenario_preset or 'Custom'}",
        income_change_pct=req.income_change_pct,
        expense_change_pct=req.expense_change_pct,
        additional_sip=req.additional_sip,
        purchase_price=req.purchase_price,
        down_payment=req.down_payment,
        loan_tenure_years=req.loan_tenure_years,
        interest_rate=req.interest_rate,
        job_loss_months=req.job_loss_months
    )
    db.add(scen)
    db.commit()
    db.refresh(scen)
    return {"status": "success", "message": "Scenario saved", "id": scen.id}
