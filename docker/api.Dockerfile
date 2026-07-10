FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen

COPY . .

EXPOSE 8000

CMD ["tail", "-f", "/dev/null"]
#CMD [
#  "uv", "run", "uvicorn",
#  "backend.api.main:app",
#  "--host", "0.0.0.0",
#  "--port", "8000"
#]
