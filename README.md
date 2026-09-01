# UIForge

UIForge turns screenshots, text prompts, and existing HTML into editable web
interfaces. It uses a React/Vite frontend and a FastAPI backend, and supports
OpenAI, Anthropic, and Google Gemini models.

## Go live (easiest)

Vercel cannot run this API. Generation uses a WebSocket, and Vercel only runs
short serverless functions. The working setup is:

- **Vercel** = website
- **Render** = API (keeps a process running, supports WebSockets)

### 1. Push this repo to GitHub

### 2. Deploy the API on Render

1. Open <https://dashboard.render.com> and sign in with GitHub.
2. **New +** → **Blueprint**.
3. Select this repo. Render reads `render.yaml`.
4. Add at least one key: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or
   `GEMINI_API_KEY`.
5. Create the service and wait until it is live.
6. Copy the URL, for example `https://uiforge-api.onrender.com`.
7. Open `/health` on that URL and confirm `{"ok": true}`.

Render’s free plan sleeps after idle time. The first generate after a sleep
can take a minute.

### 3. Deploy the website on Vercel

1. Open <https://vercel.com/new> and import the same GitHub repo.
2. Leave the **root directory** empty (repo root) so `vercel.json` is used.
3. Add environment variables:

   | Name | Value |
   | --- | --- |
   | `VITE_HTTP_BACKEND_URL` | `https://uiforge-api.onrender.com` |
   | `VITE_WS_BACKEND_URL` | `wss://uiforge-api.onrender.com` |

   Use your real Render host. No trailing slash.

4. Deploy. Open the Vercel URL, go to `/studio`, and generate.

If you change the Render URL later, update the Vercel env vars and redeploy.
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

The frontend installs with Yarn because `frontend/yarn.lock` is the committed
lockfile. Day-to-day commands still work through npm.

That starts:

- frontend at <http://localhost:5173>
- backend at <http://127.0.0.1:7001>

Studio: <http://localhost:5173/studio>.

```bash
npm run dev:frontend
npm run dev:backend
```

`npm run dev:frontend` is UI only. Generation needs the backend.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Then open <http://localhost:5173>.

## License

[MIT](LICENSE)
