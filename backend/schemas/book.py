from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

from database.models.enums import BookStatus


class BookCreate(BaseModel):
    title: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=255,
            strip_whitespace=True,
        ),
    ]

    author: Annotated[
        str,
        StringConstraints(
            min_length=2,
            max_length=255,
            strip_whitespace=True,
        ),
    ]

    total_copies: Annotated[
        int,
        Field(gt=0),
    ]

    available_copies: Annotated[
        int,
        Field(ge=0),
    ]

    status: BookStatus = BookStatus.AVAILABLE


class BookUpdate(BaseModel):
    title: Annotated[
        str | None,
        StringConstraints(
            min_length=2,
            max_length=255,
            strip_whitespace=True,
        ),
    ] = None

    author: Annotated[
        str | None,
        StringConstraints(
            min_length=2,
            max_length=255,
            strip_whitespace=True,
        ),
    ] = None

    total_copies: Annotated[
        int | None,
        Field(gt=0),
    ] = None

    available_copies: Annotated[
        int | None,
        Field(ge=0),
    ] = None

    status: BookStatus | None = None


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    total_copies: int
    available_copies: int
    status: BookStatus

    model_config = ConfigDict(
        from_attributes=True,
    )
