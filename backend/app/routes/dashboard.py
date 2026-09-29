from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Alert
from backend.app.calculations import (
    calculate_monthly_cashflow,
    calculate_net_worth,
    calculate_investment_portfolio,
    calculate_loans_summary,
    get_all_goals_summary,
    calculate_financial_health
)
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_data(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    cashflow = calculate_monthly_cashflow(user.id, db)
    networth = calculate_net_worth(user.id, db)
    investments = calculate_investment_portfolio(user.id, db)
    loans = calculate_loans_summary(user.id, db)
    goals = get_all_goals_summary(user.id, db)
    health = calculate_financial_health(user.id, db)

    # Emergency fund months
    ef_months = round(networth["liquid_savings"] / cashflow["monthly_expenses"], 1) if cashflow["monthly_expenses"] > 0 else 0

    # Unread alerts count
    unread_alerts = db.query(Alert).filter(Alert.user_id == user.id, Alert.is_read == False).count()

    top_cards = {
        "net_worth": {
            "value": networth["net_worth"],
            "formatted": f"₹{(networth['net_worth'] / 100000):.1f}L",
            "trend": "+4.2% MoM",
            "positive": True,
            "subtitle": f"Total Assets: ₹{(networth['total_assets'] / 100000):.1f}L | Debts: ₹{(networth['total_liabilities'] / 100000):.1f}L"
        },
        "monthly_income": {
            "value": cashflow["monthly_income"],
            "formatted": f"₹{(cashflow['monthly_income'] / 100000):.2f}L",
            "trend": "Stable",
            "positive": True,
            "subtitle": "Salaried post-tax inflow"
        },
        "monthly_expenses": {
            "value": cashflow["monthly_expenses"],
            "formatted": f"₹{int(cashflow['monthly_expenses'] / 1000)}K",
            "trend": "+8.9% spike",
            "positive": False,
            "subtitle": "Discretionary + Essential"
        },
        "investments": {
            "value": investments["total_current_value"],
            "formatted": f"₹{(investments['total_current_value'] / 100000):.1f}L",
            "trend": f"+{investments['total_returns_pct']}% all-time",
            "positive": True,
            "subtitle": f"SIP: ₹{investments['monthly_sip_total']:,.0f}/mo"
        },
        "loans": {
            "value": loans["total_outstanding"],
            "formatted": f"₹{(loans['total_outstanding'] / 100000):.1f}L",
            "trend": f"{loans['dti_ratio']}% DTI",
            "positive": True,
            "subtitle": f"EMI: ₹{loans['total_emi']:,.0f}/mo"
        },
        "savings_rate": {
            "value": cashflow["savings_rate"],
            "formatted": f"{cashflow['savings_rate']}%",
            "trend": "Benchmark: >20%",
            "positive": True,
            "subtitle": f"Surplus: ₹{cashflow['monthly_surplus']:,.0f}"
        },
        "emergency_fund": {
            "value": ef_months,
            "formatted": f"{ef_months} months",
            "trend": "Target: 6.0 mo",
            "positive": False,
            "subtitle": f"Reserve: ₹{networth['liquid_savings']:,.0f}"
        }
    }

    return {
        "cards": top_cards,
        "net_worth_trend": networth["history"],
        "cashflow_history": cashflow["history"],
        "expense_breakdown": cashflow["expense_categories"],
        "investment_allocation": investments["asset_allocation"],
        "financial_health_score": health["overall_score"],
        "financial_health_rating": health["overall_rating"],
        "unread_alerts_count": unread_alerts,
        "is_demo": True
    }
