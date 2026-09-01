# Troubleshooting

## The frontend cannot reach the backend

Confirm the backend is running at <http://127.0.0.1:7001>. If it uses a
different host or port, copy `frontend/.env.example` to
`frontend/.env.local`, update both backend URLs, and restart Vite.

## An API key is rejected

Check that the key has no surrounding quotes or spaces and belongs to the
provider selected by the backend. Provider accounts may also need billing
enabled or access to the requested model.

Keys can be entered in the UI settings or placed in the root `.env` file.
Restart the backend after changing `.env`.

## No model can be selected

UIForge needs at least one of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or
`GEMINI_API_KEY`. Video generation requires a Gemini key.

## Docker starts but generation fails

Run `docker compose logs backend` and confirm `.env` exists beside
`docker-compose.yml`. Rebuild after dependency or Dockerfile changes:

```bash
docker compose up --build
```
