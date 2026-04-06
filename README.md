# ImageToCode

A powerful tool to convert screenshots, mockups, and designs into clean, functional code using AI.

## Supported Stacks

- HTML + Tailwind
- HTML + CSS
- React + Tailwind
- Vue + Tailwind
- Bootstrap
- Ionic + Tailwind
- SVG

## Supported AI Models

- Gemini 3 Flash and Pro (Google)
- Claude Opus 4.5 (Anthropic)
- GPT-5.3, GPT-5.2, GPT-4.1 (OpenAI)
- DALL-E 3 or Flux Schnell (via Replicate) for image generation

## 🛠 Getting Started

The app has a React/Vite frontend and a FastAPI backend.

### Keys Needed

- OpenAI API key, Anthropic key, or Google Gemini key
- Multiple keys are recommended so you can compare results from different models

### Run the Backend

Uses Poetry for package management (`pip install --upgrade poetry` if you don't have it):

```bash
cd backend
echo "OPENAI_API_KEY=sk-your-key" > .env
echo "ANTHROPIC_API_KEY=your-key" >> .env
echo "GEMINI_API_KEY=your-key" >> .env
poetry install
poetry env activate
# run the printed command, e.g. source /path/to/venv/bin/activate
poetry run uvicorn main:app --reload --port 7001
```

You can also set up the keys using the settings dialog on the front-end (click the gear icon after loading the frontend).

### Run the Frontend

```bash
cd frontend
yarn
yarn dev
```

Open http://localhost:5173 to use the app.

If you prefer to run the backend on a different port, update `VITE_WS_BACKEND_URL` in `frontend/.env.local`.

## Docker

If you have Docker installed on your system, in the root directory, run:

```bash
echo "OPENAI_API_KEY=sk-your-key" > .env
docker-compose up -d --build
```

The app will be up and running at http://localhost:5173.

## 🙋‍♂️ FAQs

- **How do I get an API key?** See [Troubleshooting.md](Troubleshooting.md) for instructions on getting API keys.
- **How can I configure an OpenAI proxy?** Set `OPENAI_BASE_URL` in the `backend/.env` or directly in the UI settings dialog. Make sure the URL has "v1" in the path, e.g. `https://xxx.xxxxx.xxx/v1`.
- **How can I update the backend host?** Configure `VITE_HTTP_BACKEND_URL` and `VITE_WS_BACKEND_URL` in `frontend/.env.local`.
- **Seeing UTF-8 errors on Windows?** Open the `.env` file with Notepad++, then go to Encoding and select UTF-8.

## License

MIT
