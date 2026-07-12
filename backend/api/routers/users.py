from fastapi import APIRouter, BackgroundTasks, Depends

from backend.api.dependencies import get_user_service
from backend.auth.dependencies import require_role
from backend.background_tasks.audit import log_audit_event
from backend.schemas.auth import UserResponse, UserRoleUpdate
from backend.services.user_service import UserService
from database.models.enums import UserRole
from database.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(require_role(UserRole.ADMIN))],
)


@router.get(
    "/",
    response_model=list[UserResponse],
)
def get_users(
    service: UserService = Depends(get_user_service),
) -> list[UserResponse]:
    return service.get_all_users()


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    return service.get_user(user_id)


@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    background_tasks: BackgroundTasks,
    service: UserService = Depends(get_user_service),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
) -> UserResponse:
    result = service.update_user_role(user_id, role_update.role)
    background_tasks.add_task(log_audit_event, "update_user_role", "User", result.id, current_user.username)
    return result
