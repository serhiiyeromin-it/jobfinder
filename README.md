# Project Night Crawler

Ein **Full‑Stack Job‑Crawler** mit React/Vite Frontend, Flask‑Backend und MongoDB.
Ziel: automatisierte Suche und Verwaltung von Stellenanzeigen (u. a. über die Jobbörse der Bundesagentur für Arbeit), inkl. Such‑Alerts, Lesezeichen und E‑Mail‑Benachrichtigungen.

> **Kurzfassung**: React UI → Flask API → MongoDB. CI via GitHub Actions. Deploy per Docker Compose oder Kubernetes.

---

## Inhaltsverzeichnis

- [Project Night Crawler](#project-night-crawler)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Architektur](#architektur)
  - [Tech‑Stack](#techstack)
  - [Schnellstart](#schnellstart)
    - [Variante A: Docker Compose](#variante-a-docker-compose)
    - [Variante B: Lokal (Dev)](#variante-b-lokal-dev)
  - [Konfiguration \& Umgebungsvariablen](#konfiguration--umgebungsvariablen)
  - [API‑Referenz (Backend)](#apireferenz-backend)
  - [CI/CD](#cicd)
  - [Deployment](#deployment)
    - [Docker Images](#docker-images)
    - [Docker Compose](#docker-compose)
    - [Kubernetes (optional)](#kubernetes-optional)
  - [Projektstruktur](#projektstruktur)
  - [FAQ](#faq)
  - [Troubleshooting](#troubleshooting)
  - [Roadmap](#roadmap)
  - [Lizenz](#lizenz)

---

## Architektur

```text
[Browser]
   │
   ▼
React (Vite)  ───▶  Flask API  ───▶  MongoDB
  (Frontend)        (Backend)        (Datenbank)
        ▲                 │
        └──── E‑Mail (optional, Flask‑Mail) 
```

- **Frontend**: Single‑Page‑App in React/Vite, kommuniziert über `VITE_API_URL` mit dem Backend
- **Backend**: Flask‑API, Crawler-Logik (z. B. BAA‑API), Scheduling (APScheduler), Mails (Flask‑Mail)
- **Datenhaltung**: MongoDB (Sammlungen für Such‑Alerts, Suchergebnisse, Bookmarks)
- **Automatisierung**: GitHub Actions für Linting, Tests, Docker‑Builds
- **Container/Orchestrierung**: Docker‑Images + `docker-compose.yml`; K8s‑Manifeste in `all-in-one.yaml`

---

## Tech‑Stack

| Ebene        | Technologie(n) |
|--------------|-----------------|
| **Frontend** | React, Vite, React Router, ESLint, Prettier |
| **Backend**  | Python 3.11, Flask, Flask‑CORS, Flask‑Mail, APScheduler, Requests, BeautifulSoup, `python-dotenv` |
| **Datenbank**| MongoDB (`pymongo`) |
| **CI/CD**    | GitHub Actions (Lint, Tests, Docker CI) |
| **Container**| Docker, Docker Compose; optional Kubernetes (Namespace, Deployments, Services, Secrets) |

---

## Schnellstart

### Variante A: Docker Compose

Voraussetzungen: **Docker** & **Docker Compose** installiert.

1. **.env** (im Projekt‑Root) anlegen:

   ```env
   MONGO_URI=mongodb://localhost:27017/nightcrawler
   BAA_API_KEY=jobboerse-jobsuche
   MAIL_SERVER=smtp.example.com
   MAIL_PORT=587
   MAIL_USERNAME=example@example.com
   MAIL_PASSWORD=supersecret
   ```

2. **Compose starten**:

   ```bash
   docker compose up -d
   ```

3. **Öffnen**: Frontend unter http://localhost:5173  
   (Backend lauscht auf http://localhost:3050)

> Hinweis: Das Compose‑File verwendet die Images `mrrobob/nightcrawler-frontend` und `mrrobob/nightcrawler-backend` und verbindet die Services über das interne Netzwerk `appnet`.

### Variante B: Lokal (Dev)

**Backend** (Python 3.11):  

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export MONGO_URI="mongodb://localhost:27017/nightcrawler"
export BAA_API_KEY="jobboerse-jobsuche"
# optional Mail:
export MAIL_SERVER="smtp.example.com"
export MAIL_PORT="587"
export MAIL_USERNAME="example@example.com"
export MAIL_PASSWORD="supersecret"

python server.py
# → läuft standardmäßig auf http://127.0.0.1:5000 (oder laut server.py-Konfiguration)
```

**Frontend** (Node 18+ empfohlen):  

```bash
cd frontend
npm install
# API‑URL konfigurieren
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm run dev
# → http://localhost:5173
```

---

## Konfiguration & Umgebungsvariablen

**Backend (.env oder ENV):**

- `MONGO_URI` – MongoDB‑Verbindungsstring
- `BAA_API_KEY` – API‑Key für Jobbörse‑Anfragen
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` – für optionale E‑Mails

**Frontend (.env.local):**

- `VITE_API_URL` – Basis‑URL zum Backend (z. B. `http://localhost:5000` oder `http://backend:3050` im Compose)

> Beispiel‑Datei: `.env.example` im Projekt‑Root.

---

## API‑Referenz (Backend)

| Route | Methoden | Beschreibung |
|------:|:--------:|--------------|
| `/health` | GET | Gesundheitscheck (zum Monitoring/CI) |
| `/jobsuchen` | GET, POST | Allgemeine Jobsuche (Parameter im Body/Query) |
| `/jobsuchen_baa` | POST | Jobsuche über BAA‑API (Keywords, Ort, Radius) |
| `/bookmarked_jobs` | GET | Liste aller gespeicherten Bookmarks |
| `/update_bookmark` | POST | Bookmark anlegen/aktualisieren |
| `/save_search` | POST | Such‑Alert anlegen |
| `/search_alerts` | GET | Alle Such‑Alerts abrufen |
| `/update_search_alert/<id>` | POST | Such‑Alert aktualisieren |
| `/delete_search_alert/<id>` | DELETE | Such‑Alert löschen |
| `/get_search_results/<alert_id>` | GET | Ergebnisse zu einem Alert abrufen |

> Details und Felder siehe `backend/server.py`. Datenmodell in `backend/mongodb_connect.py`.

---

## CI/CD

GitHub Actions Workflows (Auszug):

- **backend-unit-test.yml** – `pytest` mit Coverage (Schwelle z. B. 70%)
- **backend-lint-fix.yml** – `flake8`/`black`
- **frontend-lint-fix.yml** – ESLint/Prettier
- **markdown-lint-fix.yml** – Markdown Lint mit Auto‑Fix
- **docker-ci.yml** – Docker Build/Push

Empfehlung: Diese Workflows unter **Branch Protection** als „required checks“ setzen.

---

## Deployment

### Docker Images

- `mrrobob/nightcrawler-backend`
- `mrrobob/nightcrawler-frontend`

### Docker Compose

Siehe `docker-compose.yml` (Ports `3050` Backend, `5173` Frontend).

### Kubernetes (optional)

Im Repo: `all-in-one.yaml` mit Namespace, Secrets, Deployments und Services für MongoDB, Backend & Frontend.  
Beispiele:

   ```bash
   npm run dev
   ```

   Die Anwendung ist anschließend unter `http://localhost:5173` erreichbar.

---

## Repository-Strategie

### GitHub Flow

1. **`main`**
   - Immer deploy-bereit
   - Änderungen nur über Pull Requests (PRs)

2. **Feature-Branches**
   - Kurzlebig (idealerweise < 1–2 Tage)
   - Namensschema: `feature/...`, `bugfix/...`, `chore/...`
     - Beispiele: `feature/login-form`, `bugfix/timeout-error`

3. **Commit Messages**
   - Format: `type(scope): beschreibung`
     - Beispiel: `feat(backend): add health endpoint`

4. **Labels & Milestones**
   - GitHub Issues mit Labels wie `bug`, `enhancement`
   - Meilensteine strukturieren Releases

5. **Pull Requests**
   - Mindestens ein Reviewer erforderlich
   - Automatisierte Checks müssen erfolgreich sein

6. **Deployment**
   - Jeder Merge in `main` triggert CI/CD → automatisiertes Deployment

## kubectl delete all --all -n nightcrawler / Kubernetes Cleanup
## kubectl apply -f all-in-one.yaml / Deployment