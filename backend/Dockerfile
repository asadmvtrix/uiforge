FROM python:3.12.3-slim-bullseye

ENV POETRY_VERSION=1.8.0 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app

COPY poetry.lock pyproject.toml /app/

RUN poetry config virtualenvs.create false \
    && poetry install --without dev --no-interaction --no-ansi

COPY ./ /app/

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
