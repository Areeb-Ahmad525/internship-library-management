from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from backend.exceptions import (
    BookNotAvailableError,
    BookNotFoundError,
    DuplicateBookError,
    DuplicateMemberError,
    InvalidBookCopiesError,
    LoanAlreadyBorrowedError,
    LoanAlreadyReturnedError,
    LoanNotFoundError,
    MemberNotFoundError,
)


def register_exception_handlers(app: FastAPI) -> None:
    """Register all custom exception handlers."""

    @app.exception_handler(BookNotFoundError)
    async def book_not_found_handler(
        request: Request,
        exc: BookNotFoundError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(MemberNotFoundError)
    async def member_not_found_handler(
        request: Request,
        exc: MemberNotFoundError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(LoanNotFoundError)
    async def loan_not_found_handler(
        request: Request,
        exc: LoanNotFoundError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)},
        )

    @app.exception_handler(DuplicateBookError)
    async def duplicate_book_handler(
        request: Request,
        exc: DuplicateBookError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(DuplicateMemberError)
    async def duplicate_member_handler(
        request: Request,
        exc: DuplicateMemberError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(BookNotAvailableError)
    async def book_not_available_handler(
        request: Request,
        exc: BookNotAvailableError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(LoanAlreadyReturnedError)
    async def loan_already_returned_handler(
        request: Request,
        exc: LoanAlreadyReturnedError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(LoanAlreadyBorrowedError)
    async def loan_already_borrowed_handler(
        request: Request,
        exc: LoanAlreadyBorrowedError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc)},
        )

    @app.exception_handler(InvalidBookCopiesError)
    async def invalid_book_copies_handler(
        request: Request,
        exc: InvalidBookCopiesError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": str(exc)},
        )
