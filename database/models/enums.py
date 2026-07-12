from enum import Enum


class BookStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    OUT_OF_STOCK = "OUT_OF_STOCK"
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE"
    ARCHIVED = "ARCHIVED"


class LoanStatus(str, Enum):
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"
    LATE = "LATE"


class UserRole(str, Enum):
    LIBRARIAN = "LIBRARIAN"
    MEMBER = "MEMBER"