# 📦 Log- und Monitoring-Komponenten

## 📄 Elasticsearch

- Beschreibung: Volltext-Suchmaschine und Speicher für strukturierte Logs.

- Rolle: Empfängt und speichert Logs, die von Logstash verarbeitet wurden.

- Port: 9200

- Besonderheiten:

- Single-Node-Modus (discovery.type=single-node)

- Sicherheit deaktiviert (xpack.security.enabled=false)

- Datenpersistenz über Volume esdata

## 📦 Logstash

- Beschreibung: Pipeline-Tool zur Verarbeitung und Weiterleitung von Logs.

- Rolle: Empfängt Logs vom Backend über TCP (Port 5000), transformiert sie und sendet sie an Elasticsearch.

- Konfiguration: Nutzt benutzerdefinierte Datei logstash.conf

- Port: 5000

## 📊 Kibana

- Beschreibung: Webinterface zur Visualisierung und Analyse von Logs aus Elasticsearch.

- Rolle: Ermöglicht Suche, Filterung und Dashboard-Erstellung für Logs.

- Port: 5601

- Verbindung: Greift auf Elasticsearch unter http://elasticsearch:9200 zu

- 📈 Monitoring-Komponenten
- 📈 Prometheus
- Beschreibung: Zeitreihenbasierter Monitoring-Dienst.

- Rolle: Sammelt Metriken von verschiedenen Services (z. B. Node Exporter).

- Port: 9090

- Konfiguration: Nutzt Datei prometheus.yml zur Definition von Targets

## 📉 Grafana

- Beschreibung: Visualisierungsplattform für Metriken.

- Rolle: Stellt Dashboards dar, basierend auf Daten aus Prometheus.

- Port: 3300 (intern 3000)

- Abhängigkeit: Startet nach Prometheus (depends_on: prometheus)

## 🖥️ Node Exporter

- Beschreibung: Exportiert Systemmetriken des Hosts (CPU, RAM, Disk, Netzwerk).

- Rolle: Wird von Prometheus abgefragt zur Überwachung der Infrastruktur.

- Port: 9100