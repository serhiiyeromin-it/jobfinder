from flask import Flask, request, jsonify
from flask_cors import CORS
from crawl_stepstone import crawl_stepstone
from mongodb_connect import collection
from bson.objectid import ObjectId

app = Flask(__name__) # Erstellt eine Flask-Instanz, damit wir die Flask-Funktionen nutzen können
CORS(app) # Erlaubt Cross-Origin-Requests, das sind Anfragen von einer anderen Domain

@app.route('/jobsuchen', methods=['GET', 'POST']) # Definiert die Route und die erlaubten Methoden
def jobsuchen():
    if request.method == 'POST':

        data = request.json # Holt die JSON-Daten aus der Anfrage
        keywords = data.get('keywords', []) # Holt die Keywords aus den Daten, Standard ist eine leere Liste
        location = data.get('location', '') # Holt den Standort aus den Daten, Standard ist ein leerer String
        radius = int(data.get('radius', '30')) # Holt den Radius aus den Daten, Standard ist 30 (in km)

        print("Scraping gestartet mit:", keywords, location, radius) 
        new_jobs = crawl_stepstone(keywords, location, radius) # Hier wird die Funktion zum Scrapen aufgerufen und die Jobs werden in der Variable jobs gespeichert

        for job in new_jobs:
            job['bookmark'] = False

        collection.delete_many({"bookmark": False}) # Löscht alle alten Jobs in der Datenbank, um Platz für neue zu schaffen
        print("Alle alten Jobs in der Datenbank gelöscht.")

        bookmarked_jobs = [ # Hier werden alle Jobs aus der Datenbank abgerufen, die als Bookmarks gespeichert sind
            {**job, '_id': str(job['_id'])} for job in collection.find({"bookmark": True})
        ] 

        unique_jobs = []
        for new_job in new_jobs: 
            if not any(
                bookmarked_job['title'] == new_job['title'] and
                bookmarked_job['company'] == new_job['company'] and
                bookmarked_job['link'] == new_job['link']
                for bookmarked_job in bookmarked_jobs
            ):
                result = collection.insert_one(new_job) # Hier wird jeder Job in die Datenbank eingefügt
                new_job['_id'] = str(result.inserted_id) # Hier wird die ID des eingefügten Jobs in das Job-Dictionary eingefügt
                unique_jobs.append(new_job)

        print(f"{len(unique_jobs)} Jobs in MongoDB gespeichert.")
        return jsonify(bookmarked_jobs + unique_jobs) # Gibt die Jobs als JSON zurück
    
    elif request.method == 'GET':

        jobs = [ # Hier werden alle Jobs aus der Datenbank abgerufen
            {**job, '_id': str(job['_id'])} for job in collection.find({}, {'title': 1, 'company': 1, 'link': 1, 'bookmark': 1})
        ]
        print(f"{len(jobs)} Jobs aus MongoDB abgerufen.")
        return jsonify(jobs) # Gibt die Jobs als JSON zurück

@app.route('/update_bookmark', methods=['POST'])
def update_bookmark():
    data = request.json
    job_id = data.get('_id')
    bookmark_status = data.get('bookmark')

    collection.update_one(
        {'_id': ObjectId(job_id)},
        {'$set': {'bookmark': bookmark_status}}
    )
    return jsonify({'success': True})

@app.route('/bookmarked_jobs', methods=['GET'])
def get_bookmarked_jobs():
    jobs = list(collection.find({"bookmark": True}, {'title': 1, 'company': 1, 'link': 1, 'bookmark': 1}))
    print(f"{len(jobs)} bookmarked Jobs aus MongoDB abgerufen.")
    return jsonify(jobs)


if __name__ == '__main__': # Startet die Flask-App
    app.run(host='0.0.0.0', port=3050) # Startet die App auf dem Host