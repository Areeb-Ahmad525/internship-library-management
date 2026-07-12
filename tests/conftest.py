import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.api.dependencies import get_db
from backend.api.main import app
from backend.auth.jwt import create_access_token
from database.base import Base
from database.models.enums import UserRole
from database.models.user import User
from tests.factories.user_factory import create_user

# File-based SQLite test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_database.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create all tables once per test session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    """
    Yields a transactional database session.
    Rolls back the transaction after every test, ensuring clean state.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    """
    FastAPI TestClient that overrides the get_db dependency
    to use the transactional db_session.
    """

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


# User Fixtures
@pytest.fixture
def member_user(db_session):
    return create_user(
        db_session,
        username="member_user",
        email="member@example.com",
        role=UserRole.MEMBER,
    )


@pytest.fixture
def librarian_user(db_session):
    return create_user(
        db_session,
        username="librarian_user",
        email="librarian@example.com",
        role=UserRole.LIBRARIAN,
    )


@pytest.fixture
def admin_user(db_session):
    return create_user(
        db_session,
        username="admin_user",
        email="admin@example.com",
        role=UserRole.ADMIN,
    )


# Token Fixtures
def _generate_auth_header(user: User):
    token = create_access_token(data={"sub": user.username, "role": user.role.value})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def member_token(member_user):
    return _generate_auth_header(member_user)


@pytest.fixture
def librarian_token(librarian_user):
    return _generate_auth_header(librarian_user)


@pytest.fixture
def admin_token(admin_user):
    return _generate_auth_header(admin_user)
