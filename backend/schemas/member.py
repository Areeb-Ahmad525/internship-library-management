from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MemberCreate(BaseModel):
    name: Annotated[
        str,
        Field(
            min_length=2,
            max_length=255,
            strip_whitespace=True,
        ),
    ]

    email: EmailStr


class MemberUpdate(BaseModel):
    name: Annotated[
        str | None,
        Field(
            min_length=2,
            max_length=255,
            strip_whitespace=True,
        ),
    ] = None

    email: EmailStr | None = None


class MemberResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True,
    )