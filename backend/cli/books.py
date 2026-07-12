from collections.abc import Generator

import typer
from sqlalchemy.orm import Session

from backend.cli.dependencies import (
    get_book_service,
    get_db,
)
from backend.exceptions import BookError
from backend.services.book_service import BookService
from database.models.book import Book
from database.models.enums import BookStatus

app = typer.Typer(
    help="Book management commands",
)


def get_service() -> tuple[BookService, Generator[Session, None, None]]:

    db_generator = get_db()
    db = next(db_generator)

    service = get_book_service(db)

    return service, db_generator


@app.command("add")
def add_book(
    title: str,
    author: str,
    total_copies: int,
    available_copies: int,
    status: BookStatus = BookStatus.AVAILABLE,
) -> None:
    service, db_generator = get_service()

    try:
        book = Book(
            title=title,
            author=author,
            total_copies=total_copies,
            available_copies=available_copies,
            status=status,
        )

        created_book = service.create_book(book)

        typer.echo(f"Book created successfully (ID: {created_book.id})")

    except BookError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("list")
def list_books() -> None:
    service, db_generator = get_service()

    try:
        books = service.get_all_books()

        if not books:
            typer.echo("No books found.")
            return

        for book in books:
            typer.echo(
                f"[{book.id}] "
                f"{book.title} | "
                f"{book.author} | "
                f"Available: {book.available_copies}/{book.total_copies} | "
                f"{book.status.value}"
            )

    except BookError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("search")
def search_books(
    query: str,
) -> None:
    service, db_generator = get_service()

    try:
        books = service.search_books(query)

        if not books:
            typer.echo("No matching books found.")
            return

        for book in books:
            typer.echo(f"[{book.id}] " f"{book.title} | " f"{book.author}")

    except BookError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("update")
def update_book(
    book_id: int,
    title: str | None = None,
    author: str | None = None,
    total_copies: int | None = None,
    available_copies: int | None = None,
    status: BookStatus | None = None,
) -> None:
    service, db_generator = get_service()

    try:
        book = service.update_book(
            book_id=book_id,
            title=title,
            author=author,
            total_copies=total_copies,
            available_copies=available_copies,
            status=status,
        )

        typer.echo(f"Book '{book.title}' updated successfully.")

    except BookError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("delete")
def delete_book(
    book_id: int,
) -> None:
    service, db_generator = get_service()

    try:
        service.soft_delete_book(book_id)

        typer.echo("Book deleted successfully.")

    except BookError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()
