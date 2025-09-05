from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv
from mongodb_connect import (
    collection,
    search_alerts_collection,
    search_results_collection,
)
from bson.objectid import ObjectId
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, UTC
from crawler_api_baa import crawl_arbeitsagentur
import logging
from logstash_formatter import LogstashFormatterV1
from logging.handlers import SocketHandler
from prometheus_flask_exporter import PrometheusMetrics


load_dotenv()  # Lädt die Umgebungsvariablen aus der .env-Datei

# Logger-Konfiguration für Logstash

logger = logging.getLogger("nightcrawler-backend")
logger.setLevel(logging.INFO)

handler = SocketHandler("logstash", 5000)  # Name des Logstash-Containers in Docker
handler.setFormatter(LogstashFormatterV1())
logger.addHandler(handler)

logger.info("Flask backend gestartet — Logstash-Logging aktiviert")


app = Flask(__name__)  # Erstellt eine Flask-Instanz
CORS(app)  # Erlaubt Cross-Origin-Requests
metrics = PrometheusMetrics(app)  # Initialisiert Prometheus-Metriken

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

# Flask-Mail initialisieren
mail = Mail(app)

try:
    search_results_collection.create_index(
        [("search_alert_id", 1), ("link", 1)],
        unique=True,
        name="uniq_alert_link"
    )
except Exception:
    pass

def send_email(to_email, subject, body):
    try:
        with app.app_context():
            msg = Message(subject, recipients=[to_email], body=body)
            mail.send(msg)
            print(f"Email erfolgreich gesendet an {to_email}.")
    except Exception as e:
        print(f"Fehler beim Senden der Email: {e}")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/jobsuchen', methods=['GET', 'POST'])
def jobsuchen():
    if request.method == 'POST':
        data = request.json
        keywords = data.get('keywords', [])
        location = data.get('location', '')
        radius = int(data.get('radius', '30'))

        print("Scraping gestartet mit:", keywords, location, radius)
        new_jobs_stepstone = []
        new_jobs_arbeitsagentur = crawl_arbeitsagentur(keywords, location, radius)
        new_jobs = new_jobs_stepstone + new_jobs_arbeitsagentur

        for job in new_jobs:
            job['bookmark'] = False

        collection.delete_many({"bookmark": False})
        print("Alle alten Jobs in der Datenbank gelöscht.")

        bookmarked_jobs = [
            {**job, '_id': str(job['_id'])}
            for job in collection.find({"bookmark": True})
        ]

        unique_jobs = []
        for new_job in new_jobs:
            if not any(
                bookmarked_job['title'] == new_job['title'] and
                bookmarked_job['company'] == new_job['company'] and
                bookmarked_job['link'] == new_job['link']
                for bookmarked_job in bookmarked_jobs
            ):
                if collection.count_documents(
                    {"_id": new_job.get('_id')}, limit=1
                ) == 0:
                    result = collection.insert_one(new_job)
                    new_job['_id'] = str(result.inserted_id)
                    unique_jobs.append(new_job)
                    print(
                        f"Neuer Job eingefügt: {new_job['title']} bei "
                        f"{new_job['company']}"
                    )

        print(f"{len(unique_jobs)} Jobs in MongoDB gespeichert.")
        return jsonify(unique_jobs)

    elif request.method == 'GET':
        jobs = [
            {**job, '_id': str(job['_id'])}
            for job in collection.find(
                {"bookmark": False},
                {'title': 1, 'company': 1, 'link': 1, 'bookmark': 1, '_id': 1}
            )
        ]
        print(f"{len(jobs)} Jobs aus MongoDB abgerufen.")
        return jsonify(jobs)


@app.route('/jobsuchen_baa', methods=['POST'])
def jobsuchen_baa():
    if request.method == 'POST':
        data = request.json
        keywords = data.get('keywords', [])
        location = data.get('location', '')
        radius = int(data.get('radius', 30))

        print(
            f"Starte Arbeitsagentur-Crawl mit: {keywords}, {location}, "
            f"{radius}km"
        )

        new_jobs = crawl_arbeitsagentur(keywords, location, radius, collection)

        return jsonify(new_jobs)


@app.route('/update_bookmark', methods=['POST'])
def update_bookmark():
    data = request.json
    job_id = data.get('_id')
    bookmark_status = data.get('bookmark')

    if not job_id or bookmark_status is None:
        return jsonify({
            'error': 'Job-ID und Bookmark-Status müssen angegeben werden.'
        }), 400

    if ObjectId.is_valid(job_id):
        query = {'_id': ObjectId(job_id)}
    else:
        query = {'_id': job_id}

    result = collection.update_one(query, {'$set': {'bookmark': bookmark_status}})

    if result.matched_count != 1:
        return jsonify({'error': 'Job nicht gefunden.'}), 404

    return jsonify({'success': True})


@app.route('/bookmarked_jobs', methods=['GET'])
def get_bookmarked_jobs():
    jobs = list(
        collection.find(
            {"bookmark": True},
            {'title': 1, 'company': 1, 'link': 1, 'bookmark': 1}
        )
    )
    for job in jobs:
        job['_id'] = str(job['_id'])
    print(f"{len(jobs)} bookmarked Jobs aus MongoDB abgerufen.")
    return jsonify(jobs)


@app.route('/update_search_alert/<string:id>', methods=['POST'])
def update_search_alert(id):
    data = request.json
    updated_data = {
        "keywords": data.get('keywords', []),
        "location": data.get('location', ''),
        "radius": int(data.get('radius', 30)),
        "email": data.get('email', '')
    }

    result = search_alerts_collection.update_one(
        {'_id': ObjectId(id)},
        {'$set': updated_data}
    )
    if result.modified_count == 1:
        return jsonify({
            'success': True, 'message': 'Suchauftrag erfolgreich aktualisiert.'
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Suchauftrag nicht gefunden oder keine Änderungen vorgenommen.'
        }), 404


