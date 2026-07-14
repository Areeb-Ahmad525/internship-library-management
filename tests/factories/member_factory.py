from sqlalchemy.orm import Session

from database.models.member import Member


def create_member(
    db: Session,
    name: str = "John Doe",
    email: str = "johndoe@example.com",
) -> Member:
    member = Member(
        name=name,
        email=email,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member
