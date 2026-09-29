from sqlalchemy.orm import Session
from backend.app.models.models import FinancialProfile, Loan, Investment, Goal
from backend.app.calculations.cashflow import calculate_monthly_cashflow
from backend.app.calculations.investments import calculate_investment_portfolio

def calculate_financial_health(user_id: int, db: Session):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    cashflow = calculate_monthly_cashflow(user_id, db)
    portfolio = calculate_investment_portfolio(user_id, db)
    loans = db.query(Loan).filter(Loan.user_id == user_id).all()
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()

    # 1. Cash Flow Health
    surplus = cashflow["monthly_surplus"]
    income = cashflow["monthly_income"]
    surplus_pct = (surplus / income * 100.0) if income > 0 else 0
    if surplus_pct >= 20:
        cf_status = "Good"
        cf_badge = "🟢"
        cf_score = 90
        cf_reason = f"Monthly free cash surplus is ₹{surplus:,.0f} ({surplus_pct:.1f}% of income), providing strong flexibility."
        cf_action = "Consider deploying ₹10,000 of surplus into high-yield debt or index SIPs."
    elif surplus_pct >= 5:
        cf_status = "Needs Attention"
        cf_badge = "🟡"
        cf_score = 70
        cf_reason = f"Monthly surplus is ₹{surplus:,.0f} ({surplus_pct:.1f}% of income), which is slightly tight."
        cf_action = "Review discretionary shopping and dining expenses to boost monthly buffer."
    else:
        cf_status = "High Risk"
        cf_badge = "🔴"
        cf_score = 40
        cf_reason = f"Monthly cash flow is zero or negative (₹{surplus:,.0f}), indicating spending exceeds income."
        cf_action = "Immediately curtail non-essential expenses and restructure high-interest EMIs."

    # 2. Savings Rate Health
    savings_rate = cashflow["savings_rate"]
    if savings_rate >= 40:
        sav_status = "Good"
        sav_badge = "🟢"
        sav_score = 95
        sav_reason = f"Current savings and investment rate is {savings_rate}%, significantly exceeding the 20% benchmark."
        sav_action = "Maintain disciplined automated SIPs at this savings rate to preserve compounding."
    elif savings_rate >= 20:
        sav_status = "Needs Attention"
        sav_badge = "🟡"
        sav_score = 75
        sav_reason = f"Savings rate is {savings_rate}%, meeting basic standards but with room to optimize."
        sav_action = "Aim to raise SIP investments by 5% annually to outpace inflation."
    else:
        sav_status = "High Risk"
        sav_badge = "🔴"
        sav_score = 45
        sav_reason = f"Savings rate of {savings_rate}% is insufficient for long-term wealth compounding."
        sav_action = "Automate savings on salary day before beginning monthly discretionary spends."

    # 3. Emergency Fund Health
    liquid_savings = profile.savings if profile else 350000.0
    monthly_expenses = cashflow["monthly_expenses"]
    target_months = profile.emergency_fund_target_months if profile else 6.0
    months_covered = round(liquid_savings / monthly_expenses, 1) if monthly_expenses > 0 else 0.0

    if months_covered >= target_months:
        ef_status = "Good"
        ef_badge = "🟢"
        ef_score = 95
        ef_reason = f"Liquid reserve covers {months_covered} months of essential expenses (Target: {target_months} months)."
        ef_action = "Hold in high-yield liquid mutual funds or auto-sweep bank deposits."
    elif months_covered >= (target_months * 0.7):
        ef_status = "Needs Attention"
        ef_badge = "🟡"
        ef_score = 72
        ef_reason = f"Reserve covers {months_covered} months of expenses. Selected target = {target_months:.0f} months (Gap: ₹{(target_months - months_covered)*monthly_expenses:,.0f})."
        ef_action = "Allocate ₹10,000/month for the next 4 months to reach full 6-month safety buffer."
    else:
        ef_status = "High Risk"
        ef_badge = "🔴"
        ef_score = 40
        ef_reason = f"Reserve only covers {months_covered} months. A medical emergency or job shock could trigger debt."
        ef_action = "Pause non-essential luxury purchases and build liquid safety net immediately."

    # 4. Debt Burden (DTI)
    total_emi = cashflow["monthly_emi"]
    dti = round((total_emi / income * 100.0), 1) if income > 0 else 0.0
    if dti <= 20:
        debt_status = "Good"
        debt_badge = "🟢"
        debt_score = 90
        debt_reason = f"Debt-to-Income (DTI) is {dti}%, comfortably within the safe limit (< 30%)."
        debt_action = "Continue regular EMI payments without taking on unsecured personal loans."
    elif dti <= 35:
        debt_status = "Needs Attention"
        debt_badge = "🟡"
        debt_score = 68
        debt_reason = f"DTI is {dti}%, consuming over a third of monthly earnings."
        debt_action = "Consider prepaying loan principal using bonus income to reduce tenure."
    else:
        debt_status = "High Risk"
        debt_badge = "🔴"
        debt_score = 35
        debt_reason = f"DTI of {dti}% poses severe debt distress risk if income is interrupted."
        debt_action = "Prioritize snowball or avalanche debt payoff to clear high-rate obligations."

    # 5. Portfolio Diversification
    asset_alloc = portfolio["asset_allocation"]
    max_alloc_pct = max([a["percentage"] for a in asset_alloc]) if asset_alloc else 60.0
    max_alloc_name = next((a["asset_class"] for a in asset_alloc if a["percentage"] == max_alloc_pct), "Equity")
    
    if max_alloc_pct <= 65:
        port_status = "Good"
        port_badge = "🟢"
        port_score = 88
        port_reason = f"Balanced multi-asset allocation. Highest asset class is {max_alloc_name} at {max_alloc_pct}%."
        port_action = "Rebalance annually to lock in profits from outperforming classes."
    elif max_alloc_pct <= 80:
        port_status = "Needs Attention"
        port_badge = "🟡"
        port_score = 70
        port_reason = f"Concentration warning: {max_alloc_name} accounts for {max_alloc_pct}% of total holdings."
        port_action = "Direct new monthly SIPs into Debt/Gold to bring equity under 70%."
    else:
        port_status = "High Risk"
        port_badge = "🔴"
        port_score = 45
        port_reason = f"Extreme portfolio concentration: {max_alloc_name} is {max_alloc_pct}%, exposing you to high volatility."
        port_action = "Diversify across uncorrelated asset classes to protect capital."

    # 6. Goal Progress
    if goals:
        progresses = [(g.current_amount / g.target_amount) for g in goals if g.target_amount > 0]
        avg_progress = (sum(progresses) / len(progresses) * 100.0) if progresses else 0.0
    else:
        avg_progress = 30.0

    if avg_progress >= 40:
        goal_status = "Good"
        goal_badge = "🟢"
        goal_score = 85
        goal_reason = f"Goals are progressing well with an average achievement of {avg_progress:.1f}%."
        goal_action = "Review milestone timelines yearly to adjust for inflation or early completion."
    elif avg_progress >= 20:
        goal_status = "Needs Attention"
        goal_badge = "🟡"
        goal_score = 70
        goal_reason = f"Average goal progress is {avg_progress:.1f}%. High-priority goals need higher SIP allocation."
        goal_action = "Step up monthly contributions by 10% on your next salary increment."
    else:
        goal_status = "High Risk"
        goal_badge = "🔴"
        goal_score = 45
        goal_reason = f"Goal progress stands at {avg_progress:.1f}%, lagging targeted milestone curves."
        goal_action = "Extend target completion horizon or reduce target budget scope."

    # Total Score computation
    overall_score = round(
        (cf_score * 0.20) +
        (sav_score * 0.20) +
        (ef_score * 0.20) +
        (debt_score * 0.15) +
        (port_score * 0.15) +
        (goal_score * 0.10)
    )

    if overall_score >= 80:
        overall_rating = "Excellent"
        overall_summary = "Your financial foundation is robust with strong savings, healthy surplus, and disciplined debt servicing."
    elif overall_score >= 65:
        overall_rating = "Moderate / Stable"
        overall_summary = "Your finances are stable, but topping up emergency reserves and rebalancing will boost resilience."
    else:
        overall_rating = "At Risk"
        overall_summary = "Financial buffers are stretched. Focus on reducing debt and securing liquid emergency reserves."

    indicators = [
        {
            "name": "Cash Flow Health",
            "value": f"₹{surplus:,.0f}/mo surplus",
            "score": cf_score,
            "status": cf_status,
            "badge": cf_badge,
            "reason": cf_reason,
            "possible_action": cf_action
        },
        {
            "name": "Savings Rate",
            "value": f"{savings_rate}%",
            "score": sav_score,
            "status": sav_status,
            "badge": sav_badge,
            "reason": sav_reason,
            "possible_action": sav_action
        },
        {
            "name": "Emergency Fund",
            "value": f"{months_covered} months",
            "score": ef_score,
            "status": ef_status,
            "badge": ef_badge,
            "reason": ef_reason,
            "possible_action": ef_action
        },
        {
            "name": "Debt-to-Income",
            "value": f"{dti}% DTI",
            "score": debt_score,
            "status": debt_status,
            "badge": debt_badge,
            "reason": debt_reason,
            "possible_action": debt_action
        },
        {
            "name": "Portfolio Diversification",
            "value": f"{max_alloc_pct}% top asset",
            "score": port_score,
            "status": port_status,
            "badge": port_badge,
            "reason": port_reason,
            "possible_action": port_action
        },
        {
            "name": "Goal Milestones",
            "value": f"{avg_progress:.1f}% progress",
            "score": goal_score,
            "status": goal_status,
            "badge": goal_badge,
            "reason": goal_reason,
            "possible_action": goal_action
        }
    ]

    return {
        "overall_score": overall_score,
        "overall_rating": overall_rating,
        "overall_summary": overall_summary,
        "indicators": indicators
    }
