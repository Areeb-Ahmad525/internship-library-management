from pydantic import BaseModel, ConfigDict


class MemberCreate(BaseModel):
    name: str
    email: str


class MemberUpdate(BaseModel):
    name: str | None = None
    email: str | None = None


class MemberResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(
        from_attributes=True,
    )