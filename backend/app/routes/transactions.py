from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Transaction
from backend.app.schemas.schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from backend.app.services.seed_service import seed_demo_data

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    category: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    query = db.query(Transaction).filter(Transaction.user_id == user.id)

    if category and category != "All":
        query = query.filter(Transaction.category == category)
    if type and type != "All":
        query = query.filter(Transaction.type == type)
    if search:
        query = query.filter(
            (Transaction.description.ilike(f"%{search}%")) |
            (Transaction.account.ilike(f"%{search}%"))
        )
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    return query.order_by(Transaction.date.desc(), Transaction.id.desc()).all()

@router.post("", response_model=TransactionResponse)
def create_transaction(txn: TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    if not user:
        user = seed_demo_data(db)

    new_txn = Transaction(
        user_id=user.id,
        date=txn.date,
        description=txn.description,
        category=txn.category,
        type=txn.type,
        amount=txn.amount,
        account=txn.account or "HDFC Salary Account"
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return new_txn

@router.put("/{txn_id}", response_model=TransactionResponse)
def update_transaction(txn_id: int, txn: TransactionUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    db_txn = db.query(Transaction).filter(Transaction.id == txn_id, Transaction.user_id == user.id).first()
    if not db_txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for k, v in txn.model_dump(exclude_unset=True).items():
        if v is not None:
            setattr(db_txn, k, v)

    db.commit()
    db.refresh(db_txn)
    return db_txn

@router.delete("/{txn_id}")
def delete_transaction(txn_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
    db_txn = db.query(Transaction).filter(Transaction.id == txn_id, Transaction.user_id == user.id).first()
    if not db_txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(db_txn)
    db.commit()
    return {"status": "success", "message": "Transaction deleted successfully"}