@app.route('/save_search', methods=['POST'])
def save_search():
    data = request.json
    keywords = data.get('keywords', [])
    location = data.get('location', '')
    radius = int(data.get('radius', '30'))
    email = data.get('email', '')

    search_alerts_data = {
        "keywords": keywords,
        "location": location,
        "radius": radius,
        "email": email
    }
    result = search_alerts_collection.insert_one(search_alerts_data)
    search_alerts_data['_id'] = str(result.inserted_id)
    # optional: direkt initiale Ergebnisse holen & speichern
    try:
        execute_search_alerts()  # verarbeitet alle Alerts; minimal & genügt hier
    except Exception as e:
        print("Initialer Autoscan nach save_search fehlgeschlagen:", e)
    return jsonify({'success': True, 'search_alert': search_alerts_data})


@app.route('/search_alerts', methods=['GET'])
def get_search_alerts():
    search_alerts = list(
        search_alerts_collection.find(
            {},
            {'keywords': 1, 'location': 1, 'radius': 1, 'email': 1}
        )
    )
    for alert in search_alerts:
        alert['_id'] = str(alert['_id'])

    return jsonify(search_alerts)


@app.route('/delete_search_alert/<string:id>', methods=['DELETE'])
def delete_search_alert(id):
    result = search_alerts_collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 1:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Suchauftrag nicht gefunden'}), 404

scheduler = BackgroundScheduler()

def execute_search_alerts():
    # Job bekommt einen eigenen App-Kontext (z. B. wenn via Thread/Timer aufgerufen)
    with app.app_context():
        alerts = list(search_alerts_collection.find())
        print(f"[{datetime.now(UTC)}] Ausführung der gespeicherten Suchaufträge gestartet.")

        for alert in alerts:
            keywords = alert.get('keywords', [])
            location = alert.get('location', '')
            radius = int(alert.get('radius', 30))
            email = alert.get('email', '')

# --- Arbeitsagentur-Call (keine Normalisierung) ---
            try:
                # 4. Parameter explizit auf None -> Crawler speichert NICHT in 'collection'
                raw_jobs = crawl_arbeitsagentur(keywords, location, radius, None) or []
            except Exception as e:
                print(f"BAA-Crawl fehlgeschlagen für Alert {alert['_id']}: {e}")
                continue

            # Felder 1:1 übernehmen, nur Zuordnung + Timestamp setzen
            for j in raw_jobs:
                j['search_alert_id'] = str(alert['_id'])
                j['timestamp'] = datetime.now(UTC)

            # Dedupe pro Alert – genau wie bei dir, nur mit get() falls 'link' fehlt
            existing_links = {
                d.get('link') for d in search_results_collection.find(
                    {'search_alert_id': str(alert['_id'])},
                    {'link': 1, '_id': 0}
                )
            }
            seen = set()
            unique_jobs = []
            for j in raw_jobs:
                lnk = (j.get('link') or "").strip()
                if not lnk:
                    continue  # leere Links nicht speichern (sonst knallt der Unique-Index)
                if lnk in existing_links or lnk in seen:
                    continue
                seen.add(lnk)
                unique_jobs.append(j)

            if unique_jobs:
                try:
                    search_results_collection.insert_many(unique_jobs, ordered=False)
                    print(f"{len(unique_jobs)} neue Ergebnisse für Suchauftrag {alert['_id']} gespeichert.")
                    # --- E-Mail-Benachrichtigung ---
                    if email:
                        try:
                            subject = f"[Night Crawler] {len(unique_jobs)} neue Jobs für deinen Alert"
                            # knapper Plaintext-Body: Titel – Firma – Quelle – Link (max 10 Zeilen)
                            lines = []
                            for j in unique_jobs[:10]:
                                title = j.get('title') or ''
                                company = j.get('company') or ''
                                source = j.get('source') or ''
                                link = j.get('link') or ''
                                lines.append(f"- {title} bei {company} ({source})\n  {link}")
                            more = len(unique_jobs) - len(lines)
                            if more > 0:
                                lines.append(f"... und {more} weitere. Öffne die App für alle Ergebnisse.")
                            body = (
                                f"Hallo,\n\n"
                                f"es gibt {len(unique_jobs)} neue Ergebnisse für deinen Suchauftrag:\n"
                                f"Keywords: {', '.join(keywords) or '-'} | Ort: {location or '-'} | Radius: {radius} km\n\n"
                                + "\n".join(lines) + "\n\n"
                                "— Dein Project Night Crawler"
                            )
                            send_email(email, subject, body)
                        except Exception as e:
                            print(f"E-Mail-Versand fehlgeschlagen für Alert {alert['_id']}: {e}")
                except Exception as e:
                    print(f"insert_many fehlgeschlagen für Alert {alert['_id']}: {e}")
            else:
                print(f"0 neue Ergebnisse für Suchauftrag {alert['_id']} (evtl. alles schon vorhanden).")

scheduler.add_job(execute_search_alerts, 'interval', minutes=3)
scheduler.start()


@app.route('/get_search_results/<string:alert_id>', methods=['GET'])
def get_search_results(alert_id):
    results = list(
        search_results_collection.find({"search_alert_id": alert_id})
    )
    for result in results:
        result['_id'] = str(result['_id'])
    return jsonify(results)


if __name__ == '__main__':  # Startet die Flask-App
    app.run(host='0.0.0.0', port=3050)

