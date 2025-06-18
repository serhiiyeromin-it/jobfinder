import requests
import os
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


def crawl_arbeitsagentur(keywords, location, radius):
    """Crawler für die Arbeitsagentur-API"""
    query = {
        "was": " ".join(keywords),     # Jobtitel oder Suchbegriffe
        "wo": location,               # Ort
        "umkreis": radius,            # Umkreis in km
        "page": 1,                    # Startseite
        "size": 50                    # Anzahl Jobs pro Seite
    }

    try:
        response = requests.get(API_URL, headers=HEADERS, params=query, timeout=30)
        response.raise_for_status()
        data = response.json()

        new_jobs = []
        for job in data.get("stellenangebote", []):
            job_entry = {
                "id": job.get("hashId", ""), # Eindeutige Job-ID
                "title": job.get("beruf", "") or "",
                "company": job.get("arbeitgeber", "") or "",
                "location": job.get("arbeitsort", "") or "",
                "link": job.get("stellenangebotURL", "") or "",
                "source": "Arbeitsagentur"
            }
            
            # In die Datenbank einfügen
            new_jobs.append(job_entry)

        print(f"{len(new_jobs)} Jobs von der Arbeitsagentur gespeichert.")
        return new_jobs

    except Exception as e: # Fehlerbehandlung
        if response.status_code == 403:
            print("❌ Zugriff verweigert. Bitte überprüfe deinen API-Schlüssel.")
        print(f"Fehler beim Abrufen der API-Daten: {e}")
        return []  # Leere Liste bei Fehlern zurückgeben
