from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False, default="demo123")
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="user", cascade="all, delete-orphan")
    loans = relationship("Loan", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    scenarios = relationship("Scenario", back_populates="user", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    age = Column(Integer, default=25)
    employment = Column(String(100), default="Salaried Professional")
    monthly_income = Column(Float, default=120000.0)
    dependents = Column(Integer, default=0)
    savings = Column(Float, default=350000.0) # Liquid savings / Emergency pool
    monthly_expenses = Column(Float, default=58000.0)
    monthly_investments = Column(Float, default=25000.0)
    total_investments = Column(Float, default=1420000.0)
    total_loans = Column(Float, default=380000.0)
    emergency_fund_target_months = Column(Float, default=6.0)
    risk_preference = Column(String(50), default="Moderate") # Conservative, Moderate, Aggressive
    consent_given = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(String(50), nullable=False) # YYYY-MM-DD
    description = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Salary, Housing, Food, Transport, Shopping, Utilities, Entertainment, SIP, EMI, Other
    type = Column(String(50), nullable=False) # Income, Expense, Investment, Loan payment
    amount = Column(Float, nullable=False)
    account = Column(String(100), default="HDFC Salary Account")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")

class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    asset_class = Column(String(50), nullable=False) # Equity, Debt, Gold, Cash
    sector = Column(String(100), default="Mutual Fund") # Technology, Financials, Government, Liquid, etc.
    invested_amount = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    returns_percentage = Column(Float, default=0.0)
    monthly_sip = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="investments")

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    principal = Column(Float, nullable=False)
    outstanding_balance = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False) # e.g. 9.5%
    emi = Column(Float, nullable=False)
    remaining_tenure_months = Column(Integer, nullable=False)
    total_interest = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="loans")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(String(50), nullable=False) # e.g. "2031-12-31"
    target_years = Column(Float, default=5.0)
    monthly_contribution = Column(Float, default=0.0)
    return_assumption = Column(Float, default=11.0) # annual return expected in %
    category = Column(String(50), default="Milestone") # Emergency fund, House, Car, Education, Retirement
    priority = Column(String(50), default="High")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="goals")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="warning") # info, warning, danger, success
    category = Column(String(50), default="spending") # spending, emergency_fund, debt, goal, portfolio, cashflow
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    income_change_pct = Column(Float, default=0.0)
    expense_change_pct = Column(Float, default=0.0)
    additional_sip = Column(Float, default=0.0)
    purchase_price = Column(Float, default=0.0)
    down_payment = Column(Float, default=0.0)
    loan_tenure_years = Column(Float, default=5.0)
    interest_rate = Column(Float, default=9.5)
    job_loss_months = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scenarios")

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False) # user, assistant
    message = Column(Text, nullable=False)
    insight = Column(Text, nullable=True)
    why = Column(Text, nullable=True)
    data_used_json = Column(Text, nullable=True)
    assumptions_json = Column(Text, nullable=True)
    possible_actions_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ai_conversations")
