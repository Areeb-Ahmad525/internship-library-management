import typer

from backend.cli.books import app as books_app
from backend.cli.members import app as members_app
from backend.cli.loans import app as loans_app


app = typer.Typer(
    help="Library Management System CLI",
    no_args_is_help=True,
)

app.add_typer(
    books_app,
    name="books",
    help="Book management commands",
)

app.add_typer(
    members_app,
    name="members",
    help="Member management commands",
)

app.add_typer(
    loans_app,
    name="loans",
    help="Loan management commands",
)


if __name__ == "__main__":
    app()