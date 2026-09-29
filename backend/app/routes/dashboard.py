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
    alerts_list = db.query(Alert).filter(Alert.user_id == user.id).limit(4).all()

    upcoming_commitments = [
        {"name": "Apartment Rent", "due_date": "3rd of every month", "amount": 18000, "category": "Housing", "status": "Scheduled Auto-Debit", "account": "HDFC Salary Account"},
        {"name": "Axis Auto Loan EMI", "due_date": "5th of every month", "amount": 12000, "category": "Debt Obligations", "status": "Scheduled Auto-Debit", "account": "HDFC Salary Account"},
        {"name": "Mutual Funds SIP Basket", "due_date": "7th of every month", "amount": 25000, "category": "Investment Contributions", "status": "Scheduled Auto-Debit", "account": "Zerodha Broking"},
    ]

    top_cards = {
        "financial_health": {
            "value": 82,
            "formatted": "82 / 100",
            "trend": "Strong / Balanced",
            "positive": True,
            "subtitle": "Evaluated across 6 pillars"
        },
        "monthly_income": {
            "value": cashflow["monthly_income"],
            "formatted": f"₹{cashflow['monthly_income']:,.0f}",
            "trend": "Post-Tax Salary",
            "positive": True,
            "subtitle": "Salaried post-tax inflow"
        },
        "free_surplus": {
            "value": cashflow["monthly_surplus"],
            "formatted": f"₹{cashflow['monthly_surplus']:,.0f}",
            "trend": "20.8% Surplus Rate",
            "positive": True,
            "subtitle": "Free unallocated cash buffer"
        },
        "investment_contribution": {
            "value": cashflow["monthly_investments"],
            "formatted": f"₹{cashflow['monthly_investments']:,.0f}",
            "trend": "20.8% of Income",
            "positive": True,
            "subtitle": "Automated monthly SIP"
        },
        "debt_emi": {
            "value": loans["total_emi"],
            "formatted": f"₹{loans['total_emi']:,.0f}",
            "trend": "10.0% DTI",
            "positive": True,
            "subtitle": "Manageable auto loan EMI"
        },
        "monthly_expenses": {
            "value": cashflow["monthly_expenses"],
            "formatted": f"₹{cashflow['monthly_expenses']:,.0f}",
            "trend": "48.3% of Income",
            "positive": False,
            "subtitle": "Discretionary & Essential"
        },
        "net_worth": {
            "value": networth["net_worth"],
            "formatted": f"₹{(networth['net_worth'] / 100000):.1f}L",
            "trend": "+14.2% 6-Mo Growth",
            "positive": True,
            "subtitle": f"Assets: ₹{(networth['total_assets'] / 100000):.1f}L | Debts: ₹{(networth['total_liabilities'] / 100000):.1f}L"
        },
        "savings_rate": {
            "value": 20.8,
            "formatted": "20.8%",
            "trend": "Surplus Rate",
            "positive": True,
            "subtitle": "Surplus: ₹25,000/mo"
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
        "emergency_fund": {
            "value": ef_months,
            "formatted": f"{ef_months} months",
            "trend": "Target: 6.0 mo",
            "positive": False,
            "subtitle": f"Reserve: ₹{networth['liquid_savings']:,.0f}"
        }
    }

    ai_insight = {
        "text": "Your monthly cash flow remains positive with ₹25,000 free surplus. Your ₹25,000 monthly investment contribution is currently supported by your cash flow, while your ₹12,000 EMI remains manageable.",
        "action_prompt": "Can I afford a ₹10 lakh car next year?",
        "action_label": "ASK AI CFO →"
    }

    return {
        "cards": top_cards,
        "ai_insight": ai_insight,
        "upcoming_commitments": upcoming_commitments,
        "goals": goals["goals"],
        "alerts": [{"id": a.id, "title": a.title, "message": a.message, "severity": a.severity, "category": a.category, "is_read": a.is_read} for a in alerts_list],
        "net_worth_trend": networth["history"],
        "cashflow_history": cashflow["history"],
        "expense_breakdown": cashflow["expense_categories"],
        "investment_allocation": investments["asset_allocation"],
        "financial_health_score": health["overall_score"],
        "financial_health_rating": health["overall_rating"],
        "unread_alerts_count": unread_alerts,
        "is_demo": True
    }
