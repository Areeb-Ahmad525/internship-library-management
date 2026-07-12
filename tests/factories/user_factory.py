from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database.models.enums import UserRole
from database.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(
    db: Session,
    username: str = "testuser",
    email: str = "test@example.com",
    password: str = "password123",
    role: UserRole = UserRole.MEMBER,
) -> User:
    hashed_password = pwd_context.hash(password)
    user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
