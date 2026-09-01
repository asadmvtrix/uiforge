# UIForge

UIForge turns screenshots, text prompts, and existing HTML into editable web
interfaces. It uses a React/Vite frontend and a FastAPI backend, and supports
OpenAI, Anthropic, and Google Gemini models.

## Requirements

- Node.js 22+
- Corepack/Yarn
- Python 3.10+
- Poetry

## Local development

Create a root `.env` from `.env.example` and add at least one AI provider key.

Start the backend:

```bash
cd backend
poetry install
poetry run uvicorn main:app --reload --port 7001
```

Start the frontend in a second terminal:

```bash
cd frontend
corepack enable
yarn install --frozen-lockfile
yarn dev
```

Open <http://localhost:5173>. The studio is available at
<http://localhost:5173/studio>.

The frontend defaults to a backend at `127.0.0.1:7001`. To use another
backend, copy `frontend/.env.example` to `frontend/.env.local` and update the
URLs.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Then open <http://localhost:5173>.

## Checks

```bash
cd frontend
yarn build
yarn lint

cd ../backend
poetry run pyright
poetry run pytest
```

## License

[MIT](LICENSE)
