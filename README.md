# Project Night Crawler

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