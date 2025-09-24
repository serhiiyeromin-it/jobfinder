# Contributing Guidelines

Vielen Dank für dein Interesse an **Project Night Crawler**.  
Bitte halte dich an die folgenden Konventionen, damit das Repository konsistent und wartbar bleibt.

---

## Repository-Strategie

Wir verwenden **GitHub Flow**:

1. **Branch `main`**
   - Immer deploy-bereit
   - Änderungen nur über Pull Requests (PRs)

2. **Feature-Branches**
   - Kurzlebig (idealerweise < 1–2 Tage)
   - Namensschema: `feature/...`, `bugfix/...`, `chore/...`
     - Beispiele: `feature/login-form`, `bugfix/timeout-error`

3. **Commit Messages**
   - Format: `type(scope): beschreibung` (Conventional Commits)
   - Beispiel: `feat(backend): add health endpoint`
   - Typen:
     - `feat` – neues Feature
     - `fix` – Bugfix
     - `chore` – Wartungsaufgaben
     - `docs` – Dokumentation
     - `refactor` – Codeänderung ohne Funktionsänderung
     - `test` – Tests hinzufügen oder anpassen

4. **Labels & Milestones**
   - GitHub Issues mit Labels wie `bug`, `enhancement`, `documentation`
   - Meilensteine strukturieren Releases

5. **Pull Requests**
   - Mindestens ein Reviewer erforderlich
   - Automatisierte Checks (Lint, Tests, Build, Security) müssen erfolgreich sein
   - Nutze das [PR-Template](./.github/PULL_REQUEST_TEMPLATE.md)

---

## Code Style

- **Backend**:
  - Python 3.11
  - Linting mit `flake8`, Formatierung mit `black`
  - Unit Tests mit `pytest`

- **Frontend**:
  - React + Vite
  - Linting mit `eslint`, Formatierung mit `prettier`
  - Tests (Jest/React Testing Library, sobald vorhanden)

Vor jedem Commit bitte Linter & Tests lokal ausführen.

---

## Tests

**Backend:**

```bash
cd backend
pytest --cov=backend
```

**Frontend:**

```bash
cd frontend
npm test
```

---

## CI/CD

GitHub Actions prüft bei jedem PR:

- ✅ Linting (Backend & Frontend)  
- ✅ Unit Tests (Backend)  
- ✅ Markdown-Lint  
- ✅ Docker Build & Smoke Tests  
- ✅ Security Scan (Trivy, CodeQL)

Diese Checks sind **required** für einen Merge in `main`.

---

## Umgang mit Secrets

- Keine echten Zugangsdaten committen.  
- Lokal: `.env` (siehe `.env.example`).  
- GitHub Actions: **Secrets**.  
- Azure App Service: **App Settings**.  

Wichtige Variablen:

- `MONGO_URI`
- `BAA_API_KEY`
- `MAIL_*`
- `JWT_SECRET`
- `LOGSTASH_*`

---

## Deployment

### Azure App Service (CI/CD)

- Eigenes App Service für **Backend** und **Frontend**
- Deploy über GitHub Actions (`backend-deploy.yml`, `frontend-deploy.yml`)
- Secrets:
  - `AZUREAPPSERVICE_PUBLISHPROFILE_BACKEND`
  - `AZUREAPPSERVICE_PUBLISHPROFILE_FRONTEND`
- Konfiguration über **App Settings** (statt `.env`)

### Docker Compose (lokal)

```bash
docker compose up -d
```

- Backend: http://localhost:3050
- Frontend: http://localhost:5173

### Kubernetes (optional)

```bash
kubectl apply -f all-in-one.yaml
kubectl delete all --all -n nightcrawler
```

---

## Backups

- MongoDB Backup via `backup-mongo.ps1`
- Automatischer Workflow: `mongo-backup.yml` (02:00 Uhr), Artefakte 7 Tage aufbewahrt

---

## Fragen & Feedback

Wenn du dir unsicher bist:

- Stelle deine Frage in einem **GitHub Issue**
- Oder markiere den Pull Request als **Draft**, bis alles geklärt ist
