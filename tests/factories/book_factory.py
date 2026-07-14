from sqlalchemy.orm import Session

from database.models.book import Book
from database.models.enums import BookStatus


def create_book(
    db: Session,
    title: str = "Test Book",
    author: str = "Test Author",
    total_copies: int = 5,
    available_copies: int = 5,
    status: BookStatus = BookStatus.AVAILABLE,
) -> Book:
    book = Book(
        title=title,
        author=author,
        total_copies=total_copies,
        available_copies=available_copies,
        status=status,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book
