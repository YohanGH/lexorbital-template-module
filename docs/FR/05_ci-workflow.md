# Fiche n°5 : CI/CD Workflow {#fiche-5-ci-workflow}

## 1. Objectif de la fiche

Présenter le workflow GitHub Actions inclus dans le template, expliquer chaque étape et montrer comment l'étendre pour des besoins spécifiques.

## 2. Workflow CI minimal

### 2.1. Étapes du pipeline

Fichier : `.github/workflows/ci.yaml`

#### Étape 1 : Checkout code

```yaml
- uses: actions/checkout@v4
```

**Rôle** : Clone le dépôt Git dans le runner GitHub Actions.

#### Étape 2 : Setup Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 24
```

**Rôle** : Installe Node.js version 24 (LTS).

**Matrix strategy** : Permet de tester sur plusieurs versions de Node (si besoin).

#### Étape 3 : Enable Corepack

```yaml
- run: corepack enable
```

**Rôle** : Active Corepack pour utiliser pnpm sans installation globale.

#### Étape 4 : Install dependencies

```yaml
- run: pnpm install --frozen-lockfile
```

**Rôle** : Installe les dépendances exactes du `pnpm-lock.yaml`.

**`--frozen-lockfile`** : Échoue si le lock file n'est pas à jour (garantit la reproductibilité).

#### Étape 5 : Lint

```yaml
- run: pnpm run lint
```

**Rôle** : Vérifie la qualité du code avec ESLint.

**Échoue si** : Erreurs ESLint détectées.

#### Étape 6 : Type Check

```yaml
- run: pnpm run type-check
```

**Rôle** : Vérifie les types TypeScript sans générer de fichiers.

**Commande** : `tsc --noEmit`

**Échoue si** : Erreurs de types détectées.

#### Étape 7 : Run Tests

```yaml
- run: pnpm test
```

**Rôle** : Exécute tous les tests avec Vitest.

**Échoue si** : Un ou plusieurs tests échouent.

#### Étape 8 : Build

```yaml
- run: pnpm run build
```

**Rôle** : Compile le code TypeScript en JavaScript.

**Échoue si** : Erreurs de compilation détectées.

#### Étape 9 : Upload coverage (optionnel)

```yaml
- uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
    fail_ci_if_error: false
```

**Rôle** : Envoie le rapport de couverture à Codecov.

**Optionnel** : Peut être retiré si Codecov n'est pas utilisé.

## 3. Triggers du workflow

### 3.1. Push sur branches principales

```yaml
on:
  push:
    branches:
      - main
      - develop
```

**Quand** : À chaque push sur `main` ou `develop`.

**Objectif** : S'assurer que les branches principales restent toujours vertes.

### 3.2. Pull Requests

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
```

**Quand** : À chaque PR vers `main` ou `develop`.

**Objectif** : Valider le code avant merge.

## 4. Branch Protection Rules

### 4.1. Configuration GitHub

Pour enforcer la CI, configurer les branch protection rules :

**Settings → Branches → Branch protection rules → Add rule**

**Règles recommandées pour `main`** :

- ✅ **Require status checks to pass before merging**
  - ✅ `quality-checks` (nom du job CI)
- ✅ **Require branches to be up to date before merging**
- ✅ **Require approvals** (au moins 1 review)
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require linear history** (no merge commits)
- ✅ **Do not allow bypassing the above settings** (même pour les admins)

### 4.2. Résultat

Avec ces règles :

- ❌ **Impossible de merger** une PR si la CI échoue
- ❌ **Impossible de push directement** sur `main` sans PR
- ✅ **Garantie** que seul du code testé et validé arrive en production

## 5. Extensions possibles

### 5.1. Docker build

Tester que l'image Docker se build correctement :

```yaml
- name: Build Docker image
  run: docker build -t lexorbital-module-test .

- name: Test Docker image
  run: docker run --rm lexorbital-module-test node --version
```

### 5.4. Publication npm (CD)

Workflow séparé pour la publication :

```yaml
name: Publish

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: "https://registry.npmjs.org"

      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build

      - name: Publish to npm
        run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 5.5. Semantic Release

Automatiser le versioning et les changelogs :

```yaml
- name: Semantic Release
  run: npx semantic-release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 6. Déploiement (CD)

### 6.1. Règle importante

⚠️ **Le déploiement (CD) NE DOIT PAS être ajouté aux modules individuels.**

**Raison** : Les modules sont déployés **via la station LexOrbital** (`lexorbital-stack`), pas individuellement.

### 6.2. Workflow de déploiement

Le déploiement se fait au niveau de `lexorbital-core` :

1. **Module pushed** → Repo du module (CI passe)
2. **Subtree update** → `lexorbital-core` pull le module mis à jour
3. **Deploy station** → `lexorbital-stack` déploie toute la station

**Conséquence** : Les modules n'ont besoin que de **CI**, pas de **CD**.

## 7. Monitoring de la CI

### 7.1. Status Badges

Ajouter un badge GitHub Actions au README :

```markdown
[![CI](https://github.com/your-org/lexorbital-module-<scope>/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/lexorbital-module-<scope>/actions/workflows/ci.yml)
```

## 8. Optimisations

### 8.1. Cache pnpm

Accélérer l'installation des dépendances :

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Get pnpm store directory
  id: pnpm-cache
  run: echo "pnpm_cache_dir=$(pnpm store path)" >> $GITHUB_OUTPUT

- name: Cache pnpm modules
  uses: actions/cache@v3
  with:
    path: ${{ steps.pnpm-cache.outputs.pnpm_cache_dir }}
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

### 8.2. Parallel jobs

Exécuter lint et tests en parallèle :

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
```

## 9. Checklist CI

Pour qu'un module soit conforme :

- [ ] Workflow `.github/workflows/ci.yml` présent
- [ ] Pipeline exécute : install, lint, type-check, test, build
- [ ] CI s'exécute sur push et PR
- [ ] Toutes les étapes passent sans erreur
- [ ] Branch protection rules configurées
- [ ] Status badge dans le README (optionnel)

## 10. Dépannage

### Erreur : `pnpm: command not found`

**Solution** : Ajouter `corepack enable` avant `pnpm install`.

### Erreur : Lock file out of date

**Solution** : Mettre à jour le lock file localement et commit :

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lock file"
```

### Tests échouent en CI mais passent localement

**Causes possibles** :

- Variables d'environnement manquantes
- Différence de timezone (UTC en CI vs local)
- Dépendances non reproductibles

**Solution** : Utiliser `--frozen-lockfile` et définir les variables dans GitHub Secrets.
