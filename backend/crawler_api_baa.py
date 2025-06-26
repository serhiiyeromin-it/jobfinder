import requests
import os
import uuid
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # .env-Datei laden

# MongoDB-Verbindung herstellen
client = MongoClient(os.getenv("MONGO_URI"))
db = client['job_database']
collection = db['jobs']

# Arbeitsagentur API-Konfiguration
API_URL = "https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs"
HEADERS = {
    "X-API-Key": os.getenv("BAA_API_KEY")  # Dein persönlicher API-Schlüssel
}


def crawl_arbeitsagentur(keywords, location, radius, collection=collection):
    # Crawler für die Arbeitsagentur-API

    if isinstance(keywords, str):
        keywords = [keywords]  # Sicherstellen, dass keywords eine Liste ist

    all_new_jobs = []  # Liste für alle neuen Jobs

    keywords = [kw.strip() for kw in keywords if kw.strip()]  # Leere Keywords entfernen
    if not keywords:
        keywords = [None]  # Wenn keine Keywords angegeben sind, setze auf None

    for keyword in keywords:
        params = {  # Suchparameter für die API
            "pav": "true",  # Vermittlung durch die Arbeitsagentur
            "angebotsart": "1",  # Angebotsart: 1 für Stellenangebote
            "size": 100,  # Anzahl der Ergebnisse pro Seite
            "veroeffentlichtseit": 60,  # Ergebnisse der letzten 30 Tage
            "was": keyword  # Suchbegriff, z.B. Jobtitel
        }
        if keyword is not None:
            params["was"] = keyword
        if location:
            params["wo"] = location  # Ort
        if radius:
            params["umkreis"] = radius  # Umkreis in km

        print(f"🔍 API Abfrage mit Parametern: {params}")

        try:
            response = requests.get(
                API_URL, headers=HEADERS, params=params, timeout=30
            )  # API-Anfrage senden
            response.raise_for_status()  # Fehler bei der Anfrage auslösen
            data = response.json()

            new_jobs = []
            if not data.get("stellenangebote"):
                print("Keine neuen Jobs gefunden.")
                return []
            for job in data.get("stellenangebote", []):
                job_entry = {
                    "_id": job.get("hashId", "") or str(uuid.uuid4()),
                    "title": job.get("beruf", "") or "",
                    "company": job.get("arbeitgeber", "") or "",
                    "location": job.get("arbeitsort", "") or "",
                    "link": job.get("stellenangebotURL", "") or "",
                    "source": "Arbeitsagentur",
                    "bookmark": False
                }

                # In die Datenbank einfügen
                new_jobs.append(job_entry)

            collection.insert_many(new_jobs)
            print(
                f"{len(new_jobs)} Jobs in MongoDB von der Arbeitsagentur gespeichert.")
            all_new_jobs.extend(new_jobs)

        except Exception as e:
            if response.status_code == 403:
                print("❌ Zugriff verweigert. Bitte überprüfe deinen API-Schlüssel.")
            print(f"Fehler beim Abrufen der API-Daten: {e}")
            continue
    return all_new_jobs
