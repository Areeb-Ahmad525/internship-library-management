# Library Management System

A production-ready **Library Management System** built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, and **Docker** following a layered architecture.

---

## Features

- RESTful API using FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- Alembic database migrations
- Dockerized services
- Role-Based Access Control (RBAC)
- JWT Authentication
- Repository-Service architecture
- Environment-based configuration
- Interactive Swagger documentation

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python 3.13 | Programming Language |
| FastAPI | REST API |
| PostgreSQL | Database |
| SQLAlchemy | ORM |
| Alembic | Database Migrations |
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| uv | Dependency Management |

---

## Project Structure

```
library-management/
│
├── src/
│   ├── api/
│   ├── cli/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── auth/
│   └── main.py
│
├── alembic/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── uv.lock
├── .env.example
├── README.md
└── .gitignore
```

---

## Prerequisites

- Python 3.13+
- Docker
- Docker Compose
- uv

---

## Installation

Clone the repository.

```bash
git clone <repository-url>
cd library-management
```

Install dependencies.

```bash
uv sync
```

Create the environment file.

```bash
cp .env.example .env
```

Run database migrations.

```bash
alembic upgrade head
```

Start the FastAPI server.

```bash
uv run uvicorn src.main:app --reload
```

---

## Running with Docker

Build and start the application.

```bash
docker compose up --build
```

Run in detached mode.

```bash
docker compose up -d
```

Stop the containers.

```bash
docker compose down
```

---

## API Documentation

Once the application is running, visit:

Swagger UI

```
http://localhost:8000/docs
```

ReDoc

```
http://localhost:8000/redoc
```

---

## Database Migrations

Create a migration.

```bash
alembic revision --autogenerate -m "message"
```

Apply migrations.

```bash
alembic upgrade head
```

Rollback one migration.

```bash
alembic downgrade -1
```

---

## Testing

Run all tests.

```bash
uv run pytest
```

---

## Linting

```bash
uv run ruff check .
```

---

## Type Checking

```bash
uv run mypy src
```

---

## Authentication

The system uses:

- JWT Authentication
- Access Tokens
- Role-Based Authorization
- Protected Routes

---

## Git Workflow

```
main
├── integration
├── staging
└── feature/<feature-name>
```

Workflow:

1. Create a feature branch from `main`.
2. Implement the feature.
3. Merge into `integration`.
4. Resolve conflicts.
5. Create a Pull Request to `staging`.
6. After testing, merge `staging` into `main`.

---

## Environment Variables

Example:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=library
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## License

This project is intended for educational and internship purposes.