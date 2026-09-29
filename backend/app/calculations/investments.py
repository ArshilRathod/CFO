from sqlalchemy.orm import Session
from backend.app.models.models import Investment
from collections import defaultdict

def calculate_investment_portfolio(user_id: int, db: Session):
    holdings = db.query(Investment).filter(Investment.user_id == user_id).all()
    
    total_invested = sum(h.invested_amount for h in holdings) if holdings else 1240000.0
    total_current = sum(h.current_value for h in holdings) if holdings else 1420000.0
    total_returns = total_current - total_invested
    total_returns_pct = (total_returns / total_invested * 100.0) if total_invested > 0 else 0.0
    monthly_sip_total = sum(h.monthly_sip for h in holdings) if holdings else 25000.0

    # Asset class breakdown
    asset_dict = defaultdict(float)
    sector_dict = defaultdict(float)

    for h in holdings:
        asset_dict[h.asset_class] += h.current_value
        sector_dict[h.sector] += h.current_value

    asset_colors = {
        "Equity": "#3B82F6",
        "Debt": "#10B981",
        "Gold": "#F59E0B",
        "Cash": "#8B5CF6"
    }

    asset_allocation = []
    for asset, val in asset_dict.items():
        pct = round((val / total_current * 100.0), 1) if total_current > 0 else 0
        asset_allocation.append({
            "asset_class": asset,
            "value": round(val, 2),
            "percentage": pct,
            "color": asset_colors.get(asset, "#94A3B8")
        })

    sector_allocation = []
    for sector, val in sector_dict.items():
        pct = round((val / total_current * 100.0), 1) if total_current > 0 else 0
        sector_allocation.append({
            "sector": sector,
            "value": round(val, 2),
            "percentage": pct
        })

    performance_history = [
        {"month": "Oct", "invested": 1115000, "value": 1220000, "gain": 105000},
        {"month": "Nov", "invested": 1140000, "value": 1260000, "gain": 120000},
        {"month": "Dec", "invested": 1170000, "value": 1320000, "gain": 150000},
        {"month": "Jan", "invested": 1195000, "value": 1355000, "gain": 160000},
        {"month": "Feb", "invested": 1220000, "value": 1390000, "gain": 170000},
        {"month": "Mar", "invested": round(total_invested, 2), "value": round(total_current, 2), "gain": round(total_returns, 2)},
    ]

    return {
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current, 2),
        "total_returns": round(total_returns, 2),
        "total_returns_pct": round(total_returns_pct, 2),
        "monthly_sip_total": round(monthly_sip_total, 2),
        "asset_allocation": asset_allocation,
        "sector_allocation": sector_allocation,
        "performance_history": performance_history,
        "is_demo_data": True,
        "data_notice": "Demo market data - static simulation for prototype testing"
    }
