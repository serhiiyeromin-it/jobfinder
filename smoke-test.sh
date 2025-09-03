#!/bin/bash

echo "🚀 Überprüfung der Erreichbarkeit des Backend-Services..."

# Warten, bis der Container gestartet ist (Timeout kann angepasst werden)
for i in {1..10}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3050/health)
  if [ "$STATUS" -eq 200 ]; then
    echo "✅ Backend läuft! Status: $STATUS"
    exit 0
  else
    echo "⏳ Versuch $i: Backend ist noch nicht bereit (Status: $STATUS)"
    sleep 5
  fi
done

echo "❌ Backend antwortet nach 10 Versuchen nicht. Smoke-Test fehlgeschlagen."
exit 1
