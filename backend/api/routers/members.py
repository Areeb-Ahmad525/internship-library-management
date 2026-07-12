from fastapi import APIRouter, Depends

from backend.api.dependencies import get_member_service
from backend.schemas import MemberResponse
from backend.services.member_service import MemberService


router = APIRouter(
    prefix="/members",
    tags=["Members"],
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