from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/demo", tags=["Demo Management"])

@router.post("/reset")
def reset_demo(db: Session = Depends(get_db)):
    user = seed_demo_data(db)
    return {
        "status": "success",
        "message": "Demo data has been reset to baseline financial profile.",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/load")
def load_demo(db: Session = Depends(get_db)):
    user = seed_demo_data(db)
    return {
        "status": "success",
        "message": "Demo profile loaded successfully.",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }
