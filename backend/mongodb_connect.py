import pymongo
from pymongo import MongoClient

# Deine MongoDB Atlas-Verbindungs-URI
uri = "mongodb+srv://mjschoger:hi1234@cluster0.fotipne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


# Verbindung herstellen
client = MongoClient(uri)

# Zugriff auf die Datenbank
db = client['job_database']  # 'job_database' ist der Name der Datenbank, die du erstellen möchtest.


# Beispiel: Zugriff auf eine Collection und Einfügen eines Dokuments
collection = db['jobs']  # Beispiel: Collection namens 'jobs'
job_data = {
    "title": "Python Developer",
    "company": "Example Company",
    "link": "https://example.com/job/python-developer",
    "bookmark": False
}

# Einfügen eines Dokuments
collection.insert_one(job_data)

print("Dokument erfolgreich eingefügt!")