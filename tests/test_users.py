def test_get_users_unauthenticated(client):
    response = client.get("/users/")
    assert response.status_code == 401


def test_get_users_forbidden_member(client, member_token):
    response = client.get("/users/", headers=member_token)
    assert response.status_code == 403


def test_get_users_forbidden_librarian(client, librarian_token):
    response = client.get("/users/", headers=librarian_token)
    assert response.status_code == 403


def test_admin_get_users(client, admin_token, admin_user, member_user):
    response = client.get("/users/", headers=admin_token)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert any(u["username"] == "admin_user" for u in data)


def test_admin_get_user(client, admin_token, member_user):
    response = client.get(f"/users/{member_user.id}", headers=admin_token)
    assert response.status_code == 200
    assert response.json()["username"] == "member_user"
    assert "password_hash" not in response.json()


def test_admin_get_user_not_found(client, admin_token):
    response = client.get("/users/9999", headers=admin_token)
    assert response.status_code == 404


def test_admin_change_role(client, admin_token, member_user, db_session):
    response = client.patch(
        f"/users/{member_user.id}/role", json={"role": "LIBRARIAN"}, headers=admin_token
    )
    assert response.status_code == 200
    assert response.json()["role"] == "LIBRARIAN"

    # Verify DB state
    db_session.refresh(member_user)
    assert member_user.role.value == "LIBRARIAN"


def test_invalid_role_validation(client, admin_token, member_user):
    response = client.patch(
        f"/users/{member_user.id}/role",
        json={"role": "SUPERADMIN"},
        headers=admin_token,
    )
    # Validation error (Pydantic Enum)
    assert response.status_code == 422


def test_admin_change_to_same_role(client, admin_token, member_user):
    response = client.patch(
        f"/users/{member_user.id}/role", json={"role": "MEMBER"}, headers=admin_token
    )
    assert response.status_code in [200, 400, 409]


def test_admin_change_role_nonexistent_user(client, admin_token):
    response = client.patch(
        "/users/9999/role", json={"role": "LIBRARIAN"}, headers=admin_token
    )
    assert response.status_code == 404
