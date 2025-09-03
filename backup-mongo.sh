#!/bin/bash
set -e

# 📅 Zeitstempel ohne Sonderzeichen
ZEITSTEMPEL=$(date +"%Y-%m-%d_%H-%M" | tr -d '\r\n')
SICHERUNGSPFAD="./backups/mongo-$ZEITSTEMPEL"

# 📁 Sicherungsordner erstellen
mkdir -p "$SICHERUNGSPFAD"

# 🔍 Prüfen, ob der Container läuft
if ! docker ps | grep -q nightcrawler-mongo; then
  echo "❌ Der Container 'nightcrawler-mongo' läuft nicht. Sicherung nicht möglich."
  exit 1
fi

# 🧪 Prüfen, ob mongodump verfügbar ist
if ! docker exec nightcrawler-mongo which mongodump > /dev/null; then
  echo "❌ 'mongodump' ist im Container nicht verfügbar. Bitte überprüfe das MongoDB-Image."
  exit 1
fi

# 📤 Datenbank-Dump erstellen
echo "📤 Erstelle MongoDB-Dump..."
docker exec nightcrawler-mongo mongodump --out /data/db/dump

# 📥 Dump aus dem Container kopieren
echo "📥 Kopiere Dump nach $SICHERUNGSPFAD..."
docker cp nightcrawler-mongo:/data/db/dump "$SICHERUNGSPFAD"

# ✅ Erfolgsmeldung
echo "✅ Sicherung abgeschlossen: $SICHERUNGSPFAD"
