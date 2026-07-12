from datetime import datetime

from pydantic import BaseModel, ConfigDict

from database.models.enums import LoanStatus


class LoanCreate(BaseModel):
    member_id: int
    book_id: int
    due_date: datetime


class LoanUpdate(BaseModel):
    return_date: datetime | None = None
    status: LoanStatus | None = None


class LoanResponse(BaseModel):
    id: int
    member_id: int
    book_id: int
    borrow_date: datetime
    due_date: datetime
    return_date: datetime | None
    status: LoanStatus

    model_config = ConfigDict(
        from_attributes=True,
    )