from collections.abc import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from backend.api.dependencies import get_user_repository
from backend.auth.jwt import decode_access_token
from backend.repositories.user_repository import UserRepository
from database.models.enums import UserRole
from database.models.user import User

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
)


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials.",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    repository: UserRepository = Depends(get_user_repository),
) -> User:
    """
    Validate JWT and return authenticated user.
    """

    try:
        payload = decode_access_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = repository.get_by_username(username)
    if user is None:
        raise credentials_exception
    return user


forbidden_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Not enough permissions.",
)


def require_role(
    *allowed_roles: UserRole,
) -> Callable[..., User]:
    """
    Ensure authenticated user has one of the allowed roles.
    """

    def role_checker(
        user: User = Depends(get_current_user),
    ) -> User:

        if user.role not in allowed_roles:
            raise forbidden_exception

        return user

    return role_checker
