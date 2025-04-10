import pymongo
from pymongo import MongoClient

# Deine MongoDB Atlas-Verbindungs-URI
uri = "mongodb+srv://romansmirnoff:1234@cluster0.fotipne.mongodb.net/"


# Verbindung herstellen
client = MongoClient(uri)

# Zugriff auf die Datenbank
db = client['job_database']  # 'job_database' ist der Name der Datenbank, die du erstellen möchtest.

# Zugriff auf die Sammlung (Collection)
collection = db['jobs']

# Zugriff auf die Sammlung für Suchaufträge
search_alerts_collection = db['search_alerts']

# Zugriff auf die Sammlung für Suchergebnisse
search_results_collection = db['search_results']