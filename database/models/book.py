from sqlalchemy import Boolean, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base
from database.models.enums import BookStatus

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from database.models.loan import Loan

class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key = True,
        autoincrement = True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable = False,
        index = True
    )

    author: Mapped[str] = mapped_column(
        String(255),
        nullable = False,
        index = True,
    )

    total_copies: Mapped[int] = mapped_column(
        Integer,
        nullable = False,
    )

    available_copies: Mapped[int] = mapped_column(
        Integer,
        nullable = False,
    )

    status: Mapped[BookStatus] = mapped_column(
        Enum(BookStatus, name = "book_status"),
        nullable = False,
        default = BookStatus.AVAILABLE,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable = False,
        default = False,
    )

    loans: Mapped[list["Loan"]] = relationship(
        back_populates = "book",
    )
    