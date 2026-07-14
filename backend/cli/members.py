from collections.abc import Generator

import typer
from sqlalchemy.orm import Session

from backend.cli.dependencies import (
    get_db,
    get_member_service,
)
from backend.exceptions import (
    MemberError,
)
from backend.services.member_service import MemberService
from database.models.member import Member

app = typer.Typer(
    help="Member management commands",
)


def get_service() -> tuple[
    MemberService,
    Generator[Session, None, None],
]:
    db_generator = get_db()
    db = next(db_generator)

    service = get_member_service(db)

    return service, db_generator


@app.command("add")
def add_member(
    name: str,
    email: str,
) -> None:
    service, db_generator = get_service()

    try:
        member = Member(
            name=name,
            email=email,
        )

        created_member = service.create_member(member)

        typer.echo(f"Member created successfully (ID: {created_member.id})")

    except MemberError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("list")
def list_members() -> None:
    service, db_generator = get_service()

    try:
        members = service.get_all_members()

        if not members:
            typer.echo("No members found.")
            return

        for member in members:
            typer.echo(f"[{member.id}] " f"{member.name} | " f"{member.email}")

    except MemberError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("update")
def update_member(
    member_id: int,
    name: str | None = None,
    email: str | None = None,
) -> None:
    service, db_generator = get_service()

    try:
        member = service.update_member(
            member_id=member_id,
            name=name,
            email=email,
        )

        typer.echo(f"Member '{member.name}' updated successfully.")

    except MemberError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()


@app.command("delete")
def delete_member(
    member_id: int,
) -> None:
    service, db_generator = get_service()

    try:
        service.soft_delete_member(member_id)

        typer.echo("Member deleted successfully.")

    except MemberError as error:
        typer.echo(f"Error: {error}")
        raise typer.Exit(code=1)

    finally:
        db_generator.close()
