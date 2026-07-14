from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from backend.exceptions.book_exceptions import (
    ActiveLoanExistsError,
    BookNotAvailableError,
    BookNotFoundError,
    DuplicateBookError,
    InvalidBookCopiesError,
)
from backend.exceptions.loan_exceptions import (
    LoanAlreadyBorrowedError,
    LoanAlreadyReturnedError,
    LoanBookAlreadyBorrowedError,
    LoanNotFoundError,
    NoAvailableCopiesError,
)
from backend.exceptions.member_exceptions import (
    DuplicateMemberError,
    MemberHasActiveLoansError,
    MemberNotFoundError,
)
from backend.exceptions.user_exceptions import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UserNotFoundError,
)


def _create_json_response(status_code: int, detail: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"detail": detail},
    )


def not_found_handler(request: Request, exc: Exception) -> JSONResponse:
    return _create_json_response(status.HTTP_404_NOT_FOUND, str(exc))


def conflict_handler(request: Request, exc: Exception) -> JSONResponse:
    return _create_json_response(status.HTTP_409_CONFLICT, str(exc))


def bad_request_handler(request: Request, exc: Exception) -> JSONResponse:
    return _create_json_response(status.HTTP_400_BAD_REQUEST, str(exc))


def unauthorized_handler(request: Request, exc: Exception) -> JSONResponse:
    return _create_json_response(status.HTTP_401_UNAUTHORIZED, str(exc))


def register_exception_handlers(app: FastAPI) -> None:
    # 401 Unauthorized
    app.add_exception_handler(InvalidCredentialsError, unauthorized_handler)

    # 404 Not Found
    app.add_exception_handler(BookNotFoundError, not_found_handler)
    app.add_exception_handler(MemberNotFoundError, not_found_handler)
    app.add_exception_handler(LoanNotFoundError, not_found_handler)
    app.add_exception_handler(UserNotFoundError, not_found_handler)

    # 409 Conflict
    app.add_exception_handler(UserAlreadyExistsError, conflict_handler)
    app.add_exception_handler(DuplicateBookError, conflict_handler)
    app.add_exception_handler(DuplicateMemberError, conflict_handler)

    # 400 Bad Request
    app.add_exception_handler(InvalidBookCopiesError, bad_request_handler)
    app.add_exception_handler(BookNotAvailableError, bad_request_handler)
    app.add_exception_handler(ActiveLoanExistsError, bad_request_handler)
    app.add_exception_handler(LoanBookAlreadyBorrowedError, bad_request_handler)
    app.add_exception_handler(NoAvailableCopiesError, bad_request_handler)
    app.add_exception_handler(LoanAlreadyReturnedError, bad_request_handler)
    app.add_exception_handler(LoanAlreadyBorrowedError, bad_request_handler)
    app.add_exception_handler(MemberHasActiveLoansError, bad_request_handler)
