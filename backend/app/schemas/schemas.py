from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = "demo123"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Profile Schemas
class FinancialProfileBase(BaseModel):
    age: int
    employment: str
    monthly_income: float
    dependents: int
    savings: float
    monthly_expenses: float
    monthly_investments: float
    total_investments: float
    total_loans: float
    emergency_fund_target_months: float = 6.0
    risk_preference: str = "Moderate"
    consent_given: bool = True

class FinancialProfileResponse(FinancialProfileBase):
    id: int
    user_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    date: str
    description: str
    category: str
    type: str
    amount: float
    account: Optional[str] = "HDFC Salary Account"

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    amount: Optional[float] = None
    account: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Investment Schemas
class InvestmentBase(BaseModel):
    name: str
    asset_class: str
    sector: str
    invested_amount: float
    current_value: float
    returns_percentage: float = 0.0
    monthly_sip: float = 0.0

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentResponse(InvestmentBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Loan Schemas
class LoanBase(BaseModel):
    name: str
    principal: float
    outstanding_balance: float
    interest_rate: float
    emi: float
    remaining_tenure_months: int
    total_interest: float = 0.0

class LoanCreate(LoanBase):
    pass

class LoanResponse(LoanBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LoanSimulateRequest(BaseModel):
    loan_id: Optional[int] = None
    principal: Optional[float] = None
    interest_rate: Optional[float] = None
    emi: Optional[float] = None
    tenure_months: Optional[int] = None

# Goal Schemas
class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: str
    target_years: float = 5.0
    monthly_contribution: float = 0.0
    return_assumption: float = 11.0
    category: str = "Milestone"
    priority: str = "High"

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[str] = None
    target_years: Optional[float] = None
    monthly_contribution: Optional[float] = None
    return_assumption: Optional[float] = None
    category: Optional[str] = None
    priority: Optional[str] = None

class GoalResponse(GoalBase):
    id: int
    user_id: int
    progress_pct: Optional[float] = 0.0
    projected_corpus: Optional[float] = 0.0
    goal_gap: Optional[float] = 0.0
    required_monthly_contribution: Optional[float] = 0.0
    on_track: Optional[bool] = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    severity: str
    category: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Simulator Schemas
class SimulationRequest(BaseModel):
    income_change_pct: float = 0.0
    expense_change_pct: float = 0.0
    additional_sip: float = 0.0
    purchase_price: float = 0.0
    down_payment: float = 0.0
    loan_tenure_years: float = 5.0
    interest_rate: float = 9.5
    job_loss_months: int = 0
    scenario_preset: Optional[str] = None

class SimulationResult(BaseModel):
    baseline: Dict[str, Any]
    scenario: Dict[str, Any]
    impact: Dict[str, Any]
    recommendation: str
    projection_data: List[Dict[str, Any]]

# AI CFO Schemas
class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class AIChatResponse(BaseModel):
    user_query: Optional[str] = None
    message: str
    insight: str
    why: str
    data_used: Dict[str, Any]
    financial_analysis: Optional[Dict[str, Any]] = None
    what_if_options: Optional[List[Dict[str, Any]]] = None
    goal_impact_badge: Optional[str] = None
    goal_impact_text: Optional[str] = None
    assumptions: List[str]
    possible_actions: List[Dict[str, Any]]
    suggested_followups: List[str]
    intent_detected: str
