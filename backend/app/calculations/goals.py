import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.models import Goal

def calculate_future_value(principal: float, monthly_sip: float, annual_return: float, years: float) -> float:
    r = (annual_return / 100.0) / 12.0
    n = int(years * 12)
    if n <= 0:
        return principal
    if r == 0:
        return principal + (monthly_sip * n)
    
    # FV of current lumpsum = P * (1 + r)^n
    fv_lump = principal * math.pow(1 + r, n)
    # FV of SIP = SIP * [((1 + r)^n - 1) / r] * (1 + r)
    fv_sip = monthly_sip * ((math.pow(1 + r, n) - 1) / r) * (1 + r)
    return fv_lump + fv_sip

def calculate_required_sip(target: float, current: float, annual_return: float, years: float) -> float:
    r = (annual_return / 100.0) / 12.0
    n = int(years * 12)
    if n <= 0:
        return max(0.0, target - current)
    if r == 0:
        return max(0.0, (target - current) / n)

    fv_lump = current * math.pow(1 + r, n)
    remaining_needed = target - fv_lump
    if remaining_needed <= 0:
        return 0.0

    # Required SIP = Remaining / [(((1+r)^n - 1) / r) * (1+r)]
    factor = ((math.pow(1 + r, n) - 1) / r) * (1 + r)
    return round(remaining_needed / factor, 2)

def evaluate_goal(goal: Goal) -> Dict[str, Any]:
    progress_pct = round((goal.current_amount / goal.target_amount * 100.0), 1) if goal.target_amount > 0 else 0.0
    projected = calculate_future_value(goal.current_amount, goal.monthly_contribution, goal.return_assumption, goal.target_years)
    gap = max(0.0, goal.target_amount - projected)
    required_sip = calculate_required_sip(goal.target_amount, goal.current_amount, goal.return_assumption, goal.target_years)
    on_track = projected >= (goal.target_amount * 0.95)

    return {
        "id": goal.id,
        "name": goal.name,
        "category": goal.category,
        "priority": goal.priority,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "target_date": goal.target_date,
        "target_years": goal.target_years,
        "monthly_contribution": goal.monthly_contribution,
        "return_assumption": goal.return_assumption,
        "progress_pct": min(100.0, progress_pct),
        "projected_corpus": round(projected, 2),
        "goal_gap": round(gap, 2),
        "required_monthly_contribution": round(required_sip, 2),
        "on_track": on_track,
        "shortfall_or_surplus": round(projected - goal.target_amount, 2)
    }

def get_all_goals_summary(user_id: int, db: Session):
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    evaluated = [evaluate_goal(g) for g in goals]
    
    total_target = sum(g["target_amount"] for g in evaluated)
    total_current = sum(g["current_amount"] for g in evaluated)
    total_projected = sum(g["projected_corpus"] for g in evaluated)
    total_monthly_allocated = sum(g["monthly_contribution"] for g in evaluated)
    total_monthly_required = sum(g["required_monthly_contribution"] for g in evaluated)
    overall_progress = round((total_current / total_target * 100.0), 1) if total_target > 0 else 0.0

    return {
        "goals": evaluated,
        "total_target": round(total_target, 2),
        "total_current": round(total_current, 2),
        "total_projected": round(total_projected, 2),
        "total_monthly_allocated": round(total_monthly_allocated, 2),
        "total_monthly_required": round(total_monthly_required, 2),
        "overall_progress": overall_progress,
        "on_track_count": sum(1 for g in evaluated if g["on_track"]),
        "total_goals_count": len(evaluated)
    }
