from datetime import date, timedelta

from sqlalchemy.orm import Session

from database.models.enums import LoanStatus
from database.models.loan import Loan


def create_loan(
    db: Session,
    book_id: int,
    member_id: int,
    borrow_date: date = None,
    due_date: date = None,
    status: LoanStatus = LoanStatus.BORROWED,
) -> Loan:
    if borrow_date is None:
        borrow_date = date.today()
    if due_date is None:
        due_date = borrow_date + timedelta(days=14)

    loan = Loan(
        book_id=book_id,
        member_id=member_id,
        borrow_date=borrow_date,
        due_date=due_date,
        status=status,
    )
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan
