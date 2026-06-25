# AgentStack frontend

The web app for AgentStack — sign up, manage projects, view logs, read the API docs.

Built with Vue 3, Vite, and Tailwind.

## Run locally

```bash
npm install
cp .env.example .env.local   # set VITE_API_BASE to your Rails API URL
npm run dev
```

Opens at `http://localhost:5173`. `VITE_API_BASE` defaults to `http://127.0.0.1:3000` in `.env.example` — start the backend first.

## What's in here

- **Home / About** — product pages
- **Sign up / Sign in** — Supabase auth via the backend
- **Dashboard** — projects in the sidebar, logs in the main panel, date filters
- **API keys** — account-level key for agents
- **Docs** — HTTP API reference for sending and reading logs

## Build

```bash
npm run build
```

Output goes to `dist/`.
