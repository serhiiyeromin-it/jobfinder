# Azure App Service Deployment Guide

## Architektur
- Zwei WebApps (Linux): **Backend** (Flask) und **Frontend** (Vite/React Build).
- CI via GitHub Actions: `backend-deploy.yml` / `frontend-deploy.yml`.

## Secrets (GitHub)
- `AZUREAPPSERVICE_PUBLISHPROFILE_BACKEND`
- `AZUREAPPSERVICE_PUBLISHPROFILE_FRONTEND`

## Backend WebApp
- App Settings: `MONGO_URI`, `JWT_SECRET`, optional `BAA_API_KEY`, `MAIL_*`, `PUBLIC_APP_URL` (Frontend‑URL).
- Startup command:
  ```
  gunicorn server:app -b 0.0.0.0:${PORT:-3050}
  ```
- CORS: `PUBLIC_APP_URL` auf deine Prod‑Frontend‑Domain.

## Frontend WebApp
- App Setting: `VITE_API_URL` auf **öffentliche Backend‑URL**.
- Build im Workflow → `web.zip` Deploy über `azure/webapps-deploy@v3`.

## Checks
- Login/CORS: kein `localhost` in Prod‑ENV.
- `/health` reachable; Logs sichtbar (ELK), Metriken (Prometheus/Grafana).