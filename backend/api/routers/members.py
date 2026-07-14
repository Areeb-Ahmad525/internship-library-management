from fastapi import APIRouter, Depends, status

from backend.api.dependencies import get_member_service
from backend.auth.dependencies import require_role
from backend.schemas import (
    MemberCreate,
    MemberResponse,
    MemberUpdate,
)
from backend.services.member_service import MemberService
from database.models.enums import UserRole
from database.models.member import Member

router = APIRouter(
    prefix="/members",
    tags=["Members"],
    dependencies=[Depends(require_role(UserRole.LIBRARIAN))],
)


@router.get(
    "/",
    response_model=list[MemberResponse],
)
def get_members(
    service: MemberService = Depends(get_member_service),
) -> list[MemberResponse]:
    return service.get_all_members()


@router.get(
    "/{member_id}",
    response_model=MemberResponse,
)
def get_member(
    member_id: int,
    service: MemberService = Depends(get_member_service),
) -> MemberResponse:
    return service.get_member(member_id)


@router.post(
    "/",
    response_model=MemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_member(
    member: MemberCreate,
    service: MemberService = Depends(get_member_service),
) -> MemberResponse:

    new_member = Member(
        name=member.name,
        email=member.email,
    )

    return service.create_member(new_member)


@router.put(
    "/{member_id}",
    response_model=MemberResponse,
)
def update_member(
    member_id: int,
    member: MemberUpdate,
    service: MemberService = Depends(get_member_service),
) -> MemberResponse:

    return service.update_member(
        member_id=member_id,
        name=member.name,
        email=member.email,
    )


@router.delete(
    "/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_member(
    member_id: int,
    service: MemberService = Depends(get_member_service),
) -> None:

    service.soft_delete_member(member_id)
