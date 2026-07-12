from sqlalchemy import or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.models.book import Book


class BookRepository:
    """Repository for Book database operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, book: Book) -> Book:
        """Create a new book."""

        try:
            self.db.add(book)
            self.db.commit()
            self.db.refresh(book)

            return book

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_by_id(self, book_id: int) -> Book | None:
        """Return a non-deleted book by its ID."""

        statement = select(Book).where(
            Book.id == book_id,
            Book.is_deleted.is_(False),
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()

    def get_all(self) -> list[Book]:
        statement = select(Book).where(Book.is_deleted.is_(False)).order_by(Book.id)

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def search(self, query: str) -> list[Book]:
        statement = (
            select(Book)
            .where(
                Book.is_deleted.is_(False),
                or_(
                    Book.title.ilike(f"%{query}%"),
                    Book.author.ilike(f"%{query}%"),
                ),
            )
            .order_by(Book.title)
        )

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def update(self, book: Book) -> Book:
        try:
            self.db.commit()
            self.db.refresh(book)

            return book

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def soft_delete(self, book: Book) -> Book:
        try:
            book.is_deleted = True

            self.db.commit()
            self.db.refresh(book)

            return book

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_by_title(self, title: str) -> Book | None:
        statement = select(Book).where(
            Book.title == title,
            Book.is_deleted.is_(False),
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()
