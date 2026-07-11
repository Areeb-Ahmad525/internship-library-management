from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base

if TYPE_CHECKING:
    from database.models.loan import Loan


class Member(Base):
    __tablename__ = "members"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key = True,
        autoincrement = True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable = False,
        index = True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable = False,
        unique = True,
        index = True,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable = False,
        default = False,
    )

    loans: Mapped[list["Loan"]] = relationship(
        back_populates = "member",
    )