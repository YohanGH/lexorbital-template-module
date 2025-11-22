# Fiche n°1 : Structure du template {#fiche-1-structure-template}

## 1. Objectif de la fiche

Présenter l'arborescence complète du template, expliquer le rôle de chaque fichier et dossier, et justifier les choix d'organisation pour maintenir la cohérence entre tous les modules LexOrbital.

## 2. Arborescence complète

```
lexorbital-module-<scope>/
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI GitHub Actions
├── .husky/
│   ├── pre-commit                  # Hook Git (lint-staged)
│   └── commit-msg                  # Hook Git (commitlint)
├── docs/
│   ├── README.md                   # Index de documentation
│   └── [...]                       # Autres fichiers de doc
├── infra/
│   └── docker-compose.local.yml    # Infrastructure locale (optionnel)
├── src/
│   ├── index.ts                    # Point d'entrée principal
│   └── [...]                       # Code source du module
├── tests/
│   └── example.test.ts             # Tests (Vitest)
├── .editorconfig                   # Configuration éditeur
├── .gitignore                      # Exclusions Git
├── .prettierignore                 # Exclusions Prettier
├── .prettierrc                     # Configuration Prettier
├── CHANGELOG.md                    # Historique des versions (auto)
├── CODE_OF_CONDUCT.md              # Code de conduite
├── commitlint.config.ts            # Configuration Commitlint
├── CONTRIBUTING.md                 # Guide de contribution
├── Dockerfile                      # Image Docker du module
├── eslint.config.cjs               # Configuration ESLint (flat config)
├── lexorbital.module.json          # ⭐ Manifeste LexOrbital (MANDATORY)
├── LICENSE                         # Licence (MIT recommandé)
├── package.json                    # Configuration npm/pnpm
├── pnpm-lock.yaml                  # Lock file pnpm
├── README.md                       # Documentation principale
├── SECURITY.md                     # Politique de sécurité
├── SUPPORT.md                      # Support et aide
├── tsconfig.json                   # Configuration TypeScript
└── vitest.config.ts                # Configuration Vitest (optionnel)
```

## 3. Dossiers principaux

### 3.1. `src/` — Code source

**Rôle** : Contient tout le code source TypeScript du module.

**Structure recommandée** :

```
@TODO: Ajouter la structure recommandée
```

**Conventions** :

- Un fichier = une responsabilité (single responsibility)
- Exports via `index.ts` (barrel exports)
- Pas de code en dehors de `src/` (sauf config)

### 3.2. `tests/` — Tests

**Rôle** : Contient tous les tests du module (unit, integration, e2e).

**Structure recommandée** :

```
@TODO: Ajouter la structure recommandée
```

**Conventions** :

- Fichiers de test : `\*.test.ts
- Mirrors de la structure `src/` pour les tests unitaires
- Au moins **1 test** obligatoire (healthcheck ou fonctionnel)

### 3.3. `docs/` — Documentation

**Rôle** : Documentation détaillée du module (au-delà du README).

**Structure** :

```
docs/
├── README.md               # Index de la doc
├── 00_demarrage-rapide.md  # Guide de démarrage
├── 01_structure-template.md # Cette fiche
├── [...]                   # Autres fiches
└── templates/              # Templates Pandoc (optionnel)
    └── custom.html
```

**Conventions** :

- Format Markdown (`.md`)
- Fiches numérotées pour génération Pandoc
- README comme index principal

### 3.4. `infra/` — Infrastructure

**Rôle** : Configuration Docker Compose et infrastructure locale (bases de données, caches, etc.).

**Exemple** :

```
@TODO: Ajouter l'exemple
```

**Usage** :

```bash
docker-compose -f infra/docker-compose.local.yml up
```

**Note** : L'infrastructure **ne doit pas** être déployée par le module, mais uniquement pour le développement local.

### 3.5. `.github/workflows/` — CI/CD

**Rôle** : Workflows GitHub Actions pour intégration continue.

**Fichier principal : `ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: corepack enable
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run type-check
      - run: pnpm test
      - run: pnpm run build
```

**Étapes obligatoires** :

1. Lint (ESLint)
2. Type check (tsc --noEmit)
3. Tests (Vitest)
4. Build (tsc)

### 3.6. `.husky/` — Hooks Git

**Rôle** : Hooks Git automatiques pour garantir la qualité du code.

#### `pre-commit` : Lint avant commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**Fichier `.lintstagedrc.json`** (configuration lint-staged) :

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml}": ["prettier --write"]
}
```

#### `commit-msg` : Validation Conventional Commits

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit "$1"
```

## 4. Fichiers de configuration

### 4.1. `lexorbital.module.json` ⭐ (MANDATORY)

**Rôle** : Manifeste déclaratif du module pour intégration LexOrbital.

Voir [[02_manifeste-module]] pour la spécification complète.

### 4.2. `package.json`

**Scripts obligatoires** :

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest run",
    "test:ui": "vitest --ui",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

**Dépendances standard** :

- `typescript` (≥5.0)
- `eslint` + `@typescript-eslint/*`
- `prettier`
- `vitest`
- `husky` + `lint-staged` + `commitlint`

### 4.3. `tsconfig.json`

**Configuration stricte recommandée** :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 4.4. `eslint.config.cjs` (flat config)

**Configuration ESLint moderne** :

```javascript
const eslint = require("@eslint/js")
const tseslint = require("typescript-eslint")

module.exports = tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
  },
})
```

### 4.5. `.prettierrc`

**Configuration Prettier** :

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 4.6. `commitlint.config.ts`

**Configuration Commitlint** :

```typescript
import type { UserConfig } from "@commitlint/types"

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci", "revert"]],
  },
}

export default config
```

### 4.7. `Dockerfile`

**Dockerfile minimal multi-stage** :

```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
```

## 5. Pourquoi cette structure ?

### 5.1. Cohérence

Tous les modules LexOrbital partagent **exactement la même structure** :

- ✅ Facilite la navigation pour les développeurs
- ✅ Permet l'automatisation (scripts, CI)
- ✅ Garantit l'interopérabilité avec le Core

### 5.2. Qualité

L'outillage intégré garantit :

- ✅ Code lint-free (ESLint + Prettier)
- ✅ Commits conventionnels (Commitlint)
- ✅ Tests automatiques (Vitest + CI)
- ✅ Types stricts (TypeScript strict mode)

### 5.3. Autonomie

Chaque module est **autonome** :

- ✅ Dépôt Git indépendant
- ✅ CI/CD propre
- ✅ Versioning SemVer
- ✅ Lifecycle indépendant

## 6. Checklist de conformité

Pour qu'un module soit conforme au template :

- [ ] Manifeste `lexorbital.module.json` présent et valide
- [ ] `package.json` avec scripts obligatoires (lint, test, build)
- [ ] `tsconfig.json` avec mode strict activé
- [ ] ESLint configuré (flat config)
- [ ] Prettier configuré
- [ ] Husky + Commitlint installés et actifs
- [ ] Au moins 1 test (healthcheck ou fonctionnel)
- [ ] Dockerfile présent (multi-stage recommandé)
- [ ] CI GitHub Actions configurée (lint, test, build)
- [ ] README.md complet
- [ ] CHANGELOG.md généré automatiquement
