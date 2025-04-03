from flask import Flask, request, jsonify
from flask_cors import CORS
from crawl_stepstone import crawl_stepstone
from mongodb_connect import collection

app = Flask(__name__) # Erstellt eine Flask-Instanz, damit wir die Flask-Funktionen nutzen können
CORS(app) # Erlaubt Cross-Origin-Requests, das sind Anfragen von einer anderen Domain

@app.route('/jobsuchen', methods=['GET', 'POST']) # Definiert die Route und die erlaubten Methoden
def jobsuchen():
    if request.method == 'POST': # Wenn die Methode POST ist, dann wird ein neuer Task hinzugefügt

        data = request.json
        keywords = data.get('keywords', [])
        location = data.get('location', '')
        radius = int(data.get('radius', '30'))

        print("Scraping gestartet mit:", keywords, location, radius)
        jobs = crawl_stepstone(keywords, location, radius)

        print("Jobs nach dem Scraping:")
        for job in jobs:
            print(job)
        cleaned_jobs = []
        
        for job in jobs:
            cleaned_jobs = {
                'title': job.get('title', 'Kein Titel verfügbar'),
                'company': job.get('company', 'Keine Firma angegeben'),
                'link': job.get('link', '#')
            }
            cleaned_jobs.append(cleaned_job)
            collection.insert_one(cleaned_job)
        print(f"{len(cleaned_jobs)} Jobs in MongoDB gespeichert.")
        return jsonify(cleaned_jobs)
    
    elif request.method == 'GET':

        jobs = list(collection.find({}, {'_id': 0, 'title': 1, 'company': 1, 'link': 1}))

        print(f"{len(jobs)} Jobs aus MongoDB abgerufen.")
        return jsonify(jobs)

if __name__ == '__main__': # Startet die Flask-App
    app.run(host='0.0.0.0', port=3050) # Startet die App auf dem Host