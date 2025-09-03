#!/bin/bash

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_DIR="./backups/mongo-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

docker exec nightcrawler-mongo mongodump --out /data/db/dump
docker cp nightcrawler-mongo:/data/db/dump "$BACKUP_DIR"

echo "✅ Backup abgeschlossen: $BACKUP_DIR"

