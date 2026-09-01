# UIForge

UIForge turns screenshots, text prompts, and existing HTML into editable web
interfaces. It uses a React/Vite frontend and a FastAPI backend, and supports
OpenAI, Anthropic, and Google Gemini models.

## Go live (recommended): Render + Vercel

Vercel cannot run this API. Generation uses a WebSocket. The free setup is:

- **Vercel** = website
- **Render free web service** = API (sleeps after idle; supports WebSockets)

Render may ask for a card to verify the account. The free plan itself does not
charge for this API if you stay on Free.

### 1. Push this repo to GitHub

Already done if you are on `main` at `asadmvtrix/uiforge`.

### 2. Deploy the API on Render

1. Open <https://dashboard.render.com> and sign in with GitHub.
2. Click **New +** → **Blueprint**.
3. Connect the `asadmvtrix/uiforge` repo if prompted.
4. Select that repo. Render reads `render.yaml` and shows **uiforge-api**.
5. Fill in at least one secret (leave unused ones blank):

   - `OPENAI_API_KEY` or
   - `ANTHROPIC_API_KEY` or
   - `GEMINI_API_KEY`

6. Leave `OPENAI_BASE_URL` and `REPLICATE_API_KEY` blank unless you use them.
7. Click **Apply**.
8. Wait for the Docker build (often 5–15 minutes the first time). Watch
   **Logs**.
9. When status is **Live**, copy the service URL, for example
   `https://uiforge-api.onrender.com` (your suffix may differ).
10. Open `https://YOUR-RENDER-URL/health` and confirm `{"ok": true}`.

Free services sleep after inactivity. The first generate after sleep can take
about a minute while Render wakes the container.

### 3. Deploy the website on Vercel

1. Open <https://vercel.com/new> and import the same GitHub repo.
2. Leave **Root Directory** blank / `./` so `vercel.json` is used.
3. Add environment variables (no trailing slash):

   | Name | Value |
   | --- | --- |
   | `VITE_HTTP_BACKEND_URL` | `https://YOUR-RENDER-URL` |
   | `VITE_WS_BACKEND_URL` | `wss://YOUR-RENDER-URL` |

4. Deploy. Open the Vercel URL → `/studio` → generate.

If you change the Render URL later, update the Vercel env vars and **Redeploy**.
Vite bakes those values in at build time.

## Local development

- Node.js 22+
- Python 3.10+
- Poetry

Create a root `.env` from `.env.example` and add at least one AI provider key.

```bash
cd frontend
yarn install --frozen-lockfile
cd ../backend
poetry install
cd ..
npm run dev
```

That starts:

- frontend at <http://localhost:5173>
- backend at <http://127.0.0.1:7001>

Studio: <http://localhost:5173/studio>.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Then open <http://localhost:5173>.

## License

[MIT](LICENSE)
