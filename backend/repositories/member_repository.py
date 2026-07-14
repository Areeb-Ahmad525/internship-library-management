from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database.models.member import Member


class MemberRepository:

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, member: Member) -> Member:
        try:
            self.db.add(member)
            self.db.commit()
            self.db.refresh(member)

            return member

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_by_id(self, member_id: int) -> Member | None:
        statement = select(Member).where(
            Member.id == member_id,
            Member.is_deleted.is_(False),
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()

    def get_by_email(self, email: str) -> Member | None:
        statement = select(Member).where(
            Member.email == email,
            Member.is_deleted.is_(False),
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()

    def get_all(self) -> list[Member]:
        statement = (
            select(Member).where(Member.is_deleted.is_(False)).order_by(Member.id)
        )

        result = self.db.execute(statement)

        return list(result.scalars().all())

    def update(self, member: Member) -> Member:
        try:
            self.db.commit()
            self.db.refresh(member)

            return member

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def soft_delete(self, member: Member) -> Member:
        try:
            member.is_deleted = True

            self.db.commit()
            self.db.refresh(member)

            return member

        except SQLAlchemyError:
            self.db.rollback()
            raise
