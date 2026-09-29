import json
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, AIConversation
from backend.app.schemas.schemas import AIChatRequest, AIChatResponse
from backend.app.ai.orchestrator import process_ai_query
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/ai-cfo", tags=["AI CFO Layer"])

@router.post("/chat", response_model=AIChatResponse)
def chat_with_cfo(req: AIChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    # Save user message
    user_msg = AIConversation(
        user_id=user.id,
        role="user",
        message=req.message
    )
    db.add(user_msg)
    db.commit()

    # Process through AI CFO orchestration engine
    response = process_ai_query(user.id, req.message, db)
    return response

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    convs = db.query(AIConversation).filter(AIConversation.user_id == user.id).order_by(AIConversation.timestamp.asc()).all()
    result = []
    for c in convs:
        result.append({
            "id": c.id,
            "role": c.role,
            "message": c.message,
            "insight": c.insight,
            "why": c.why,
            "data_used": json.loads(c.data_used_json) if c.data_used_json else None,
            "assumptions": json.loads(c.assumptions_json) if c.assumptions_json else None,
            "possible_actions": json.loads(c.possible_actions_json) if c.possible_actions_json else None,
            "timestamp": c.timestamp.isoformat() if c.timestamp else None
        })
    return result

@router.delete("/history")
def clear_chat_history(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if user:
        db.query(AIConversation).filter(AIConversation.user_id == user.id).delete()
        db.commit()
    return {"status": "success", "message": "Conversation history cleared"}
