import math
from sqlalchemy.orm import Session
from backend.app.models.models import Loan, FinancialProfile

def calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> float:
    if tenure_months <= 0 or principal <= 0:
        return 0.0
    r = (annual_rate / 100.0) / 12.0
    if r == 0:
        return principal / tenure_months
    emi = principal * (r * math.pow(1 + r, tenure_months)) / (math.pow(1 + r, tenure_months) - 1)
    return round(emi, 2)

def calculate_tenure(principal: float, annual_rate: float, emi: float) -> int:
    r = (annual_rate / 100.0) / 12.0
    if r == 0:
        return math.ceil(principal / emi) if emi > 0 else 0
    if emi <= principal * r:
        return 999 # EMI does not even cover interest
    # Formula: n = log(EMI / (EMI - P*r)) / log(1 + r)
    n = math.log(emi / (emi - principal * r)) / math.log(1 + r)
    return math.ceil(n)

def calculate_loans_summary(user_id: int, db: Session):
    loans = db.query(Loan).filter(Loan.user_id == user_id).all()
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    
    total_outstanding = sum(l.outstanding_balance for l in loans) if loans else 380000.0
    total_emi = sum(l.emi for l in loans) if loans else 12000.0
    monthly_income = profile.monthly_income if profile else 120000.0
    dti_ratio = round((total_emi / monthly_income * 100.0), 1) if monthly_income > 0 else 0.0

    loan_items = []
    for l in loans:
        r = (l.interest_rate / 100.0) / 12.0
        n = l.remaining_tenure_months
        total_payment = l.emi * n
        interest_left = max(0.0, total_payment - l.outstanding_balance)
        loan_items.append({
            "id": l.id,
            "name": l.name,
            "principal": l.principal,
            "outstanding_balance": l.outstanding_balance,
            "interest_rate": l.interest_rate,
            "emi": l.emi,
            "remaining_tenure_months": l.remaining_tenure_months,
            "total_interest_estimated": round(interest_left, 2),
            "progress_pct": round(((l.principal - l.outstanding_balance) / l.principal * 100.0), 1) if l.principal > 0 else 0.0
        })

    return {
        "total_outstanding": round(total_outstanding, 2),
        "total_emi": round(total_emi, 2),
        "dti_ratio": dti_ratio,
        "loans": loan_items
    }

def simulate_loan(
    principal: float,
    interest_rate: float,
    current_emi: float,
    current_tenure: int,
    scenario_emi: float = None,
    scenario_rate: float = None,
    scenario_tenure: int = None
):
    rate = scenario_rate if scenario_rate is not None else interest_rate
    
    # Baseline
    baseline_emi = current_emi
    baseline_tenure = current_tenure
    baseline_total_payment = baseline_emi * baseline_tenure
    baseline_interest = max(0.0, baseline_total_payment - principal)

    # Scenario computation
    if scenario_emi and scenario_emi > 0:
        new_emi = scenario_emi
        new_tenure = calculate_tenure(principal, rate, new_emi)
        new_total_payment = new_emi * new_tenure
        new_interest = max(0.0, new_total_payment - principal)
    elif scenario_tenure and scenario_tenure > 0:
        new_tenure = scenario_tenure
        new_emi = calculate_emi(principal, rate, new_tenure)
        new_total_payment = new_emi * new_tenure
        new_interest = max(0.0, new_total_payment - principal)
    else:
        new_emi = calculate_emi(principal, rate, baseline_tenure)
        new_tenure = baseline_tenure
        new_total_payment = new_emi * new_tenure
        new_interest = max(0.0, new_total_payment - principal)

    interest_saved = round(baseline_interest - new_interest, 2)
    tenure_reduced_months = baseline_tenure - new_tenure

    return {
        "current": {
            "principal": round(principal, 2),
            "interest_rate": interest_rate,
            "emi": round(baseline_emi, 2),
            "tenure_months": baseline_tenure,
            "total_interest": round(baseline_interest, 2),
            "total_payable": round(baseline_total_payment, 2)
        },
        "scenario": {
            "principal": round(principal, 2),
            "interest_rate": rate,
            "emi": round(new_emi, 2),
            "tenure_months": new_tenure,
            "total_interest": round(new_interest, 2),
            "total_payable": round(new_total_payment, 2)
        },
        "comparison": {
            "interest_saved": interest_saved,
            "tenure_difference_months": tenure_reduced_months,
            "monthly_cashflow_impact": round(baseline_emi - new_emi, 2),
            "summary": f"{'Save ₹' + f'{abs(interest_saved):,}' + ' in interest' if interest_saved > 0 else 'Additional interest: ₹' + f'{abs(interest_saved):,}'} and {'finish ' + str(abs(tenure_reduced_months)) + ' months earlier' if tenure_reduced_months > 0 else 'extends by ' + str(abs(tenure_reduced_months)) + ' months'}"
        }
    }
