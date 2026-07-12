from fastapi import APIRouter, Depends

from backend.api.dependencies import get_loan_service

from backend.schemas import LoanResponse

from backend.services.loan_service import LoanService


router = APIRouter(
    prefix="/loans",
    tags=["Loans"],
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
    "/{loan_id}",
    response_model=LoanResponse,
)
def get_loan(
    loan_id: int,
    service: LoanService = Depends(get_loan_service),
) -> LoanResponse:
    return service.get_loan(loan_id)


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