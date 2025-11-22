# Fiche n°6 : Versioning Semantic (SemVer) {#fiche-6-versioning-semver}

## 1. Objectif de la fiche

Expliquer le système de versioning automatique des modules LexOrbital, basé sur SemVer et alimenté par les Conventional Commits, avec génération automatique de changelogs.

## 2. Semantic Versioning (SemVer)

### 2.1. Format

**Format** : `MAJOR.MINOR.PATCH`

**Exemples** :

- `0.1.0` — Développement initial
- `1.0.0` — Première version stable
- `1.2.5` — Version mature
- `2.0.0` — Breaking change

### 2.2. Règles de bump

| Version   | Quand bumper                                    | Exemple           |
| --------- | ----------------------------------------------- | ----------------- |
| **PATCH** | Corrections de bugs, optimisations              | `1.0.0` → `1.0.1` |
| **MINOR** | Nouvelles fonctionnalités (backward compatible) | `1.0.1` → `1.1.0` |
| **MAJOR** | Breaking changes (non backward compatible)      | `1.1.0` → `2.0.0` |

### 2.3. Pré-releases

Pour les versions de développement :

- `0.1.0-alpha.1` — Alpha (instable)
- `0.1.0-beta.1` — Beta (features complètes, tests en cours)
- `0.1.0-rc.1` — Release Candidate (prêt pour release)

## 3. Conventional Commits → SemVer

### 3.1. Mapping automatique

| Type de commit                          | Impact SemVer | Exemple           |
| --------------------------------------- | ------------- | ----------------- |
| `fix:`                                  | **PATCH**     | `1.0.0` → `1.0.1` |
| `feat:`                                 | **MINOR**     | `1.0.0` → `1.1.0` |
| `feat!:` ou `BREAKING CHANGE:`          | **MAJOR**     | `1.0.0` → `2.0.0` |
| `chore:`, `docs:`, `refactor:`, `test:` | **Aucun**     | Pas de release    |

### 3.2. Exemples concrets

#### PATCH (fix)

```bash
git commit -m "fix: correct token expiration bug"
```

**Résultat** : `1.0.0` → `1.0.1`

**CHANGELOG** :

```markdown
## [1.0.1] - 2025-11-22

### Bug Fixes

- correct token expiration bug ([abc123](https://github.com/...))
```

#### MINOR (feat)

```bash
git commit -m "feat: add OAuth2 Google provider"
```

**Résultat** : `1.0.1` → `1.1.0`

**CHANGELOG** :

```markdown
## [1.1.0] - 2025-11-22

### Features

- add OAuth2 Google provider ([def456](https://github.com/...))
```

#### MAJOR (breaking change)

```bash
git commit -m "feat!: change AuthService.login() signature

BREAKING CHANGE: login() now requires { email, password } object instead of separate parameters.

Migration: Replace authService.login(email, password) with authService.login({ email, password })"
```

**Résultat** : `1.1.0` → `2.0.0`

**CHANGELOG** :

```markdown
## [2.0.0] - 2025-11-22

### ⚠ BREAKING CHANGES

- change AuthService.login() signature

login() now requires { email, password } object instead of separate parameters.

**Migration:** Replace `authService.login(email, password)` with `authService.login({ email, password })`

### Features

- change AuthService.login() signature ([ghi789](https://github.com/...))
```

## 4. Semantic-release

### 4.1. Installation

Le template inclut déjà `semantic-release` :

```json
{
  "devDependencies": {
    "semantic-release": "^22.0.0",
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/git": "^10.0.1"
  }
}
```

### 4.2. Configuration : `.releaserc.json`

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        "npmPublish": false
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

### 4.3. Plugins

| Plugin                    | Rôle                                                            |
| ------------------------- | --------------------------------------------------------------- |
| `commit-analyzer`         | Analyse les commits pour déterminer le type de release          |
| `release-notes-generator` | Génère les release notes depuis les commits                     |
| `changelog`               | Met à jour `CHANGELOG.md`                                       |
| `npm`                     | Publie sur npm (désactivé par défaut avec `npmPublish: false`)  |
| `git`                     | Commit les changements (CHANGELOG, package.json) et crée un tag |
| `github`                  | Crée une GitHub Release                                         |

## 5. Workflow automatique

### 5.1. Release sur push (main)

