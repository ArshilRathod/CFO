from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Goal
from backend.app.schemas.schemas import GoalCreate, GoalUpdate, GoalResponse
from backend.app.calculations.goals import get_all_goals_summary, evaluate_goal
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("")
def get_goals(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    return get_all_goals_summary(user.id, db)

@router.post("", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    new_goal = Goal(
        user_id=user.id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        target_years=goal.target_years,
        monthly_contribution=goal.monthly_contribution,
        return_assumption=goal.return_assumption,
        category=goal.category,
        priority=goal.priority
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return evaluate_goal(new_goal)

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, goal_data: GoalUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user.id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    for k, v in goal_data.model_dump(exclude_unset=True).items():
        if v is not None:
            setattr(db_goal, k, v)

    db.commit()
    db.refresh(db_goal)
    return evaluate_goal(db_goal)

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user.id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(db_goal)
    db.commit()
    return {"status": "success", "message": "Goal deleted"}
