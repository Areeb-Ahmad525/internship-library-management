from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.models.enums import LoanStatus
from database.models.loan import Loan


class LoanRepository:

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, loan: Loan) -> Loan:
        try:
            self.db.add(loan)
            self.db.commit()
            self.db.refresh(loan)

            return loan

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_by_id(self, loan_id: int) -> Loan | None:
        statement = select(Loan).where(
            Loan.id == loan_id,
            Loan.is_deleted.is_(False),
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()

    def get_all(self) -> list[Loan]:
        statement = select(Loan).where(Loan.is_deleted.is_(False)).order_by(Loan.id)

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def get_active_loans(self) -> list[Loan]:
        statement = (
            select(Loan)
            .where(
                Loan.is_deleted.is_(False),
                Loan.status == LoanStatus.BORROWED,
            )
            .order_by(Loan.borrow_date)
        )

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def get_by_member(self, member_id: int) -> list[Loan]:
        statement = (
            select(Loan)
            .where(
                Loan.member_id == member_id,
                Loan.is_deleted.is_(False),
            )
            .order_by(Loan.borrow_date.desc())
        )

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def get_by_book(self, book_id: int) -> list[Loan]:
        statement = (
            select(Loan)
            .where(
                Loan.book_id == book_id,
                Loan.is_deleted.is_(False),
            )
            .order_by(Loan.borrow_date.desc())
        )

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def update(self, loan: Loan) -> Loan:
        try:
            self.db.commit()
            self.db.refresh(loan)

            return loan

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def soft_delete(self, loan: Loan) -> Loan:
        try:
            loan.is_deleted = True

            self.db.commit()
            self.db.refresh(loan)

            return loan

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_borrowed_by_book(self, book_id: int) -> Loan | None:
        statement = select(Loan).where(
            Loan.book_id == book_id,
            Loan.status == LoanStatus.BORROWED,
            Loan.is_deleted.is_(False),
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()
