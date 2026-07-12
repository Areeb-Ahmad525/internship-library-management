from fastapi import FastAPI

from backend.api.exception_handlers import register_exception_handlers
from backend.api.routers.auth import router as auth_router
from backend.api.routers.books import router as books_router
from backend.api.routers.health import router as health_router
from backend.api.routers.loans import router as loans_router
from backend.api.routers.members import router as members_router
from backend.api.routers.users import router as users_router

app = FastAPI(
    title="Library Management System API",
    description="REST API for the Library Management System",
    version="1.0.0",
)

register_exception_handlers(app)

app.include_router(health_router)
app.include_router(books_router)
app.include_router(members_router)
app.include_router(loans_router)
app.include_router(auth_router)
app.include_router(users_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Library Management System API is running."}
