from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base
from database.models.enums import LoanStatus

if TYPE_CHECKING:
    from database.models.book import Book
    from database.models.member import Member



class Loan(Base):
    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id"),
        nullable = False,
        index = True,
    )

    member_id: Mapped[int] = mapped_column(
        ForeignKey("members.id"),
        nullable = False,
        index = True,
    )

    borrow_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable = False,
    )

    due_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable = False,
    )

    return_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    status: Mapped[LoanStatus] = mapped_column(
        Enum(LoanStatus, name="loan_status"),
        nullable=False,
        default=LoanStatus.BORROWED,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    book: Mapped["Book"] = relationship(
        back_populates="loans",
    )

    member: Mapped["Member"] = relationship(
        back_populates="loans",
    )