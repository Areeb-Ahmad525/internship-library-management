from datetime import UTC, datetime, timedelta

import jwt

from backend.config import get_settings

settings = get_settings()


def create_access_token(
    data: dict,
) -> str:
    payload = data.copy()

    expire = datetime.now(UTC) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )

    payload["exp"] = expire

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(
    token: str,
) -> dict:
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
    )
