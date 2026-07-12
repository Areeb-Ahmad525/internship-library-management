class UserAlreadyExistsError(Exception):
    """Raised when a username or email already exists."""
    pass


class InvalidCredentialsError(Exception):
    """Raised when login credentials are invalid."""
    pass