from sqlalchemy import Column, String, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True)
    title = Column(String(255), nullable=False)
    amount = Column(Numeric(10,2), nullable=False)
    type = Column(String(20), nullable=False)
    category = Column(String(50), nullable=False)
    date = Column(DateTime, nullable=False)
    