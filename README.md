# Projekt Night-Crawler – Frontend

Dieses Frontend wurde mit React und Vite erstellt und dient als Benutzeroberfläche für die Jobsuche und -verwaltung.

## Verwendete Technologien und Bibliotheken

Das Projekt stützt sich auf etablierte und moderne Bibliotheken, um eine reaktive und schnelle User Experience zu gewährleisten.

### Hauptbibliotheken (Dependencies)

*   **[React](https://react.dev/)**: Die Kernbibliothek zur Erstellung der Benutzeroberfläche (UI). Alle Komponenten wie `SearchForm`, `SearchAlerts` und `BookmarkedJobs` basieren auf React und seinem Komponentenmodell.
*   **[React DOM](https://react.dev/reference/react-dom)**: Verbindet React mit dem Browser, indem es die React-Komponenten in die `index.html`-Datei rendert und auf Benutzerinteraktionen reagiert.
*   **[React Router DOM](https://reactrouter.com/)**: Wird für das client-seitige Routing verwendet. Es ermöglicht die Navigation zwischen den verschiedenen Ansichten der Anwendung (z.B. `/`, `/bookmarked`, `/search_alerts`), ohne dass die Seite jedes Mal neu vom Server geladen werden muss.

### Entwicklungswerkzeuge (Dev-Dependencies)

*   **[Vite](https://vitejs.dev/)**: Dient als schnelles und modernes Build-Tool und Entwicklungsserver. Vite ist verantwortlich für den `dev`-Server (mit Hot-Module-Replacement für eine schnelle Entwicklung) und für die Erstellung der optimierten Produktionsdateien.
*   **[ESLint](https://eslint.org/)**: Ein Tool zur statischen Code-Analyse, das hilft, potenzielle Fehler, Bugs und Stilprobleme im JavaScript-Code frühzeitig zu erkennen und eine konsistente Code-Qualität sicherzustellen.

---

## Starten des Frontends

1.  Wechsle in das `frontend`-Verzeichnis:
    ```bash
    cd frontend
    ```

2.  Installiere die Abhängigkeiten:
    ```bash
    npm install
    ```

3.  Starte den Entwicklungsserver:
    ```bash
    npm run dev
    ```

Die Anwendung ist dann standardmäßig unter `http://localhost:5173` erreichbar.

=======

## Repository Strategie

### GitHub Flow

1. main
   1. Immer deploy-bereit
   2. Jede Änderung nur über Pull Request (PR)

2. Feature-Branches
   1. Kurzlebig (< 1–2 Tage)
   2. Namensschema: feature/kurzbeschreibung, bugfix/-, chore/-
      1. z.B. feature/login-form, bugfix/timeout-error

3. Commit-Messages
   1. Form: type(scope): kurzbeschreibung
      1. feat(backend): add health endpoint

4. Labels & Milestones
   1. GitHub Issues mit Labels (bug, enhancement) und Milestones für Releases

5. Pull Request → Review → Merge
   1. Mindestens 1 Reviewer
   2. Automatisierte Checks müssen grün sein

6. Deploy
   1. Jeder Merge in main triggert CI/CD → Deployment