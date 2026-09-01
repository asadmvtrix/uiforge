# UIForge

UIForge turns screenshots, text prompts, and existing HTML into editable web
interfaces. It uses a React/Vite frontend and a FastAPI backend, and supports
OpenAI, Anthropic, and Google Gemini models.

## Go live (recommended): Koyeb + Vercel

Vercel cannot run this API. Generation uses a WebSocket. The free setup is:

- **Vercel** = website
- **Koyeb free instance** = API (sleeps after about 1 hour idle; usually no card)

### 1. Push this repo to GitHub

Already done if you are on `main` at `asadmvtrix/uiforge`.

### 2. Deploy the API on Koyeb

1. Open <https://app.koyeb.com> and sign up / sign in with GitHub.
2. Click **Create Web Service**.
3. Choose **GitHub**, install the Koyeb GitHub App if asked, and select
   `asadmvtrix/uiforge`.
4. Branch: `main`.
5. Builder: **Dockerfile** (not buildpack).
6. Dockerfile location / work directory:
   - Work directory: `backend`
   - Dockerfile: `Dockerfile` (inside `backend`)
7. Instance: **Free** (Frankfurt or Washington, D.C.).
8. Exposed port:
   - Port: `8000`
   - Protocol: `HTTP`
   - Path: `/`
9. Health check (recommended):
   - Protocol: `HTTP`
   - Path: `/health`
10. Environment variables:

    | Name | Value |
    | --- | --- |
    | `PORT` | `8000` |
    | `IS_PROD` | `true` |
    | `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` or `GEMINI_API_KEY` | your key |

    Add at least one provider key. Leave the others blank if unused.

11. Click **Deploy**. Wait for the build (often 5–15 minutes the first time).
12. Copy the public URL, for example `https://uiforge-xxxx.koyeb.app`.
13. Open `https://YOUR-KOYEB-URL/health` and confirm `{"ok": true}`.

The free instance sleeps after about an hour with no traffic. The first
generate after that can take ~30–90 seconds while it wakes up.

### 3. Deploy the website on Vercel

1. Open <https://vercel.com/new> and import the same GitHub repo.
2. Leave **Root Directory** blank / `./` so `vercel.json` is used.
3. Add environment variables (no trailing slash):

   | Name | Value |
   | --- | --- |
   | `VITE_HTTP_BACKEND_URL` | `https://YOUR-KOYEB-URL` |
   | `VITE_WS_BACKEND_URL` | `wss://YOUR-KOYEB-URL` |

4. Deploy. Open the Vercel URL → `/studio` → generate.

If you change the Koyeb URL later, update the Vercel env vars and **Redeploy**.
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
