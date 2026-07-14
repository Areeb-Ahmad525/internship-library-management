class BookError(Exception):
    """Base exception for all book-related errors."""


class BookNotFoundError(BookError):
    """Raised when a book cannot be found."""


class DuplicateBookError(BookError):
    """Raised when a duplicate book is created."""


class InvalidBookCopiesError(BookError):
    """Raised when book copy counts are invalid."""


class BookNotAvailableError(BookError):
    """Raised when a book is unavailable for borrowing."""


class ActiveLoanExistsError(BookError):
    """Raised when attempting to delete a book that has active loans."""
