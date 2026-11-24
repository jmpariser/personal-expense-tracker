from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid
from typing import Optional

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    type: str
    category: str
    date: datetime

class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    amount: float
    type: str
    category: str
    date: datetime

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime] = None