from fastapi import APIRouter, BackgroundTasks, Depends, status

from backend.api.dependencies import get_book_service
from backend.auth.dependencies import get_current_user, require_role
from backend.background_tasks.audit import log_audit_event
from backend.schemas import BookCreate, BookResponse, BookUpdate
from backend.services.book_service import BookService
from database.models.book import Book
from database.models.enums import UserRole
from database.models.user import User

router = APIRouter(
    prefix="/books",
    tags=["Books"],
    dependencies=[Depends(get_current_user)],
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


# post/books
@router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(UserRole.LIBRARIAN))],
)
def create_book(
    book: BookCreate,
    background_tasks: BackgroundTasks,
    service: BookService = Depends(get_book_service),
    current_user: User = Depends(require_role(UserRole.LIBRARIAN)),
) -> BookResponse:

    new_book = Book(
        title=book.title,
        author=book.author,
        total_copies=book.total_copies,
        available_copies=book.available_copies,
        status=book.status,
    )

    result = service.create_book(new_book)
    background_tasks.add_task(
        log_audit_event, "create_book", "Book", result.id, current_user.username
    )
    return result


@router.put(
    "/{book_id}",
    response_model=BookResponse,
    dependencies=[Depends(require_role(UserRole.LIBRARIAN))],
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
    dependencies=[Depends(require_role(UserRole.LIBRARIAN))],
)
def delete_book(
    book_id: int,
    background_tasks: BackgroundTasks,
    service: BookService = Depends(get_book_service),
    current_user: User = Depends(require_role(UserRole.LIBRARIAN)),
) -> None:

    service.soft_delete_book(book_id)
    background_tasks.add_task(
        log_audit_event, "delete_book", "Book", book_id, current_user.username
    )
