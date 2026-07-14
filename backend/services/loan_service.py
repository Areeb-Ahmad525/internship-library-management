from datetime import datetime

from backend.exceptions import (
    BookNotAvailableError,
    BookNotFoundError,
    LoanAlreadyBorrowedError,
    LoanAlreadyReturnedError,
    LoanNotFoundError,
    MemberNotFoundError,
)
from backend.repositories.book_repository import BookRepository
from backend.repositories.loan_repository import LoanRepository
from backend.repositories.member_repository import MemberRepository
from database.models.book import BookStatus
from database.models.enums import LoanStatus
from database.models.loan import Loan


class LoanService:

    def __init__(
        self,
        loan_repository: LoanRepository,
        book_repository: BookRepository,
        member_repository: MemberRepository,
    ) -> None:
        self.loan_repository = loan_repository
        self.book_repository = book_repository
        self.member_repository = member_repository

    def borrow_book(self, loan: Loan) -> Loan:
        book = self.book_repository.get_by_id(loan.book_id)

        if book is None:
            raise BookNotFoundError(f"Book with ID {loan.book_id} not found.")

        member = self.member_repository.get_by_id(loan.member_id)

        if member is None:
            raise MemberNotFoundError(f"Member with ID {loan.member_id} not found.")

        if book.status != BookStatus.AVAILABLE:
            raise BookNotAvailableError("Book is not available for borrowing.")

        if book.available_copies <= 0:
            raise BookNotAvailableError("No copies available.")

        book.available_copies -= 1

        if book.available_copies == 0:
            book.status = BookStatus.OUT_OF_STOCK

        self.book_repository.update(book)

        loan.status = LoanStatus.BORROWED

        return self.loan_repository.create(loan)

    def return_book(self, loan_id: int) -> Loan:
        loan = self.loan_repository.get_by_id(loan_id)

        if loan is None:
            raise LoanNotFoundError(f"Loan with ID {loan_id} not found.")

        if loan.status == LoanStatus.RETURNED:
            raise LoanAlreadyReturnedError("Loan has already been returned.")

        book = self.book_repository.get_by_id(loan.book_id)

        if book is None:
            raise BookNotFoundError(f"Book with ID {loan.book_id} not found.")

        loan.status = LoanStatus.RETURNED
        loan.return_date = datetime.now()

        book.available_copies += 1

        if book.available_copies > 0:
            book.status = BookStatus.AVAILABLE

        self.book_repository.update(book)

        return self.loan_repository.update(loan)

    def get_loan(self, loan_id: int) -> Loan:
        loan = self.loan_repository.get_by_id(loan_id)

        if loan is None:
            raise LoanNotFoundError(f"Loan with ID {loan_id} not found.")

        return loan

    def get_all_loans(self) -> list[Loan]:
        return self.loan_repository.get_all()

    def get_active_loans(self) -> list[Loan]:
        return self.loan_repository.get_active_loans()

    def get_member_loans(
        self,
        member_id: int,
    ) -> list[Loan]:

        member = self.member_repository.get_by_id(member_id)

        if member is None:
            raise MemberNotFoundError(f"Member with ID {member_id} not found.")

        return self.loan_repository.get_by_member(member_id)

    def get_book_loans(
        self,
        book_id: int,
    ) -> list[Loan]:

        book = self.book_repository.get_by_id(book_id)

        if book is None:
            raise BookNotFoundError(f"Book with ID {book_id} not found.")

        return self.loan_repository.get_by_book(book_id)

    def soft_delete_loan(self, loan_id: int) -> Loan:
        loan = self.get_loan(loan_id)

        if loan.status == LoanStatus.BORROWED:
            raise LoanAlreadyBorrowedError("Cannot delete an active loan.")

        return self.loan_repository.soft_delete(loan)
