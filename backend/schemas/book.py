from pydantic import BaseModel, ConfigDict

from database.models.enums import BookStatus


class BookCreate(BaseModel):
    title: str
    author: str
    total_copies: int
    available_copies: int
    status: BookStatus = BookStatus.AVAILABLE


class BookUpdate(BaseModel):
    title: str | None = None
    author: str | None = None
    total_copies: int | None = None
    available_copies: int | None = None
    status: BookStatus | None = None


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    total_copies: int
    available_copies: int
    status: BookStatus

    model_config = ConfigDict(
        from_attributes=True,
    )