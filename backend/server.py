from flask import Flask, request, jsonify
from flask_cors import CORS
from crawl_stepstone import crawl_stepstone

app = Flask(__name__) # Erstellt eine Flask-Instanz, damit wir die Flask-Funktionen nutzen können
CORS(app) # Erlaubt Cross-Origin-Requests, das sind Anfragen von einer anderen Domain

@app.route('/jobsuchen', methods=['POST']) # Definiert die Route und die erlaubten Methoden
def jobsuchen():
    if request.method == 'POST': # Wenn die Methode POST ist, dann wird ein neuer Task hinzugefügt

        data = request.json
        keywords = data.get('keywords', [])
        location = data.get('location', '')
        radius = int(data.get('radius', '30'))

        print("Scraping gestartet mit:", keywords, location, radius)
        jobs = crawl_stepstone(keywords, location, radius)

        print("Gefundene Jobs:", jobs)

        return jsonify(jobs)

if __name__ == '__main__': # Startet die Flask-App
    app.run(host='0.0.0.0', port=3050) # Startet die App auf dem Host