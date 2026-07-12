from fastapi import APIRouter, Depends

from backend.api.dependencies import get_book_service
from backend.schemas import BookResponse
from backend.services.book_service import BookService


router = APIRouter(
    prefix="/books",
    tags=["Books"],
)


@router.get(
    "/",
    response_model=list[BookResponse],
)
def get_books(
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


