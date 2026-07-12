from database.models.loan import Loan
from tests.factories.book_factory import create_book
from tests.factories.loan_factory import create_loan
from tests.factories.member_factory import create_member


def test_member_cannot_access_loans(client, member_token):
    response = client.get("/loans", headers=member_token)
    assert response.status_code == 403


def test_librarian_get_loans(client, librarian_token, db_session):
    book = create_book(db_session)
    member = create_member(db_session)
    create_loan(db_session, book_id=book.id, member_id=member.id)

    response = client.get("/loans", headers=librarian_token)
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_librarian_create_loan(client, librarian_token, db_session):
    book = create_book(db_session, available_copies=1)
    member = create_member(db_session)

    response = client.post(
        "/loans/borrow",
        json={
            "book_id": book.id,
            "member_id": member.id,
            "due_date": "2026-12-31T23:59:59",
        },
        headers=librarian_token,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["book_id"] == book.id

    # DB state check
    loan_in_db = db_session.query(Loan).filter(Loan.id == data["id"]).first()
    assert loan_in_db is not None
    assert loan_in_db.book_id == book.id

    # Check that available_copies decreased if we run query directly on db
    db_session.refresh(book)
    assert book.available_copies == 0


def test_borrow_unavailable_book(client, librarian_token, db_session):
    book = create_book(db_session, available_copies=0)
    member = create_member(db_session)

    response = client.post(
        "/loans/borrow",
        json={
            "book_id": book.id,
            "member_id": member.id,
            "due_date": "2026-12-31T23:59:59",
        },
        headers=librarian_token,
    )

    assert response.status_code == 400


def test_loan_validation_error(client, librarian_token):
    response = client.post(
        "/loans/borrow",
        json={
            "book_id": 999,
            # missing member_id
        },
        headers=librarian_token,
    )
    assert response.status_code == 422


def test_return_nonexistent_loan(client, librarian_token):
    response = client.post("/loans/return/9999", headers=librarian_token)
    assert response.status_code == 404


def test_return_already_returned_loan(client, librarian_token, db_session):
    from datetime import datetime

    from database.models.enums import LoanStatus

    book = create_book(db_session)
    member = create_member(db_session)
    loan = create_loan(
        db_session, book_id=book.id, member_id=member.id, status=LoanStatus.RETURNED
    )
    loan.return_date = datetime.now()
    db_session.commit()

    response = client.post(f"/loans/return/{loan.id}", headers=librarian_token)
    assert response.status_code == 400


def test_borrow_nonexistent_member(client, librarian_token, db_session):
    book = create_book(db_session, available_copies=1)
    response = client.post(
        "/loans/borrow",
        json={"book_id": book.id, "member_id": 9999, "due_date": "2026-12-31T23:59:59"},
        headers=librarian_token,
    )
    assert response.status_code == 404


def test_borrow_nonexistent_book(client, librarian_token, db_session):
    member = create_member(db_session)
    response = client.post(
        "/loans/borrow",
        json={
            "book_id": 9999,
            "member_id": member.id,
            "due_date": "2026-12-31T23:59:59",
        },
        headers=librarian_token,
    )
    assert response.status_code == 404


def test_get_nonexistent_loan(client, librarian_token):
    response = client.get("/loans/9999", headers=librarian_token)
    assert response.status_code == 404


def test_get_nonexistent_member_loans(client, librarian_token):
    response = client.get("/loans/member/9999", headers=librarian_token)
    assert response.status_code == 404


def test_get_nonexistent_book_loans(client, librarian_token):
    response = client.get("/loans/book/9999", headers=librarian_token)
    assert response.status_code == 404


def test_return_loan_db_state(client, librarian_token, db_session):
    book = create_book(db_session, available_copies=0)
    member = create_member(db_session)
    loan = create_loan(db_session, book_id=book.id, member_id=member.id)

    response = client.post(f"/loans/return/{loan.id}", headers=librarian_token)
    assert response.status_code == 200

    db_session.refresh(loan)
    db_session.refresh(book)
    assert loan.return_date is not None
    assert loan.status.value == "RETURNED"
    assert book.available_copies == 1
