from fastapi import FastAPI, HTTPException, Depends
import uuid
from sqlalchemy.orm import Session
from database import get_db
import models 
from schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to my Expense Tracker API"}

@app.get("/expenses", response_model=list[ExpenseResponse])
def get_expense(db: Session = Depends(get_db)):
    return db.query(models.Expense).all()

@app.post("/expenses", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = models.Expense(
        id=uuid.uuid4(),
        **expense.model_dump()
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id
    ).first()

    if not db_expense:
        raise HTTPException(
            status_code=404, 
            detail="Expense not found"
        ) 
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@app.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: uuid.UUID, updated_expense: ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id
    ).first()
        
    if not db_expense:
        raise HTTPException(
            status_code=404, 
            detail="Expense not found"
            ) 
    
    # update with the new expense
    update_data = updated_expense.model_dump(exclude_unset=True)
    for k,v in update_data.items():
        setattr(db_expense, k, v)

    db.commit()
    db.refresh(db_expense)

    return db_expense




