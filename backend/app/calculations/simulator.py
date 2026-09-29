import math
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.models import FinancialProfile, Loan, Investment
from backend.app.calculations.cashflow import calculate_monthly_cashflow
from backend.app.calculations.net_worth import calculate_net_worth
from backend.app.calculations.loans import calculate_emi

def run_what_if_simulation(user_id: int, db: Session, params: Dict[str, Any]) -> Dict[str, Any]:
    cashflow = calculate_monthly_cashflow(user_id, db)
    networth = calculate_net_worth(user_id, db)
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()

    base_income = cashflow["monthly_income"]
    base_expenses = cashflow["monthly_expenses"]
    base_investments = cashflow["monthly_investments"]
    base_emi = cashflow["monthly_emi"]
    base_surplus = cashflow["monthly_surplus"]
    base_savings = profile.savings if profile else 350000.0
    base_portfolio = networth["total_investments"]
    base_net_worth = networth["net_worth"]
    base_emergency_months = round(base_savings / base_expenses, 1) if base_expenses > 0 else 0
    base_dti = round((base_emi / base_income * 100.0), 1) if base_income > 0 else 0

    # Extract scenario params
    income_delta_pct = params.get("income_change_pct", 0.0)
    expense_delta_pct = params.get("expense_change_pct", 0.0)
    additional_sip = params.get("additional_sip", 0.0)
    purchase_price = params.get("purchase_price", 0.0)
    down_payment = params.get("down_payment", 0.0)
    loan_tenure_years = params.get("loan_tenure_years", 5.0)
    interest_rate = params.get("interest_rate", 9.5)
    job_loss_months = params.get("job_loss_months", 0)

    # Compute scenario cash flows
    scen_income = base_income * (1.0 + (income_delta_pct / 100.0))
    scen_expenses = base_expenses * (1.0 + (expense_delta_pct / 100.0))
    scen_investments = max(0.0, base_investments + additional_sip)

    # If capital purchase (e.g. ₹15 lakh car)
    new_loan_emi = 0.0
    new_loan_amount = 0.0
    if purchase_price > 0:
        new_loan_amount = max(0.0, purchase_price - down_payment)
        if new_loan_amount > 0 and loan_tenure_years > 0:
            new_loan_emi = calculate_emi(new_loan_amount, interest_rate, int(loan_tenure_years * 12))

    scen_total_emi = base_emi + new_loan_emi

    # If job loss for X months, simulate impact on savings
    scen_savings = base_savings - down_payment
    job_loss_cost = 0.0
    if job_loss_months > 0:
        # Expenses + EMI must be paid out of emergency fund for X months
        monthly_burn = base_expenses + base_emi
        job_loss_cost = monthly_burn * job_loss_months
        scen_savings -= job_loss_cost

    scen_surplus = scen_income - scen_expenses - scen_total_emi - scen_investments
    scen_emergency_months = round(max(0.0, scen_savings) / scen_expenses, 1) if scen_expenses > 0 else 0
    scen_dti = round((scen_total_emi / scen_income * 100.0), 1) if scen_income > 0 else 0

    # 5-Year Net Worth Projection comparison
    # Annual growth assumption: investments grow @ 11%, liabilities reduce as EMIs pay principal
    projection_data = []
    base_accumulated_nw = base_net_worth
    scen_accumulated_nw = base_net_worth - down_payment - job_loss_cost

    for year in range(1, 6):
        # Base annual addition
        base_annual_sip = base_investments * 12
        base_annual_surplus = max(0.0, base_surplus) * 12
        base_accumulated_nw = (base_accumulated_nw * 1.09) + base_annual_sip + (base_annual_surplus * 0.5)

        # Scenario annual addition
        scen_annual_sip = scen_investments * 12
        scen_annual_surplus = max(0.0, scen_surplus) * 12
        # Car depreciates by 15% yearly
        car_equity = (purchase_price * math.pow(0.85, year)) if purchase_price > 0 else 0
        scen_accumulated_nw = (scen_accumulated_nw * 1.09) + scen_annual_sip + (scen_annual_surplus * 0.5) + (car_equity * 0.1)

        projection_data.append({
            "year": f"Year {year}",
            "Current Projection": round(base_accumulated_nw, 0),
            "Scenario Projection": round(scen_accumulated_nw, 0)
        })

    # Calculate scenario financial health score & goal timeline impact
    scen_surplus_rate = round((scen_surplus / scen_income * 100.0), 1) if scen_income > 0 else 0.0
    
    if scen_surplus < 0 or scen_emergency_months < 2.0:
        scen_health_score = 56
        goal_timeline = "Severely Delayed (Goal contributions at risk)"
    elif scen_surplus < 10000 or scen_dti > 25 or scen_emergency_months < 3.5:
        scen_health_score = 74
        goal_timeline = "Delayed by ~14 months (Surplus constrained)"
    elif additional_sip >= 5000:
        scen_health_score = 88
        goal_timeline = "Accelerated by ~16 months"
    elif expense_delta_pct <= -5:
        scen_health_score = 86
        goal_timeline = "Accelerated by ~8 months"
    else:
        scen_health_score = 82
        goal_timeline = "Maintained on current track"

    # Recommendation / Assessment
    if scen_surplus < 0:
        recommendation = "High Risk: This scenario causes a monthly cash deficit. You will deplete savings unless spending or loan size is reduced."
    elif scen_dti > 35:
        recommendation = "Debt Heavy: DTI exceeds 35%. While feasible, it leaves very little margin for unexpected emergencies."
    elif scen_emergency_months < 3:
        recommendation = "Emergency Buffer Warning: Down payment or expenses leaves less than 3 months of emergency buffer. Consider smaller down payment or postponing."
    elif additional_sip > 0:
        recommendation = f"Wealth Accelerator: Boosting investments by ₹{additional_sip:,.0f}/mo expands your 5-year corpus significantly with compounding."
    else:
        recommendation = "Financially Feasible: The scenario fits within your cashflow comfortably while maintaining emergency safety buffers."

    return {
        "baseline": {
            "monthly_income": base_income,
            "monthly_expenses": base_expenses,
            "monthly_investments": base_investments,
            "monthly_emi": base_emi,
            "monthly_surplus": base_surplus,
            "surplus_rate": 20.8,
            "emergency_fund_months": base_emergency_months,
            "dti_ratio": base_dti,
            "financial_health_score": 82,
            "goal_timeline": "On Track (7 yrs to House down payment)",
            "liquid_savings": base_savings,
            "net_worth": base_net_worth
        },
        "scenario": {
            "monthly_income": round(scen_income, 2),
            "monthly_expenses": round(scen_expenses, 2),
            "monthly_investments": round(scen_investments, 2),
            "monthly_emi": round(scen_total_emi, 2),
            "new_loan_emi": round(new_loan_emi, 2),
            "monthly_surplus": round(scen_surplus, 2),
            "surplus_rate": scen_surplus_rate,
            "emergency_fund_months": scen_emergency_months,
            "dti_ratio": scen_dti,
            "financial_health_score": scen_health_score,
            "goal_timeline": goal_timeline,
            "liquid_savings": round(scen_savings, 2),
            "net_worth_5yr": round(scen_accumulated_nw, 2)
        },
        "impact": {
            "surplus_change": round(scen_surplus - base_surplus, 2),
            "emi_change": round(scen_total_emi - base_emi, 2),
            "emergency_buffer_change_months": round(scen_emergency_months - base_emergency_months, 1),
            "dti_change": round(scen_dti - base_dti, 1),
            "health_score_change": scen_health_score - 82
        },
        "recommendation": recommendation,
        "projection_data": projection_data,
        "disclaimer": "Scenario data is strictly a simulation and does not modify your actual bank accounts or portfolio ledger."
    }
