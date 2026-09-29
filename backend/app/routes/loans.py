from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Loan
from backend.app.schemas.schemas import LoanCreate, LoanResponse, LoanSimulateRequest
from backend.app.calculations.loans import calculate_loans_summary, simulate_loan
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.get("")
def get_loans_data(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    return calculate_loans_summary(user.id, db)

@router.post("/simulate")
def simulate_loan_repayment(req: LoanSimulateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    loan = None
    if req.loan_id:
        loan = db.query(Loan).filter(Loan.id == req.loan_id, Loan.user_id == user.id).first()
    
    if not loan:
        loan = db.query(Loan).filter(Loan.user_id == user.id).first()

    principal = req.principal if req.principal is not None else (loan.outstanding_balance if loan else 380000.0)
    rate = req.interest_rate if req.interest_rate is not None else (loan.interest_rate if loan else 9.5)
    current_emi = loan.emi if loan else 12000.0
    current_tenure = loan.remaining_tenure_months if loan else 36

    result = simulate_loan(
        principal=principal,
        interest_rate=rate,
        current_emi=current_emi,
        current_tenure=current_tenure,
        scenario_emi=req.emi,
        scenario_rate=req.interest_rate,
        scenario_tenure=req.tenure_months
    )
    return result
