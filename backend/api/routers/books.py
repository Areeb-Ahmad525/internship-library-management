from fastapi import APIRouter, Depends, status

from database.models.book import Book

from backend.api.dependencies import get_book_service
from backend.services.book_service import BookService
from backend.schemas import (
    BookCreate,
    BookResponse,
    BookUpdate
)

from backend.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/books",
    tags=["Books"],
)


@router.get(
    "/",
    response_model=list[BookResponse],
)
def get_books(
    current_user: dict = Depends(get_current_user),
    service: BookService = Depends(get_book_service),
) -> list[BookResponse]:
    return service.get_all_books()


@router.get(
    "/search",
    response_model=list[BookResponse],
)
def search_books(
    query: str,
    service: BookService = Depends(get_book_service),
) -> list[BookResponse]:
    return service.search_books(query)


@router.get(
    "/{book_id}",
    response_model=BookResponse,
)
def get_book(
    book_id: int,
    service: BookService = Depends(get_book_service),
) -> BookResponse:
    return service.get_book(book_id)




# post/books
@router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_book(
    book: BookCreate,
    service: BookService = Depends(get_book_service),
) -> BookResponse:

    new_book = Book(
        title=book.title,
        author=book.author,
        total_copies=book.total_copies,
        available_copies=book.available_copies,
        status=book.status,
    )

    return service.create_book(new_book)


@router.put(
    "/{book_id}",
    response_model=BookResponse,
)
def update_book(
    book_id: int,
    book: BookUpdate,
    service: BookService = Depends(get_book_service),
) -> BookResponse:

    return service.update_book(
        book_id=book_id,
        title=book.title,
        author=book.author,
        total_copies=book.total_copies,
        available_copies=book.available_copies,
        status=book.status,
    )


@router.delete(
    "/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_book(
    book_id: int,
    service: BookService = Depends(get_book_service),
) -> None:

    service.soft_delete_book(book_id)