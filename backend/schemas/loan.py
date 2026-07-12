from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from database.models.enums import LoanStatus


class LoanCreate(BaseModel):
    member_id: Annotated[
        int,
        Field(gt=0),
    ]

    book_id: Annotated[
        int,
        Field(gt=0),
    ]

    due_date: datetime


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

class LoanUpdate(BaseModel):
    return_date: datetime | None = None
    status: LoanStatus | None = None
