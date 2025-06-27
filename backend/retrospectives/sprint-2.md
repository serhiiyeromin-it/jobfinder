# 🌀 Sprint 2 – Retrospektive (Project-Night-Crawler2)

## 🏁 Ziel des Sprints
Das Ziel war es, den bereits bestehenden StepStone-Scraper zu verbessern, um zuverlässiger Stellenangebote zu erfassen, gleichzeitig neue Features (z. B. E-Mail-Benachrichtigung, Automatisierung, Dockerisierung) auszubauen und das Projekt stabiler zu machen.

## ✅ Was lief gut?

- ✅ **Umstieg auf die API der Bundesagentur für Arbeit (BAA):**
  - Nach Blockade der StepStone-Seite konnten wir auf die kostenlose API der BAA umstellen.
  - Die API-Verbindung funktioniert, neue Jobs werden strukturiert gespeichert.

- ✅ **Teamarbeit & Kommunikation:**
  - Trotz kurzfristigem Teamwechsel gute Einarbeitung des neuen Mitglieds.
  - GitHub-Issues wurden gemeinsam gepflegt und regelmäßig besprochen.

- ✅ **Technische Fortschritte:**
  - Backend- und Frontend-Kommunikation funktioniert grundsätzlich stabil.
  - Jobdaten werden gespeichert und angezeigt.
  - Automatisierung über GitHub Actions wurde erfolgreich eingerichtet (E-Mail optional).

## 🧱 Was waren die Herausforderungen?

- ⚠️ **StepStone-Blockade:**
  - Plötzliche technische Sperre gegen das Scraping durch neue Sicherheitsmaßnahmen.
  - Unsere initiale Architektur musste neu gedacht werden.

- ⚠️ **API-Probleme & Rate-Limiting:**
  - Die BAA-API war mehrfach überlastet oder langsam (Timeouts bei größerer Keyword-Anzahl).
  - Anpassung durch `sleep()`-Delays und kleinere Anfragen nötig.

- ⚠️ **Jobbeschreibung (Detailtext) fehlt:**
  - Die API liefert keine vollständige Stellenbeschreibung.
  - Die angestrebte Detailansicht im Frontend bleibt leer – dies muss noch ergänzt werden.

- ⚠️ **Merge- und Repository-Konflikte:**
  - Mehrere Branches auf verschiedenen GitHub-Konten verursachten Zuordnungsprobleme.
  - Neue Issues mussten manuell verschoben oder kopiert werden.

## 🔧 Was wurde verbessert?

- 🔄 Einführung klarer GitHub-Issues mit Labels & Sprintstruktur.
- 🧪 Automatisierter Test der Initialisierung (README-Anpassung).
- 🧰 Refactor der `.env`-Struktur zur sicheren Konfiguration.
- 🚀 Erste Container-Vorbereitungen (Dockerfile-Konzept vorhanden).

## 📌 Was nehmen wir mit?

- **Frühzeitige API-Prüfung** bei externen Quellen spart später Zeit.
- **Detaillierte Readmes und Setup-Dokumentation** vermeiden Chaos bei der Projektübergabe.
- **GitHub als zentrale Planungs- und Kommunikationsplattform** weiterhin beibehalten.

## 🗓️ Nächste Schritte

- [ ] Detailseite im Frontend mit echter Beschreibung befüllen.
- [ ] BAA-API ggf. kombinieren mit anderen freien Quellen.
- [ ] Dockerisierung vollständig abschließen.
- [ ] E-Mail-Benachrichtigung für neue Ergebnisse finalisieren.
- [ ] Design & UX verbessern (Responsivität, leere Felder abfangen).
