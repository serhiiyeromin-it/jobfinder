# 🛠️ Night Crawler – Backend

Flask‑API mit MongoDB‑Anbindung, Crawler‑Logik (z. B. BAA‑API), APScheduler und optionaler E‑Mail‑Benachrichtigung.

## Voraussetzungen

- Python **3.11**
- MongoDB (lokal/remote)
- `pip`, virtuelle Umgebung empfohlen

## Installation & Start (Lokal)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

export MONGO_URI="mongodb://localhost:27017/nightcrawler"
export BAA_API_KEY="jobboerse-jobsuche"

# optional für E‑Mail
export MAIL_SERVER="smtp.example.com"
export MAIL_PORT="587"
export MAIL_USERNAME="example@example.com"
export MAIL_PASSWORD="supersecret"

python server.py
# → http://127.0.0.1:5000
```

## Wichtige Dateien

- `server.py` – Flask‑App, Routen, Scheduling, E‑Mail
- `crawler_api_baa.py` – Anbindung an BAA‑API
- `mongodb_connect.py` – Mongo‑Connection und Collections
- `requirements.txt` – Python‑Dependencies
- `tests/` – Pytest‑Suiten (u. a. Verbindungs‑ und CRUD‑Tests)

## API (Auszug)

- `GET /health` – Healthcheck
- `GET|POST /jobsuchen` – allgemeine Suche
- `POST /jobsuchen_baa` – BAA‑Suche
- `GET /bookmarked_jobs` – Bookmarks abrufen
- `POST /update_bookmark` – Bookmark anlegen/ändern
- `POST /save_search` – Alert speichern
- `GET /search_alerts` – Alerts anzeigen
- `POST /update_search_alert/<id>` – Alert aktualisieren
- `DELETE /delete_search_alert/<id>` – Alert löschen
- `GET /get_search_results/<alert_id>` – Ergebnisse zu einem Alert

## Tests

```bash
pytest --cov=backend --cov-report=term-missing
```

## Docker

Das Backend‑Image ist als `mrrobob/nightcrawler-backend` verfügbar und wird von CI gebaut.
Im Compose ist der Service unter Port **3050** erreichbar.

## Tipps

- Indizes auf Collections prüfen (Duplikatvermeidung)
- Logging aktivieren (Requests/Antworten, Crawling‑Jobs)
- `.env` via `python-dotenv` laden, sensibel mit Secrets umgehen
