#!/bin/bash
set -e

# 📅 Zeitstempel für den Backup-Ordner (z. B. 2025-09-04_14-30)
ZEITSTEMPEL=$(date +"%Y-%m-%d_%H-%M" | tr -d '\r\n')
SICHERUNGSPFAD="./backups/mongo-$ZEITSTEMPEL"

# 📁 Lokalen Backup-Ordner erstellen (falls nicht vorhanden)
mkdir -p "$SICHERUNGSPFAD"

# 🔍 Prüfen, ob der MongoDB-Container läuft
if ! docker ps | grep -q nightcrawler-mongo; then
  echo "❌ Der Container 'nightcrawler-mongo' läuft nicht. Backup nicht möglich."
  exit 1
fi

# 🧪 Prüfen, ob das Tool 'mongodump' im Container verfügbar ist
if ! docker exec nightcrawler-mongo which mongodump > /dev/null; then
  echo "❌ 'mongodump' ist im Container nicht verfügbar. Bitte überprüfe das verwendete MongoDB-Image."
  exit 1
fi

# 📤 Backup im Container erstellen – in /dump (kein Volume, sondern temporärer Ordner)
echo "📤 Erstelle MongoDB-Dump im Container..."
docker exec nightcrawler-mongo sh -c "rm -rf /dump && mkdir -p /dump && mongodump --out /dump"

# 📥 Dump aus dem Container ins lokale Backup-Verzeichnis kopieren
echo "📥 Kopiere Dump nach $SICHERUNGSPFAD..."
docker cp nightcrawler-mongo:/dump "$SICHERUNGSPFAD"

# ✅ Erfolgsmeldung
echo "✅ Backup erfolgreich abgeschlossen: $SICHERUNGSPFAD"

