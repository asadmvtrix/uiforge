# UIForge

UIForge turns screenshots, text prompts, and existing HTML into editable web
interfaces. It uses a React/Vite frontend and a FastAPI backend, and supports
OpenAI, Anthropic, and Google Gemini models.

## Go live (recommended): Render + Vercel

Vercel cannot run this API. Generation uses a WebSocket. The free setup is:

- **Vercel** = website
- **Render free web service** = API (sleeps after ~15 minutes idle)

Prefer creating the API as a **Web Service** (not Blueprint). Blueprint often
fails validation on free accounts.

### 1. Deploy the API on Render (manual Web Service)

1. Open <https://dashboard.render.com> and sign in with GitHub.
2. **New +** → **Web Service** (not Blueprint).
3. Connect / select repo `asadmvtrix/uiforge`.
4. Settings:

   | Field | Value |
   | --- | --- |
   | Name | `uiforge-api` |
   | Language / Runtime | **Python 3** |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Build Command | `pip install "poetry==1.8.0" && poetry config virtualenvs.create false && poetry install --without dev --no-interaction --no-ansi` |
   | Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | Instance type | **Free** |

5. Health Check Path: `/health`
6. Environment variables:

   | Key | Value |
   | --- | --- |
   | `PYTHON_VERSION` | `3.12.3` |
   | `IS_PROD` | `true` |
   | At least one of `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` | your key |

7. Click **Create Web Service**.
8. Wait for the build. Open `https://YOUR-RENDER-URL/health` and confirm
   `{"ok": true}`.

Free services sleep after idle. The first request after sleep can take about a
minute.

Optional: `render.yaml` exists for Blueprint users, but skip it if Render
shows “a few issues.”

### 2. Deploy the website on Vercel

1. Open <https://vercel.com/new> and import the same GitHub repo.
2. Leave **Root Directory** blank / `./` so `vercel.json` is used.
3. Env vars (no trailing slash):

   | Name | Value |
   | --- | --- |
   | `VITE_HTTP_BACKEND_URL` | `https://YOUR-RENDER-URL` |
   | `VITE_WS_BACKEND_URL` | `wss://YOUR-RENDER-URL` |

4. Deploy. Open `/studio` and generate.

## Local development

```bash
cd frontend
yarn install --frozen-lockfile
cd ../backend
poetry install
cd ..
npm run dev
```

- frontend: <http://localhost:5173>
- backend: <http://127.0.0.1:7001>
- studio: <http://localhost:5173/studio>

## License

[MIT](LICENSE)
