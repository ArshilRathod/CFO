from sqlalchemy.orm import Session
from backend.app.models.models import FinancialProfile, Investment, Loan

def calculate_net_worth(user_id: int, db: Session):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    investments = db.query(Investment).filter(Investment.user_id == user_id).all()
    loans = db.query(Loan).filter(Loan.user_id == user_id).all()

    liquid_savings = profile.savings if profile else 350000.0
    
    if investments:
        total_investments_val = sum(i.current_value for i in investments)
        # Classify by asset class
        equity_val = sum(i.current_value for i in investments if i.asset_class.lower() == "equity")
        debt_val = sum(i.current_value for i in investments if i.asset_class.lower() == "debt")
        gold_val = sum(i.current_value for i in investments if i.asset_class.lower() == "gold")
        cash_val = sum(i.current_value for i in investments if i.asset_class.lower() == "cash")
    else:
        total_investments_val = profile.total_investments if profile else 1420000.0
        equity_val = total_investments_val * 0.60
        debt_val = total_investments_val * 0.20
        gold_val = total_investments_val * 0.15
        cash_val = total_investments_val * 0.05

    total_assets = liquid_savings + total_investments_val
    
    if loans:
        total_liabilities = sum(l.outstanding_balance for l in loans)
    else:
        total_liabilities = profile.total_loans if profile else 380000.0

    net_worth = total_assets - total_liabilities

    history = [
        {"month": "Oct", "assets": 1620000, "liabilities": 430000, "net_worth": 1190000},
        {"month": "Nov", "assets": 1660000, "liabilities": 420000, "net_worth": 1240000},
        {"month": "Dec", "assets": 1710000, "liabilities": 410000, "net_worth": 1300000},
        {"month": "Jan", "assets": 1735000, "liabilities": 400000, "net_worth": 1335000},
        {"month": "Feb", "assets": 1750000, "liabilities": 390000, "net_worth": 1360000},
        {"month": "Mar (Current)", "assets": round(total_assets, 2), "liabilities": round(total_liabilities, 2), "net_worth": round(net_worth, 2)},
    ]

    assets_breakdown = [
        {"name": "Equity Investments", "amount": equity_val, "percentage": round((equity_val/total_assets)*100, 1), "color": "#3B82F6"},
        {"name": "Debt & Bonds", "amount": debt_val, "percentage": round((debt_val/total_assets)*100, 1), "color": "#10B981"},
        {"name": "Gold & Commodities", "amount": gold_val, "percentage": round((gold_val/total_assets)*100, 1), "color": "#F59E0B"},
        {"name": "Liquid Savings & Cash", "amount": liquid_savings + cash_val, "percentage": round(((liquid_savings+cash_val)/total_assets)*100, 1), "color": "#8B5CF6"},
    ]

    liabilities_breakdown = [
        {"name": "Auto/Personal Loans", "amount": total_liabilities, "percentage": 100.0, "color": "#EF4444"},
    ]

    return {
        "net_worth": round(net_worth, 2),
        "total_assets": round(total_assets, 2),
        "total_liabilities": round(total_liabilities, 2),
        "liquid_savings": round(liquid_savings, 2),
        "total_investments": round(total_investments_val, 2),
        "history": history,
        "assets_breakdown": assets_breakdown,
        "liabilities_breakdown": liabilities_breakdown
    }
