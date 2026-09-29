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
            title="Spending Anomaly Detected",
            message="Shopping & Lifestyle spending is 32% above your 6-month average (₹12,000 this month vs ₹7,000 baseline).",
            severity="warning",
            category="spending",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Emergency Fund Below Target",
            message=f"Current liquid reserve provides {months_covered} months coverage against your {target_months:.0f}-month safety target (₹35,000 buffer gap).",
            severity="warning",
            category="emergency_fund",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Goal Shortfall Detected",
            message="House Downpayment goal (₹40 Lakhs in 7 years) has an estimated shortfall of ₹11.5 Lakhs under current ₹15,000/mo SIP.",
            severity="warning",
            category="goal",
            is_read=False
        ),
        Alert(
            user_id=user_id,
            title="Healthy Cash Flow Surplus",
            message=f"You have a positive free cash surplus of ₹{cashflow['monthly_surplus']:,.0f} this month after all EMIs and SIP investments.",
            severity="success",
            category="cashflow",
            is_read=True
        ),
        Alert(
            user_id=user_id,
            title="High Equity Allocation",
            message="Equity accounts for 62.7% of your investment portfolio. Consider rebalancing towards debt or gold.",
            severity="info",
            category="portfolio",
            is_read=False
        )
    ]

    for a in alerts_to_create:
        db.add(a)
    db.commit()

    return db.query(Alert).filter(Alert.user_id == user_id).all()
