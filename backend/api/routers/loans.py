from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, status

from backend.api.dependencies import get_loan_service
from backend.auth.dependencies import require_role
from backend.background_tasks.audit import log_audit_event
from backend.schemas import (
    LoanCreate,
    LoanResponse,
)
from backend.services.loan_service import LoanService
from database.models.enums import UserRole
from database.models.loan import Loan
from database.models.user import User

router = APIRouter(
    prefix="/loans",
    tags=["Loans"],
    dependencies=[Depends(require_role(UserRole.LIBRARIAN))],
)


@router.get(
    "/",
    response_model=list[LoanResponse],
)
def get_loans(
    service: LoanService = Depends(get_loan_service),
) -> list[LoanResponse]:
    return service.get_all_loans()


@router.get(
    "/active",
    response_model=list[LoanResponse],
)
def get_active_loans(
    service: LoanService = Depends(get_loan_service),
) -> list[LoanResponse]:
    return service.get_active_loans()


@router.get(
    "/member/{member_id}",
    response_model=list[LoanResponse],
)
def get_member_loans(
    member_id: int,
    service: LoanService = Depends(get_loan_service),
) -> list[LoanResponse]:
    return service.get_member_loans(member_id)


@router.get(
    "/book/{book_id}",
    response_model=list[LoanResponse],
)
def get_book_loans(
    book_id: int,
    service: LoanService = Depends(get_loan_service),
) -> list[LoanResponse]:
    return service.get_book_loans(book_id)


@router.get(
    "/{loan_id}",
    response_model=LoanResponse,
)
def get_loan(
    loan_id: int,
    service: LoanService = Depends(get_loan_service),
) -> LoanResponse:
    return service.get_loan(loan_id)


@router.post(
    "/borrow",
    response_model=LoanResponse,
    status_code=status.HTTP_201_CREATED,
)
def borrow_book(
    loan: LoanCreate,
    background_tasks: BackgroundTasks,
    service: LoanService = Depends(get_loan_service),
    current_user: User = Depends(require_role(UserRole.LIBRARIAN)),
) -> LoanResponse:

    new_loan = Loan(
        member_id=loan.member_id,
        book_id=loan.book_id,
        due_date=loan.due_date,
        borrow_date=datetime.now(),
    )

    result = service.borrow_book(new_loan)
    background_tasks.add_task(log_audit_event, "borrow_book", "Loan", result.id, current_user.username)
    return result


@router.post(
    "/return/{loan_id}",
    response_model=LoanResponse,
)
def return_book(
    loan_id: int,
    background_tasks: BackgroundTasks,
    service: LoanService = Depends(get_loan_service),
    current_user: User = Depends(require_role(UserRole.LIBRARIAN)),
) -> LoanResponse:

    result = service.return_book(loan_id)
    background_tasks.add_task(log_audit_event, "return_book", "Loan", result.id, current_user.username)
    return result


@router.delete(
    "/{loan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_loan(
    loan_id: int,
    service: LoanService = Depends(get_loan_service),
) -> None:

    service.soft_delete_loan(loan_id)
