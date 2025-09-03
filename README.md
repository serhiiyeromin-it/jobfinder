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
kubectl apply -f all-in-one.yaml
kubectl delete all --all -n nightcrawler
```

---

## Projektstruktur

```
.
├── backend/                 # Flask-API, Crawler, Tests
│   ├── server.py
│   ├── requirements.txt
│   ├── mongodb_connect.py
│   ├── crawler_api_baa.py
│   └── tests/
├── frontend/                # React/Vite SPA
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── all-in-one.yaml          # Kubernetes Manifeste (Namespace, Secrets, Deployments, Services)
├── .github/workflows/       # CI/CD
├── .env.example
└── README.md
```

---

## FAQ

**Was crawlt der Night Crawler?**  
Aktuell u. a. die Jobbörse der **Bundesagentur für Arbeit** via API; Erweiterungen (z. B. StepStone) sind vorgesehen.

**Wo werden Daten gespeichert?**  
In **MongoDB** (Sammlungen für Alerts, Ergebnisse, Bookmarks; eindeutige Indizes zur Duplikatvermeidung).

**Wie bekomme ich E‑Mails?**  
Mail‑Server‑Daten in ENV setzen (`MAIL_*`). Das Backend nutzt Flask‑Mail.

**Kann ich die Suche zeitgesteuert laufen lassen?**  
Ja, über **APScheduler** (siehe Backend‑Code). Alternativ externe Cron/Workflows.

---

## Troubleshooting

- **Backend startet nicht / 5000 blockiert**  
  Prüfe, ob Port frei ist; ggf. `FLASK_RUN_PORT` oder Code‑Port ändern.

- **MongoDB‑Verbindung schlägt fehl**  
  `MONGO_URI` prüfen (Host/Port/Auth). Teste mit `mongosh`/`mongo` CLI.

- **CORS‑Fehler im Browser**  
  Stelle sicher, dass `Flask‑CORS` aktiviert ist und `VITE_API_URL` korrekt gesetzt ist.

- **Docker Compose: Frontend erreicht Backend nicht**  
  In Compose kommuniziert das Frontend mit `http://backend:3050`. Stelle sicher, dass `VITE_API_URL` entsprechend gesetzt ist (ENV oder Build‑Zeit).

- **BAA‑API liefert keine Ergebnisse**  
  `BAA_API_KEY` prüfen, Request‑Parameter (Keywords/Ort/Radius) validieren, Logging checken.

- **GitHub Actions: Required Checks fehlen**  
  Workflows müssen einmal laufen, damit sie unter **Settings → Branches → Protection Rules** auswählbar sind.

---

## Roadmap

- Mehr Datenquellen (StepStone reaktivieren, weitere Portale)
- User‑Accounts & persistente Einstellungen
- UI‑Verbesserungen (Filter, Paginierung, Export)
- Alert‑Scheduling im UI konfigurierbar
- Docker‑Builds für **multi‑arch** Images

---

## Lizenz

© {2025} – Roman Smirnov, Project Night Crawler. (PolyForm Noncommercial License 1.0.0)
