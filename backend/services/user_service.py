from backend.exceptions.user_exceptions import UserNotFoundError
from backend.repositories.user_repository import UserRepository
from database.models.enums import UserRole
from database.models.user import User


class UserService:
    def __init__(
        self,
        repository: UserRepository,
    ) -> None:
        self.repository = repository

    def get_all_users(self) -> list[User]:
        return self.repository.get_all()

    def get_user(self, user_id: int) -> User:
        user = self.repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError(f"User with ID {user_id} not found.")
        return user

    def update_user_role(self, user_id: int, role: UserRole) -> User:
        user = self.get_user(user_id)

        if user.role == role:
            return user

        user.role = role
        return self.repository.update(user)
