from unittest.mock import patch


def test_borrow_book_background_task(client, librarian_token, db_session):
    from tests.factories.book_factory import create_book
    from tests.factories.member_factory import create_member

    book = create_book(db_session)
    member = create_member(db_session)

    with patch("backend.api.routers.loans.log_audit_event") as mock_log:
        response = client.post(
            "/loans/borrow",
            json={
                "member_id": member.id,
                "book_id": book.id,
                "due_date": "2030-01-01T00:00:00Z",
            },
            headers=librarian_token,
        )
        assert response.status_code == 201

        loan_id = response.json()["id"]
        mock_log.assert_called_once_with(
            "borrow_book", "Loan", loan_id, "librarian_user"
        )


def test_return_book_background_task(client, librarian_token, db_session):
    from tests.factories.book_factory import create_book
    from tests.factories.loan_factory import create_loan
    from tests.factories.member_factory import create_member

    book = create_book(db_session)
    member = create_member(db_session)
    loan = create_loan(db_session, book_id=book.id, member_id=member.id)

    with patch("backend.api.routers.loans.log_audit_event") as mock_log:
        response = client.post(f"/loans/return/{loan.id}", headers=librarian_token)
        assert response.status_code == 200

        mock_log.assert_called_once_with(
            "return_book", "Loan", loan.id, "librarian_user"
        )


def test_create_book_background_task(client, librarian_token):
    with patch("backend.api.routers.books.log_audit_event") as mock_log:
        response = client.post(
            "/books/",
            json={
                "title": "Background Book",
                "author": "Task Author",
                "total_copies": 5,
                "available_copies": 5,
            },
            headers=librarian_token,
        )
        assert response.status_code == 201

        book_id = response.json()["id"]
        mock_log.assert_called_once_with(
            "create_book", "Book", book_id, "librarian_user"
        )


def test_delete_book_background_task(client, librarian_token, db_session):
    from tests.factories.book_factory import create_book

    book = create_book(db_session)

    with patch("backend.api.routers.books.log_audit_event") as mock_log:
        response = client.delete(f"/books/{book.id}", headers=librarian_token)
        assert response.status_code == 204

        mock_log.assert_called_once_with(
            "delete_book", "Book", book.id, "librarian_user"
        )


def test_update_user_role_background_task(client, admin_token, db_session):
    from tests.factories.user_factory import create_user

    user = create_user(db_session, username="role_user")

    with patch("backend.api.routers.users.log_audit_event") as mock_log:
        response = client.patch(
            f"/users/{user.id}/role", json={"role": "LIBRARIAN"}, headers=admin_token
        )
        assert response.status_code == 200

        mock_log.assert_called_once_with(
            "update_user_role", "User", user.id, "admin_user"
        )
