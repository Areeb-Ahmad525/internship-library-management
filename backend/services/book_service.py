from backend.exceptions import (
    BookNotFoundError,
    DuplicateBookError,
    InvalidBookCopiesError,
)
from backend.repositories.book_repository import BookRepository
from database.models.book import Book
from database.models.enums import BookStatus


class BookService:

    def __init__(self, repository: BookRepository) -> None:
        self.repository = repository

    def _validate_book_copies(
        self,
        total_copies: int,
        available_copies: int,
    ) -> None:
        if total_copies <= 0:
            raise InvalidBookCopiesError("Total copies must be greater than zero.")

        if available_copies < 0:
            raise InvalidBookCopiesError("Available copies cannot be negative.")

        if available_copies > total_copies:
            raise InvalidBookCopiesError("Available copies cannot exceed total copies.")

    def create_book(self, book: Book) -> Book:
        existing_book = self.repository.get_by_title(book.title)

        if existing_book is not None:
            raise DuplicateBookError(f"Book '{book.title}' already exists.")

        self._validate_book_copies(
            book.total_copies,
            book.available_copies,
        )

        return self.repository.create(book)

    def get_book(self, book_id: int) -> Book:
        book = self.repository.get_by_id(book_id)

        if book is None:
            raise BookNotFoundError(f"Book with ID {book_id} not found.")

        return book

    def get_all_books(self) -> list[Book]:
        return self.repository.get_all()

    def search_books(self, query: str) -> list[Book]:
        return self.repository.search(query)

    def update_book(
        self,
        book_id: int,
        title: str | None = None,
        author: str | None = None,
        total_copies: int | None = None,
        available_copies: int | None = None,
        status: BookStatus | None = None,
    ) -> Book:

        book = self.get_book(book_id)

        if title is not None:
            duplicate = self.repository.get_by_title(title)

            if duplicate is not None and duplicate.id != book.id:
                raise DuplicateBookError(f"Book '{title}' already exists.")

            book.title = title

        if author is not None:
            book.author = author

        if total_copies is not None:
            book.total_copies = total_copies

        if available_copies is not None:
            book.available_copies = available_copies

        self._validate_book_copies(
            book.total_copies,
            book.available_copies,
        )

        if status is not None:
            book.status = status

        return self.repository.update(book)

    def soft_delete_book(self, book_id: int) -> Book:
        book = self.get_book(book_id)

        return self.repository.soft_delete(book)
