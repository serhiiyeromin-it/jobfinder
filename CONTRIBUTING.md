# Contributing Guidelines

Vielen Dank für dein Interesse an **Project Night Crawler** 🎉  
Bitte halte dich an die folgenden Konventionen, damit das Repository für alle Beteiligten konsistent und wartbar bleibt.

---

## Repository-Strategie

Wir verwenden **GitHub Flow**:

1. **`main`**
   - Immer deploy-bereit
   - Änderungen nur über Pull Requests (PRs)

2. **Feature-Branches**
   - Kurzlebig (idealerweise < 1–2 Tage)
   - Namensschema: `feature/...`, `bugfix/...`, `chore/...`
     - Beispiele: `feature/login-form`, `bugfix/timeout-error`

3. **Commit Messages**
   - Format: `type(scope): beschreibung` (Conventional Commits)
   - Beispiel: `feat(backend): add health endpoint`

   **Typen**:  
   - `feat` – neues Feature  
   - `fix` – Bugfix  
   - `chore` – Wartungsaufgaben, keine Funktionsänderung  
   - `docs` – Dokumentation  
   - `refactor` – Codeänderung ohne neues Feature oder Fix  
   - `test` – Tests hinzufügen oder anpassen  

4. **Labels & Milestones**
   - GitHub Issues mit Labels wie `bug`, `enhancement`, `documentation`
   - Meilensteine strukturieren Releases

5. **Pull Requests**
   - Mindestens ein Reviewer erforderlich
   - Automatisierte Checks (Lint, Tests, Build) müssen erfolgreich sein
   - Bitte beschreibe im PR, *was* geändert wurde und *warum*

6. **Deployment**
   - Jeder Merge in `main` triggert CI/CD → automatisiertes Deployment
   - Docker Images werden automatisch in Docker Hub veröffentlicht

---

## Code Style

- **Backend**:  
  - Python 3.11  
  - Linting mit `flake8`, Formatierung mit `black`  
  - Unit Tests mit `pytest`  

- **Frontend**:  
  - React + Vite  
  - Linting mit `eslint`  
  - Formatierung mit `prettier`  

> Bitte führe vor jedem Commit die Linter & Tests aus.

---

## Tests

- **Backend**:  

  ```bash
  cd backend
  pytest --cov=backend
  ```

- **Frontend**:  

  ```bash
  cd frontend
  npm test   # sobald Tests vorhanden sind
  ```

---

## CI/CD

GitHub Actions prüft automatisch bei jedem PR:

- ✅ Linting (Backend & Frontend)  
- ✅ Unit Tests (Backend)  
- ✅ Markdown-Lint  
- ✅ Docker Build & Smoke Tests  

Diese Checks sind **required** für einen Merge in `main`.

---

## Umgang mit Secrets

- Keine echten Zugangsdaten committen!  
- Verwende `.env` oder GitHub Actions **Secrets**.  
- Beispiel: `MONGO_URI`, `BAA_API_KEY`, `MAIL_*`  

---

## Deployment-Hinweise

### Kubernetes Cleanup

```bash
kubectl delete all --all -n nightcrawler
```

### Kubernetes Deployment

```bash
kubectl apply -f all-in-one.yaml
```

---

## Fragen & Feedback

Wenn du dir unsicher bist:

- Stelle deine Frage in einem **GitHub Issue**
- Oder markiere sie im Pull Request als **Draft** bis alles geklärt ist

---

Vielen Dank fürs Mitmachen 💙  
Gemeinsam machen wir Night Crawler besser 🚀
