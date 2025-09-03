# Projekt Night-Crawler – Frontend

Dieses Frontend wurde mit React und Vite entwickelt und bietet eine benutzerfreundliche Oberfläche zur Jobsuche und Verwaltung gespeicherter Stellenanzeigen.

## Verwendete Technologien und Bibliotheken

Das Projekt basiert auf modernen Webtechnologien und bewährten Bibliotheken, um eine performante und reaktive Nutzererfahrung zu gewährleisten.

### Hauptbibliotheken (Dependencies)

- **[React](https://react.dev/)**: Die zentrale Bibliothek zur Erstellung der Benutzeroberfläche. Komponenten wie `SearchForm`, `SearchAlerts` und `BookmarkedJobs` sind auf dem React-Komponentenmodell aufgebaut.
- **[React DOM](https://react.dev/reference/react-dom)**: Bindet React-Komponenten an das DOM und ermöglicht deren Darstellung im Browser sowie die Reaktion auf Benutzerinteraktionen.
- **[React Router DOM](https://reactrouter.com/)**: Implementiert clientseitiges Routing und erlaubt die Navigation zwischen verschiedenen Ansichten wie `/`, `/bookmarked` und `/search_alerts`, ohne dass die Seite neu geladen wird.

### Entwicklungswerkzeuge (Dev-Dependencies)

- **[Vite](https://vitejs.dev/)**: Ein modernes Build-Tool und Entwicklungsserver mit Hot-Module-Replacement (HMR) für schnelle Entwicklungszyklen und effizientes Production-Building.
- **[ESLint](https://eslint.org/)**: Statisches Codeanalyse-Tool zur frühzeitigen Erkennung von Fehlern und zur Sicherstellung konsistenter Codequalität.
- **[Prettier](https://prettier.io/)**: Automatisches Codeformatierungstool zur Durchsetzung einheitlicher Stilregeln.
- **[Markdownlint](https://github.com/DavidAnson/markdownlint)**: Linter für Markdown-Dateien zur Sicherstellung einheitlicher Struktur und Lesbarkeit.

---

## Starten des Frontends

1. In das `frontend`-Verzeichnis wechseln:

   ```bash
   cd frontend
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

   Die Anwendung ist anschließend unter `http://localhost:5173` erreichbar.

---

## Repository-Strategie

### GitHub Flow

1. **`main`**
   - Immer deploy-bereit
   - Änderungen nur über Pull Requests (PRs)

2. **Feature-Branches**
   - Kurzlebig (idealerweise < 1–2 Tage)
   - Namensschema: `feature/...`, `bugfix/...`, `chore/...`
     - Beispiele: `feature/login-form`, `bugfix/timeout-error`

3. **Commit Messages**
   - Format: `type(scope): beschreibung`
     - Beispiel: `feat(backend): add health endpoint`

4. **Labels & Milestones**
   - GitHub Issues mit Labels wie `bug`, `enhancement`
   - Meilensteine strukturieren Releases

5. **Pull Requests**
   - Mindestens ein Reviewer erforderlich
   - Automatisierte Checks müssen erfolgreich sein

6. **Deployment**
   - Jeder Merge in `main` triggert CI/CD → automatisiertes Deployment

## kubectl delete all --all -n nightcrawler / Kubernetes Cleanup
## kubectl apply -f all-in-one.yaml / Deployment
## ./backups/mongo-YYYY-MM-DD_HH-MM/ / Backups überprüfen
## ls ./backups/mongo-YYYY-MM-DD_HH-MM/dump