**Workflow GitHub Actions : `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Semantic Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 5.2. Processus automatique

1. **Push sur `main`** → Workflow `release` se déclenche
2. **Semantic-release** analyse les commits depuis la dernière release
3. **Détermination de la version** :
   - Commits `fix:` → PATCH
   - Commits `feat:` → MINOR
   - Commits avec `BREAKING CHANGE` → MAJOR
4. **Génération du CHANGELOG** (ajout des nouveaux commits)
5. **Bump de version** dans `package.json`
6. **Commit** des changements : `chore(release): X.Y.Z [skip ci]`
7. **Création du tag** Git : `vX.Y.Z`
8. **Push** du commit + tag
9. **Création d'une GitHub Release** avec release notes

### 5.3. Résultat

Après un push avec `feat: add new feature` :

- ✅ `package.json` : `"version": "1.1.0"`
- ✅ `CHANGELOG.md` mis à jour avec la nouvelle version
- ✅ Tag Git : `v1.1.0`
- ✅ GitHub Release créée automatiquement

## 6. CHANGELOG automatique

### 6.1. Structure

Le `CHANGELOG.md` est généré automatiquement :

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-11-22

### Features

- add OAuth2 Google provider ([abc123](https://github.com/.../commit/abc123))
- add 2FA support ([def456](https://github.com/.../commit/def456))

### Bug Fixes

- correct token refresh logic ([ghi789](https://github.com/.../commit/ghi789))

## [1.0.1] - 2025-11-20

### Bug Fixes

- fix password hashing issue ([jkl012](https://github.com/.../commit/jkl012))

## [1.0.0] - 2025-11-15

### Features

- initial release with JWT authentication
```

### 6.2. Groupes de commits

Les commits sont automatiquement groupés par type :

- **⚠ BREAKING CHANGES** — Breaking changes
- **Features** — Nouvelles fonctionnalités (`feat:`)
- **Bug Fixes** — Corrections (`fix:`)
- **Performance Improvements** — Optimisations (`perf:`)
- **Reverts** — Reverts de commits (`revert:`)

## 7. Release manuelle

### 7.1. Dry run (simulation)

Simuler une release sans la publier :

```bash
npx semantic-release --dry-run
```

**Sortie** :

```
[semantic-release] › ℹ  Start step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[semantic-release] › ℹ  Analyzing commit: feat: add new feature
[semantic-release] › ✔  Completed step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[semantic-release] › ℹ  The next release version is 1.1.0
```

### 7.2. Release locale

Créer une release manuellement (si pas dans GitHub Actions) :

```bash
npx semantic-release --no-ci
```

⚠️ **Attention** : Nécessite les tokens `GITHUB_TOKEN` et `NPM_TOKEN` en environnement.

## 8. Gestion des branches

### 8.1. Branches de release

Par défaut, semantic-release ne release que depuis `main` :

```json
{
  "branches": ["main"]
}
```

### 8.2. Multi-branches (optionnel)

Pour supporter plusieurs canaux de release :

```json
{
  "branches": [
    "main",
    {
      "name": "next",
      "prerelease": true
    },
    {
      "name": "beta",
      "prerelease": true
    }
  ]
}
```

**Résultat** :

- Push sur `main` → `1.0.0`
- Push sur `next` → `1.1.0-next.1`
- Push sur `beta` → `1.1.0-beta.1`

## 9. Publication npm (optionnel)

### 9.1. Activer la publication

Dans `.releaserc.json`, retirer `"npmPublish": false` :

```json
{
  "plugins": ["@semantic-release/npm"]
}
```

### 9.2. Token npm

Ajouter le secret `NPM_TOKEN` dans GitHub :

**Settings → Secrets → Actions → New repository secret**

**Name** : `NPM_TOKEN`  
**Value** : Votre token npm (généré sur [npmjs.com](https://www.npmjs.com/settings/~/tokens))

### 9.3. Scope npm

Pour publier un package scopé (ex: `@lexorbital/module-auth`) :

**`package.json`** :

```json
{
  "name": "@lexorbital/module-auth",
  "publishConfig": {
    "access": "public"
  }
}
```

## 10. Bonnes pratiques

### 10.1. Commits squash

Squasher les commits d'une PR en un seul commit :

```bash
git rebase -i HEAD~5
# Squash tous les commits sauf le premier
# Éditer le message final pour respecter Conventional Commits
```

### 10.2. Messages de commit clairs

**Mauvais** :

```
fix stuff
update code
wip
```

**Bon** :

```
fix: correct token expiration calculation
feat: add support for refresh tokens
refactor: extract auth logic into service
```

### 10.3. Changelog manual (si nécessaire)

Si besoin de notes manuelles dans le CHANGELOG :

```markdown
## [1.0.0] - 2025-11-22

### Migration Guide

This is a major release with breaking changes. Please follow this guide:

1. Update all imports from `auth` to `@lexorbital/auth`
2. Replace `login(email, password)` with `login({ email, password })`
3. Update environment variables (see README)

### Features

...
```

## 11. Checklist de versioning

- [ ] Tous les commits suivent Conventional Commits
- [ ] `semantic-release` configuré dans `.releaserc.json`
- [ ] Workflow GitHub Actions `release.yml` présent
- [ ] Secret `GITHUB_TOKEN` disponible (automatique)
- [ ] Secret `NPM_TOKEN` configuré (si publication npm)
- [ ] CHANGELOG.md généré automatiquement
- [ ] Tags Git créés automatiquement
- [ ] GitHub Releases créées automatiquement
