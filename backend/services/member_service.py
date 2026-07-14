from backend.exceptions import (
    DuplicateMemberError,
    MemberNotFoundError,
)
from backend.repositories.member_repository import MemberRepository
from database.models.member import Member


class MemberService:

    def __init__(self, repository: MemberRepository) -> None:
        self.repository = repository

    def create_member(self, member: Member) -> Member:
        existing_member = self.repository.get_by_email(member.email)

        if existing_member is not None:
            raise DuplicateMemberError(
                f"Member with email '{member.email}' already exists."
            )

        return self.repository.create(member)

    def get_member(self, member_id: int) -> Member:
        member = self.repository.get_by_id(member_id)

        if member is None:
            raise MemberNotFoundError(f"Member with ID {member_id} not found.")

        return member

    def get_member_by_email(self, email: str) -> Member:
        member = self.repository.get_by_email(email)

        if member is None:
            raise MemberNotFoundError(f"Member with email '{email}' not found.")

        return member

    def get_all_members(self) -> list[Member]:
        return self.repository.get_all()

    def update_member(
        self,
        member_id: int,
        name: str | None = None,
        email: str | None = None,
    ) -> Member:

        member = self.get_member(member_id)

        if email is not None:
            duplicate = self.repository.get_by_email(email)

            if duplicate is not None and duplicate.id != member.id:
                raise DuplicateMemberError(
                    f"Member with email '{email}' already exists."
                )

            member.email = email

        if name is not None:
            member.name = name

        return self.repository.update(member)

    def soft_delete_member(self, member_id: int) -> Member:
        member = self.get_member(member_id)

        return self.repository.soft_delete(member)
