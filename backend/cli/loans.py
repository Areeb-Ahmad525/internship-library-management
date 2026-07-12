from collections.abc import Generator
from datetime import datetime

import typer
from sqlalchemy.orm import Session

from backend.cli.dependencies import (
    get_db,
    get_loan_service,
)
from backend.exceptions import LoanError
from backend.services.loan_service import LoanService
from database.models.loan import Loan

app = typer.Typer(
    help="Loan management commands",
)


def get_service() -> tuple[
    LoanService,
    Generator[Session, None, None],
]:
    db_generator = get_db()
    db = next(db_generator)

    service = get_loan_service(db)

    return service, db_generator


@app.command("borrow")
def borrow_book(
    member_id: int,
    book_id: int,
    due_date: datetime,
) -> None:
    service, db_generator = get_service()

    try:
        loan = Loan(
            member_id=member_id,
            book_id=book_id,
            borrow_date=datetime.now(),
            due_date=due_date,
        )

        created_loan = service.borrow_book(loan)

        typer.echo(f"Loan created successfully (ID: {created_loan.id})")

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("return")
def return_book(
    loan_id: int,
) -> None:
    service, db_generator = get_service()

    try:
        service.return_book(loan_id)

        typer.echo("Book returned successfully.")

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("list")
def list_loans() -> None:
    service, db_generator = get_service()

    try:
        loans = service.get_all_loans()

        if not loans:
            typer.echo("No loans found.")
            return

        for loan in loans:
            typer.echo(
                f"[{loan.id}] "
                f"Book={loan.book_id} "
                f"Member={loan.member_id} "
                f"Status={loan.status.value}"
            )

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("active")
def active_loans() -> None:
    service, db_generator = get_service()

    try:
        loans = service.get_active_loans()

        if not loans:
            typer.echo("No active loans found.")
            return

        for loan in loans:
            typer.echo(
                f"[{loan.id}] "
                f"Book={loan.book_id} "
                f"Member={loan.member_id} "
                f"Due={loan.due_date}"
            )

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("member")
def member_loans(
    member_id: int,
) -> None:
    service, db_generator = get_service()

    try:
        loans = service.get_member_loans(member_id)

        if not loans:
            typer.echo("No loans found for this member.")
            return

        for loan in loans:
            typer.echo(
                f"[{loan.id}] " f"Book={loan.book_id} " f"Status={loan.status.value}"
            )

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("book")
def book_loans(
    book_id: int,
) -> None:
    service, db_generator = get_service()

    try:
        loans = service.get_book_loans(book_id)

        if not loans:
            typer.echo("No loans found for this book.")
            return

        for loan in loans:
            typer.echo(
                f"[{loan.id}] "
                f"Member={loan.member_id} "
                f"Status={loan.status.value}"
            )

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("delete")
def delete_loan(
    loan_id: int,
) -> None:
    service, db_generator = get_service()

    try:
        service.soft_delete_loan(loan_id)

        typer.echo("Loan deleted successfully.")

    except LoanError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()
