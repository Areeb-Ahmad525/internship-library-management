from collections.abc import Generator

from sqlalchemy.orm import Session

from backend.repositories.book_repository import BookRepository
from backend.repositories.loan_repository import LoanRepository
from backend.repositories.member_repository import MemberRepository
from backend.services.book_service import BookService
from backend.services.loan_service import LoanService
from backend.services.member_service import MemberService
from database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_book_service(db: Session) -> BookService:
    repository = BookRepository(db)

    return BookService(repository)


def get_member_service(db: Session) -> MemberService:
    repository = MemberRepository(db)

    return MemberService(repository)


def get_loan_service(db: Session) -> LoanService:
    loan_repository = LoanRepository(db)
    book_repository = BookRepository(db)
    member_repository = MemberRepository(db)

    return LoanService(
        loan_repository=loan_repository,
        book_repository=book_repository,
        member_repository=member_repository,
    )
