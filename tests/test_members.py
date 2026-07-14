from database.models.member import Member
from tests.factories.member_factory import create_member


def test_member_cannot_access_members(client, member_token):
    response = client.get("/members/", headers=member_token)
    assert response.status_code == 403


def test_librarian_get_members(client, librarian_token, db_session):
    create_member(db_session, name="A", email="a@example.com")
    response = client.get("/members/", headers=librarian_token)
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_librarian_create_member(client, librarian_token, db_session):
    response = client.post(
        "/members/",
        json={
            "name": "New Member",
            "email": "newmember@example.com",
        },
        headers=librarian_token,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newmember@example.com"

    # DB state check
    member_in_db = db_session.query(Member).filter(Member.id == data["id"]).first()
    assert member_in_db is not None
    assert member_in_db.email == "newmember@example.com"


def test_duplicate_member_email(client, librarian_token, db_session):
    create_member(db_session, name="Exist", email="exists@example.com")
    response = client.post(
        "/members/",
        json={
            "name": "Duplicate Member",
            "email": "exists@example.com",
        },
        headers=librarian_token,
    )

    assert response.status_code == 409


def test_member_validation_error(client, librarian_token):
    response = client.post(
        "/members/",
        json={
            "name": "NoEmail",
        },
        headers=librarian_token,
    )
    assert response.status_code == 422


def test_librarian_update_member(client, librarian_token, db_session):
    member = create_member(db_session, name="Old Name")
    response = client.put(
        f"/members/{member.id}", json={"name": "Updated Name"}, headers=librarian_token
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"

    # DB Check
    db_session.refresh(member)
    assert member.name == "Updated Name"


def test_librarian_update_duplicate_email(client, librarian_token, db_session):
    member1 = create_member(db_session, email="member1@example.com")
    member2 = create_member(db_session, email="member2@example.com")

    response = client.put(
        f"/members/{member2.id}", json={"email": member1.email}, headers=librarian_token
    )
    assert response.status_code == 409


def test_librarian_update_nonexistent_member(client, librarian_token):
    response = client.put(
        "/members/9999", json={"name": "Doesn't exist"}, headers=librarian_token
    )
    assert response.status_code == 404


def test_librarian_delete_nonexistent_member(client, librarian_token):
    response = client.delete("/members/9999", headers=librarian_token)
    assert response.status_code == 404


def test_librarian_delete_member_db_check(client, librarian_token, db_session):
    member = create_member(db_session)
    response = client.delete(f"/members/{member.id}", headers=librarian_token)
    assert response.status_code == 204

    db_session.refresh(member)
    assert member.is_deleted is True
