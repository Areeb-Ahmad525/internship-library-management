from database.models.user import User
from backend.schemas.auth import UserRegister

from backend.auth.hashing import (
    hash_password,
    verify_password,
)
from backend.auth.jwt import create_access_token

from backend.exceptions.user_exceptions import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
)

from backend.repositories.user_repository import UserRepository


class AuthService:

    def __init__(
        self,
        repository: UserRepository,
    ) -> None:
        self.repository = repository

    def register(
        self,
        user_in: UserRegister,
    ) -> User:

        if self.repository.get_by_username(user_in.username):
            raise UserAlreadyExistsError(
                "Username already exists."
            )

        if self.repository.get_by_email(user_in.email):
            raise UserAlreadyExistsError(
                "Email already exists."
            )

        hashed_password = hash_password(user_in.password)

        new_user = User(
            username=user_in.username,
            email=user_in.email,
            password_hash=hashed_password,
        )

        return self.repository.create(new_user)

    def login(
        self,
        username: str,
        password: str,
    ) -> str:

        user = self.repository.get_by_username(username)

        if user is None:
            raise InvalidCredentialsError(
                "Invalid username or password."
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise InvalidCredentialsError(
                "Invalid username or password."
            )

        return create_access_token(
            {
                "sub": user.username,
                "role": user.role,
            }
        )