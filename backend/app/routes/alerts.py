from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Alert
from backend.app.schemas.schemas import AlertResponse
from backend.app.services.alerts_engine import generate_user_alerts
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    alerts = db.query(Alert).filter(Alert.user_id == user.id).order_by(Alert.is_read.asc(), Alert.created_at.desc()).all()
    if not alerts:
        alerts = generate_user_alerts(user.id, db)
    return alerts

@router.put("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_read(alert_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.user_id == user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert

@router.delete("/{alert_id}")
def dismiss_alert(alert_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.user_id == user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()
    return {"status": "success", "message": "Alert dismissed"}
