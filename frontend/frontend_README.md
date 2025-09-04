# 🎯 Night Crawler – Frontend (React + Vite)

React‑SPA, die die Flask‑API konsumiert. Routing, Suche, Bookmarks und Verwaltung von Such‑Alerts.

## Setup (Dev)

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm run dev
# → http://localhost:5173
```

## Build/Preview

```bash
npm run build
npm run preview
```

## Linting & Format

```bash
npm run lint
npm run lint:fix
npm run format:check
npm run format:fix
```

## Env

- `VITE_API_URL` – Basis‑URL zur Backend‑API

## Docker

Das Frontend‑Image ist `mrrobob/nightcrawler-frontend`.
Im Compose wird Port **5173** exponiert, im Container spricht das Frontend das Backend unter `http://backend:3050` an.
