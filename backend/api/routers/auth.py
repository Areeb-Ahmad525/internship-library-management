from fastapi import APIRouter, Depends, status

from backend.api.dependencies import get_auth_service
from backend.schemas import (
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
)
from backend.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserRegister,
    service: AuthService = Depends(get_auth_service),
) -> UserResponse:

    return service.register(user)


@router.post(
    "/login",
    response_model=Token,
)
def login(
    credentials: UserLogin,
    service: AuthService = Depends(get_auth_service),
) -> Token:

    access_token = service.login(
        username=credentials.username,
        password=credentials.password,
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
    )
