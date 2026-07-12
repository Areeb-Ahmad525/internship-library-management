from fastapi import FastAPI

from backend.api.routers.health import router as health_router
from backend.api.routers.books import router as books_router
from backend.api.routers.members import router as members_router
from backend.api.routers.loans import router as loans_router


app = FastAPI(
    title= "Library Management System API",
    description= "REST API for the Library Management System",
    version="1.0.0",
)

app.include_router(health_router)
app.include_router(books_router)
app.include_router(members_router)
app.include_router(loans_router)


@app.get("/")
def root() -> dict[str,str]:
    return{
        "message": "Library Management System API is running."
    }