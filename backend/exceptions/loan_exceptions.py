class LoanError(Exception):
    """Base exception for all loan-related errors."""


class LoanNotFoundError(LoanError):
    """Raised when a loan cannot be found."""


class LoanAlreadyBorrowedError(LoanError):
    """Raised when a member already has an active loan for the same book."""


class NoAvailableCopiesError(LoanError):
    """Raised when no copies of the book are available."""


class LoanAlreadyReturnedError(LoanError):
    """Raised when attempting to return an already returned book."""

class LoanAlreadyBorrowedError(Exception):
    """Raised when attempting to delete an active loan."""