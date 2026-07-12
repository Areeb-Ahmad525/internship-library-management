from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.user import User


class UserRepository:

    def __init__(
        self,
        session: Session,
    ) -> None:
        self.session = session

    def create(
        self,
        user: User,
    ) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def update(
        self,
        user: User,
    ) -> User:
        self.session.commit()
        self.session.refresh(user)

        return user

    def get_by_id(
        self,
        user_id: int,
    ) -> User | None:
        statement = select(User).where(
            User.id == user_id,
            User.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def get_by_username(
        self,
        username: str,
    ) -> User | None:
        statement = select(User).where(
            User.username == username,
            User.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def get_by_email(
        self,
        email: str,
    ) -> User | None:
        statement = select(User).where(
            User.email == email,
            User.is_deleted.is_(False),
        )

        return self.session.scalar(statement)

    def get_all(
        self,
    ) -> list[User]:
        statement = (
            select(User)
            .where(
                User.is_deleted.is_(False),
            )
            .order_by(User.id)
        )

        return list(self.session.scalars(statement).all())

    def soft_delete(
        self,
        user: User,
    ) -> User:
        user.is_deleted = True

        self.session.commit()
        self.session.refresh(user)

        return user
