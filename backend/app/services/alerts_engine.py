from sqlalchemy.orm import Session
from backend.app.models.models import Alert, FinancialProfile, Transaction
from backend.app.calculations.cashflow import calculate_monthly_cashflow
from backend.app.calculations.net_worth import calculate_net_worth

def generate_user_alerts(user_id: int, db: Session):
    # Check if alerts already exist
    existing_alerts = db.query(Alert).filter(Alert.user_id == user_id).all()
    if existing_alerts:
        return existing_alerts

    # Fresh rule evaluation
    cashflow = calculate_monthly_cashflow(user_id, db)
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    
    expenses = cashflow["monthly_expenses"]
    savings = profile.savings if profile else 350000.0
    months_covered = round(savings / expenses, 1) if expenses > 0 else 0
    target_months = profile.emergency_fund_target_months if profile else 6.0

    alerts_to_create = [
        Alert(
            user_id=user_id,
            title="Cash Flow Alert: Discretionary Spending",
            message="Your discretionary spending increased 14% this month (₹18,500 vs ₹16,200 previous month).",
            severity="warning",
            category="cashflow",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Goal Alert: House Downpayment Timeline",
            message="Your current contribution rate may delay your financial goal (₹15,000/mo allocation vs required ₹28,000/mo for 7-year target).",
            severity="warning",
            category="goal",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Debt Commitment: Scheduled EMI Outflow",
            message=f"Your upcoming EMI represents ₹{cashflow.get('monthly_debt_emi', 12000):,.0f} of monthly cash outflow ({cashflow.get('debt_to_income_ratio', 10.0):.1f}% of income).",
            severity="info",
            category="debt",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Positive Insight: Disciplined Investment Execution",
            message=f"Your monthly investment contribution increased while maintaining positive cash flow (₹{cashflow.get('monthly_investments', 25000):,.0f} SIP with ₹{cashflow.get('monthly_surplus', 25000):,.0f} free surplus).",
            severity="success",
            category="investment",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Emergency Reserve Buffer",
            message=f"Current liquid reserve provides {months_covered} months coverage against your {target_months:.0f}-month safety target (₹35,000 buffer gap).",
            severity="warning",
            category="emergency_fund",
            is_read=True
        )
    ]

    for a in alerts_to_create:
        db.add(a)
    db.commit()

    return db.query(Alert).filter(Alert.user_id == user_id).all()
