from collections.abc import Generator

from fastapi import Depends

from sqlalchemy.orm import Session

from database.session import SessionLocal

from backend.repositories.book_repository import BookRepository
from backend.repositories.member_repository import MemberRepository
from backend.repositories.loan_repository import LoanRepository

from backend.services.book_service import BookService
from backend.services.member_service import MemberService
from backend.services.loan_service import LoanService

from backend.repositories.user_repository import UserRepository
from backend.services.auth_service import AuthService


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()



def get_book_service(
    db: Session = Depends(get_db),
) -> BookService:
    repository = BookRepository(db)

    return BookService(repository)


def get_member_service(
    db: Session = Depends(get_db),
) -> MemberService:
    repository = MemberRepository(db)

    return MemberService(repository)


def get_loan_service(
    db: Session = Depends(get_db),
) -> LoanService:
    loan_repository = LoanRepository(db)
    book_repository = BookRepository(db)
    member_repository = MemberRepository(db)

    return LoanService(
        loan_repository=loan_repository,
        book_repository=book_repository,
        member_repository=member_repository,
    )


def get_user_repository(
    session: Session = Depends(get_db),
) -> UserRepository:
    return UserRepository(session)


def get_auth_service(
    repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(repository)