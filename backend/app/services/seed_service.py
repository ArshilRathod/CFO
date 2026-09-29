from sqlalchemy.orm import Session
from backend.app.models.models import (
    User, FinancialProfile, Transaction, Investment, Loan, Goal, Alert, Scenario, AIConversation
)
from datetime import datetime, timedelta

DEMO_USER_EMAIL = "demo@aicfo.finance"

def seed_demo_data(db: Session) -> User:
    # Check if user already exists
    user = db.query(User).filter(User.email == DEMO_USER_EMAIL).first()
    if user:
        # Clear existing data for clean demo state
        db.query(Transaction).filter(Transaction.user_id == user.id).delete()
        db.query(Investment).filter(Investment.user_id == user.id).delete()
        db.query(Loan).filter(Loan.user_id == user.id).delete()
        db.query(Goal).filter(Goal.user_id == user.id).delete()
        db.query(Alert).filter(Alert.user_id == user.id).delete()
        db.query(Scenario).filter(Scenario.user_id == user.id).delete()
        db.query(AIConversation).filter(AIConversation.user_id == user.id).delete()
        if user.profile:
            db.delete(user.profile)
        db.commit()
    else:
        user = User(
            email=DEMO_USER_EMAIL,
            full_name="Aarav Sharma (Demo Account)",
            password_hash="demo123",
            is_demo=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 1. Financial Profile
    profile = FinancialProfile(
        user_id=user.id,
        age=25,
        employment="Senior Software Engineer",
        monthly_income=120000.0,
        dependents=0,
        savings=350000.0, # Emergency / Liquid pool (5.4 months)
        monthly_expenses=58000.0,
        monthly_investments=25000.0,
        total_investments=1420000.0,
        total_loans=380000.0,
        emergency_fund_target_months=6.0,
        risk_preference="Moderate",
        consent_given=True
    )
    db.add(profile)

    # 2. Holdings (Investments - Total ₹14,20,000)
    investments_data = [
        Investment(
            user_id=user.id,
            name="UTI Nifty 50 Index Fund",
            asset_class="Equity",
            sector="Large Cap Index",
            invested_amount=450000.0,
            current_value=535000.0,
            returns_percentage=18.9,
            monthly_sip=10000.0
        ),
        Investment(
            user_id=user.id,
            name="Parag Parikh Flexi Cap Fund",
            asset_class="Equity",
            sector="Diversified Equity",
            invested_amount=300000.0,
            current_value=355000.0,
            returns_percentage=18.3,
            monthly_sip=8000.0
        ),
        Investment(
            user_id=user.id,
            name="Sovereign Gold Bonds (SGB 2028)",
            asset_class="Gold",
            sector="Commodities & Sovereign",
            invested_amount=180000.0,
            current_value=225000.0,
            returns_percentage=25.0,
            monthly_sip=2000.0
        ),
        Investment(
            user_id=user.id,
            name="Bharat Bond ETF (Target Maturity)",
            asset_class="Debt",
            sector="Government / AAA Corporate",
            invested_amount=190000.0,
            current_value=205000.0,
            returns_percentage=7.9,
            monthly_sip=3000.0
        ),
        Investment(
            user_id=user.id,
            name="HDFC High Yield Liquid Fund / FD",
            asset_class="Cash",
            sector="Liquid Money Market",
            invested_amount=95000.0,
            current_value=100000.0,
            returns_percentage=5.3,
            monthly_sip=2000.0
        ),
    ]
    for inv in investments_data:
        db.add(inv)

    # 3. Loans (Total ₹3,80,000)
    loan = Loan(
        user_id=user.id,
        name="Axis Bank Pre-Approved Auto Loan",
        principal=500000.0,
        outstanding_balance=380000.0,
        interest_rate=9.5,
        emi=12000.0,
        remaining_tenure_months=36,
        total_interest=58000.0
    )
    db.add(loan)

    # 4. Goals
    goals_data = [
        Goal(
            user_id=user.id,
            name="Emergency Fund",
            target_amount=350000.0,
            current_amount=350000.0,
            target_date="2026-06-30",
            target_years=0.5,
            monthly_contribution=5000.0,
            return_assumption=6.5,
            category="Emergency fund",
            priority="High"
        ),
        Goal(
            user_id=user.id,
            name="Car Purchase / Upgrade",
            target_amount=1500000.0,
            current_amount=250000.0,
            target_date="2029-03-31",
            target_years=3.0,
            monthly_contribution=10000.0,
            return_assumption=10.0,
            category="Car",
            priority="Medium"
        ),
        Goal(
            user_id=user.id,
            name="House Down Payment",
            target_amount=4000000.0,
            current_amount=600000.0,
            target_date="2033-03-31",
            target_years=7.0,
            monthly_contribution=15000.0,
            return_assumption=11.5,
            category="House",
            priority="High"
        ),
        Goal(
            user_id=user.id,
            name="Early Financial Independence / Retirement",
            target_amount=30000000.0, # ₹3 Crore
            current_amount=570000.0,
            target_date="2056-03-31",
            target_years=30.0,
            monthly_contribution=10000.0,
            return_assumption=12.0,
            category="Retirement",
            priority="High"
        )
    ]
    for g in goals_data:
        db.add(g)

    # 5. 6 Months Historical Transactions
    # Reconstruct monthly patterns: Salary, Rent, Food, Transport, Shopping, Utilities, Entertainment, SIP, EMI
    months = [
        ("2025-10", 120000, 18000, 7500, 4800, 6800, 3900, 3100, 25000, 12000),
        ("2025-11", 120000, 18000, 8100, 5200, 7200, 4200, 3200, 25000, 12000),
        ("2025-12", 135000, 18000, 9200, 5000, 11000, 4500, 5500, 30000, 12000), # bonus & holiday
        ("2026-01", 120000, 18000, 8000, 4900, 6500, 4000, 3000, 25000, 12000),
        ("2026-02", 120000, 18000, 7900, 5100, 7000, 4100, 3200, 25000, 12000),
        ("2026-03", 120000, 18000, 8000, 5000, 12000, 4000, 3000, 25000, 12000), # current month with shopping spike
    ]

    for ym, sal, rent, food, trans, shop, util, ent, sip, emi in months:
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-01",
            description="Monthly Corporate Salary Credit",
            category="Salary",
            type="Income",
            amount=sal,
            account="HDFC Salary Account"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-03",
            description="Apartment Rent Payment",
            category="Housing",
            type="Expense",
            amount=rent,
            account="HDFC Salary Account"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-05",
            description="Axis Bank Auto Loan EMI",
            category="EMI",
            type="Loan payment",
            amount=emi,
            account="HDFC Salary Account"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-07",
            description="Monthly Mutual Funds SIP Basket",
            category="SIP",
            type="Investment",
            amount=sip,
            account="Zerodha Broking"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-10",
            description="Supermarket & Daily Groceries",
            category="Food",
            type="Expense",
            amount=food,
            account="ICICI Credit Card"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-14",
            description="Metro, Uber & Fuel Refill",
            category="Transport",
            type="Expense",
            amount=trans,
            account="HDFC UPI"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-18",
            description="Electricity, WiFi & Mobile Postpaid",
            category="Utilities",
            type="Expense",
            amount=util,
            account="HDFC UPI"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-22",
            description="Weekend Movies & Dining Out",
            category="Entertainment",
            type="Expense",
            amount=ent,
            account="ICICI Credit Card"
        ))
        db.add(Transaction(
            user_id=user.id,
            date=f"{ym}-26",
            description="Amazon / Flipkart Online Shopping",
            category="Shopping",
            type="Expense",
            amount=shop,
            account="ICICI Credit Card"
        ))

    # 6. Initial Alerts
    alerts = [
        Alert(
            user_id=user.id,
            title="Spending Anomaly Detected",
            message="Shopping spending is 32% above your 6-month average (₹12,000 vs historical ₹7,000).",
            severity="warning",
            category="spending",
            is_read=False
        ),
        Alert(
            user_id=user.id,
            title="Emergency Fund Runway: 5.4 Months",
            message="Liquid reserves of ₹3,50,000 cover 5.4 months of living expenses. Target is 6.0 months (₹35,000 gap).",
            severity="warning",
            category="emergency_fund",
            is_read=False
        ),
        Alert(
            user_id=user.id,
            title="House Goal Needs SIP Boost",
            message="House Downpayment goal (₹40L in 7 years) requires ₹28,000/mo SIP at 11.5% CAGR. Currently allocating ₹15,000/mo.",
            severity="warning",
            category="goal",
            is_read=False
        ),
        Alert(
            user_id=user.id,
            title="Positive Monthly Surplus",
            message="You maintained a strong monthly surplus of ₹25,000 after all investments and EMI deductions.",
            severity="success",
            category="cashflow",
            is_read=True
        )
    ]
    for a in alerts:
        db.add(a)

    db.commit()
    return user
