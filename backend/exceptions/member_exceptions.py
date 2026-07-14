class MemberError(Exception):
    """Base exception for all member-related errors."""


class MemberNotFoundError(MemberError):
    """Raised when a member cannot be found."""


class DuplicateMemberError(MemberError):
    """Raised when a member with the same email already exists."""


class MemberHasActiveLoansError(MemberError):
    """Raised when attempting to delete a member who has active loans."""
