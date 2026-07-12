from database.models.book import Book
from tests.factories.book_factory import create_book


def test_get_books(client, member_token, db_session):
    create_book(db_session, title="Book 1")
    create_book(db_session, title="Book 2")
    response = client.get("/books/", headers=member_token)
    assert response.status_code == 200
    assert len(response.json()) >= 2


def test_get_book(client, member_token, db_session):
    book = create_book(db_session, title="Test Book")
    response = client.get(f"/books/{book.id}", headers=member_token)
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book"


def test_member_cannot_create_book(client, member_token):
    response = client.post(
        "/books/",
        json={
            "title": "Hack",
            "author": "Hacker",
            "total_copies": 1,
            "available_copies": 1,
            "status": "AVAILABLE",
        },
        headers=member_token,
    )
    assert response.status_code == 403


def test_librarian_create_book(client, librarian_token, db_session):
    response = client.post(
        "/books/",
        json={
            "title": "Good Book",
            "author": "Good Author",
            "total_copies": 5,
            "available_copies": 5,
            "status": "AVAILABLE",
        },
        headers=librarian_token,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Good Book"

    # Verify DB state
    book_in_db = db_session.query(Book).filter(Book.id == data["id"]).first()
    assert book_in_db is not None
    assert book_in_db.title == "Good Book"


def test_validation_error_books(client, librarian_token):
    # Missing required fields like 'title'
    response = client.post(
        "/books/",
        json={
            "author": "Author without title",
        },
        headers=librarian_token,
    )
    assert response.status_code == 422


def test_librarian_delete_book(client, librarian_token, db_session):
    book = create_book(db_session, title="Delete Me")
    response = client.delete(f"/books/{book.id}", headers=librarian_token)
    assert response.status_code == 204

    # Verify DB state (soft delete or hard delete depending on implementation)
    db_session.refresh(book)
    assert book.is_deleted is True


def test_librarian_update_book(client, librarian_token, db_session):
    book = create_book(
        db_session,
        title="Old Title",
        author="Old Author",
        total_copies=5,
        available_copies=5,
    )
    response = client.put(
        f"/books/{book.id}",
        json={
            "title": "New Title",
            "author": "New Author",
            "total_copies": 10,
            "available_copies": 8,
            "status": "OUT_OF_STOCK",
        },
        headers=librarian_token,
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"
    assert response.json()["author"] == "New Author"

    # DB State Check
    db_session.refresh(book)
    assert book.title == "New Title"
    assert book.author == "New Author"
    assert book.total_copies == 10
    assert book.available_copies == 8
    assert book.status.value == "OUT_OF_STOCK"


def test_librarian_update_nonexistent_book(client, librarian_token):
    response = client.put(
        "/books/9999", json={"title": "Doesn't exist"}, headers=librarian_token
    )
    assert response.status_code == 404


def test_librarian_delete_nonexistent_book(client, librarian_token):
    response = client.delete("/books/9999", headers=librarian_token)
    assert response.status_code == 404


def test_duplicate_book_update(client, librarian_token, db_session):
    book1 = create_book(db_session, title="Unique 1")
    book2 = create_book(db_session, title="Unique 2")
    response = client.put(
        f"/books/{book2.id}", json={"title": book1.title}, headers=librarian_token
    )
    assert response.status_code == 409


def test_duplicate_book_create(client, librarian_token, db_session):
    book = create_book(db_session, title="Already Exists")
    response = client.post(
        "/books/",
        json={
            "title": book.title,
            "author": "Author",
            "total_copies": 1,
            "available_copies": 1,
        },
        headers=librarian_token,
    )
    assert response.status_code == 409


def test_invalid_book_copies(client, librarian_token):
    # Total <= 0 (Caught by Pydantic 422)
    res1 = client.post(
        "/books/",
        json={"title": "T1", "author": "A1", "total_copies": 0, "available_copies": 0},
        headers=librarian_token,
    )
    assert res1.status_code == 422

    # Available > Total (Caught by Service 400)
    res2 = client.post(
        "/books/",
        json={"title": "T2", "author": "A2", "total_copies": 1, "available_copies": 2},
        headers=librarian_token,
    )
    assert res2.status_code == 400


def test_search_books_no_results(client, member_token):
    response = client.get(
        "/books/search?query=SUPER_OBSCURE_BOOK_STRING", headers=member_token
    )
    assert response.status_code == 200
    assert len(response.json()) == 0
