from datetime import timedelta
from backend.auth.jwt import create_access_token


def test_register_success(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert "password" not in data
    assert "password_hash" not in data


def test_register_duplicate_username(client, member_user):
    response = client.post(
        "/auth/register",
        json={
            "username": "member_user",
            "email": "another@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 409


def test_register_duplicate_email(client, member_user):
    response = client.post(
        "/auth/register",
        json={
            "username": "anotheruser",
            "email": "member@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 409


def test_login_success(client, member_user):
    response = client.post(
        "/auth/login", json={"username": "member_user", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_wrong_password(client, member_user):
    response = client.post(
        "/auth/login", json={"username": "member_user", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_login_wrong_username(client):
    response = client.post(
        "/auth/login", json={"username": "nonexistent", "password": "password123"}
    )
    assert response.status_code == 401


def test_unauthenticated_request(client):
    # GET /books/ requires auth
    response = client.get("/books/")
    assert response.status_code == 401


def test_invalid_token(client):
    response = client.get(
        "/books/", headers={"Authorization": "Bearer invalid_token_here"}
    )
    assert response.status_code == 401


def test_expired_token(client, member_user):
    from datetime import UTC, datetime

    import jwt

    from backend.config import get_settings

    settings = get_settings()

    payload = {"sub": member_user.username, "role": member_user.role.value}
    payload["exp"] = datetime.now(UTC) - timedelta(minutes=10)

    expired_token = jwt.encode(
        payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )

    response = client.get(
        "/books/", headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401


def test_token_missing_sub(client, member_user):
    token = create_access_token(data={"role": member_user.role.value})
    response = client.get("/books/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_token_nonexistent_user(client):
    token = create_access_token(data={"sub": "ghost_user", "role": "MEMBER"})
    response = client.get("/books/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
