# Fiche n°3 : Règles de développement {#fiche-3-regles-developpement}

## 1. Objectif de la fiche

Définir les règles strictes de développement pour garantir la qualité, la cohérence et l'interopérabilité de tous les modules LexOrbital. Aucune exception n'est tolérée : ces règles sont **mandatory** pour l'amarrage.

## 2. Les 7 règles d'or

### Règle 1 : Conventional Commits {#regle-1}

**Statut** : ✅ MANDATORY

**Description** : Tous les commits doivent suivre la spécification [Conventional Commits](https://www.conventionalcommits.org/).

#### Format requis

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types autorisés

| Type       | Description                   | Exemple                                |
| ---------- | ----------------------------- | -------------------------------------- |
| `feat`     | Nouvelle fonctionnalité       | `feat: add OAuth2 support`             |
| `fix`      | Correction de bug             | `fix: correct token expiration`        |
| `refactor` | Refactoring (pas de feat/fix) | `refactor: extract service logic`      |
| `docs`     | Documentation uniquement      | `docs: update README`                  |
| `test`     | Ajout/modification de tests   | `test: add unit tests for AuthService` |
| `chore`    | Maintenance, config, deps     | `chore: update dependencies`           |
| `perf`     | Amélioration de performance   | `perf: optimize database queries`      |
| `ci`       | Modification CI/CD            | `ci: add coverage report`              |
| `revert`   | Revert d'un commit            | `revert: revert "feat: add feature X"` |

#### Breaking changes

Pour les changements cassants (breaking changes) :

```
feat!: remove deprecated API endpoint

BREAKING CHANGE: The /api/v1/old endpoint has been removed.
Migrate to /api/v2/new instead.
```

#### Enforcement

Les Conventional Commits sont **enforced** par :

- **Husky** (hook `commit-msg`)
- **Commitlint** (validation du format)
- **CI** (GitHub Actions)

Si le commit ne respecte pas le format, il sera **rejeté**.

### Règle 2 : Dockerfile obligatoire {#regle-2}

**Statut** : ✅ MANDATORY

**Description** : Chaque module **doit** inclure un `Dockerfile` pour containerisation.

#### Exigences

- ✅ Dockerfile **multi-stage** (build + production)
- ✅ Image de base officielle (`node:24-alpine` recommandé)
- ✅ Pas de secrets dans l'image (utiliser des variables d'environnement)
- ✅ Image la plus légère possible
- ✅ Non-root user (sécurité)

#### Template de Dockerfile

```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Production
FROM node:24-alpine

# Non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -u 1001 -G appuser appuser

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER appuser

CMD ["node", "dist/index.js"]
```

#### Validation

```bash
# Build doit réussir
docker build -t lexorbital-module-<scope> .

# Image doit démarrer sans erreur
docker run --rm lexorbital-module-<scope>
```

### Règle 3 : Tests obligatoires {#regle-3}

**Statut** : ✅ MANDATORY

**Description** : Chaque module doit inclure **au minimum** :

1. **Un test de healthcheck** (valide que le module démarre)
2. **Un test fonctionnel** (teste la fonctionnalité principale)

#### Test de healthcheck (exemple)

```typescript
// tests/healthcheck.test.ts
import { describe, it, expect } from "vitest"

describe("Healthcheck", () => {
  it("should return 200 OK", async () => {
    const response = await fetch("http://localhost:3000/health")
    expect(response.status).toBe(200)
  })
})
```

#### Test fonctionnel (exemple)

```typescript
// tests/functional.test.ts
import { describe, it, expect } from "vitest"
import { MyService } from "../src/services/my-service"

describe("MyService", () => {
  it("should perform core functionality", async () => {
    const service = new MyService()
    const result = await service.doSomething()
    expect(result).toBeDefined()
  })
})
```

#### Enforcement

- ✅ Tests exécutés dans la CI (`pnpm test`)
- ✅ Build échoue si les tests échouent
- ✅ Pas de merge sans tests passants

### Règle 4 : Manifeste complet {#regle-4}

**Statut** : ✅ MANDATORY

**Description** : Un fichier `lexorbital.module.json` **complet et valide** est obligatoire.

**Voir** : [[02_manifeste-module]] pour la spécification complète.

#### Champs obligatoires

- ✅ `name` (format `lexorbital-module-<scope>`)
- ✅ `version` (SemVer)
- ✅ `type` (`back`, `front`, `infra`)
- ✅ `entryPoints.main` et `entryPoints.types`
- ✅ `lexorbital.role`
- ✅ `lexorbital.layer`
- ✅ `lexorbital.compatibility.metaKernel`

#### Validation

```bash
# Valider avec JSON Schema
npx schemasafe validate lexorbital.module.json
```

### Règle 6 : CI compliance {#regle-6}

**Statut** : ✅ MANDATORY

**Description** : Le module doit **passer** tous les tests de la CI sans erreur.

#### Pipeline CI obligatoire

Le workflow `.github/workflows/ci.yml` doit exécuter :

1. **Install** : `pnpm install`
2. **Lint** : `pnpm run lint`
3. **Type check** : `pnpm run type-check` (ou `tsc --noEmit`)
4. **Tests** : `pnpm test`
5. **Build** : `pnpm run build`

#### Enforcement

- ❌ **Aucune PR ne peut être mergée** si la CI échoue
- ❌ **Aucun module ne peut être amarré** si la CI n'est pas verte

---

### Règle 7 : TypeScript strict mode {#regle-7}

**Statut** : ✅ MANDATORY

**Description** : Tous les modules doivent utiliser TypeScript en **strict mode**.

#### Enforcement

- ✅ `pnpm run type-check` doit passer sans erreur
- ✅ Aucun `@ts-ignore` ou `@ts-expect-error` sans justification
- ✅ Pas de `any` sauf cas exceptionnels (alors annoter avec `// eslint-disable-line`)

## 3. Bonnes pratiques (recommandées mais non obligatoires)

### 3.1. Keep modules focused

Un module = une responsabilité (Single Responsibility Principle).

**Exemples** :

- ✅ `lexorbital-module-auth` : Authentification uniquement
- ❌ `lexorbital-module-auth-and-files` : Responsabilité mixte

### 3.2. Minimize dependencies

Moins de dépendances = moins de risques de conflits.

**Conseils** :

- Utiliser les fonctionnalités natives de Node.js quand possible
- Éviter les gros frameworks si un utilitaire suffit
- Vérifier les licences des dépendances tierces

### 3.3. Document all public APIs

Chaque fonction/classe exportée doit avoir une JSDoc.

```typescript
/**
 * Authentifie un utilisateur par email/password.
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe en clair
 * @returns Token JWT si authentification réussie
 * @throws UnauthorizedException si credentials invalides
 */
async login(email: string, password: string): Promise<string> {
  // ...
}
```

### 3.4. Use semantic versioning

Voir [[06_versioning-semver]] pour les détails.

**Rappel** :

- `feat:` → MINOR bump (0.1.0 → 0.2.0)
- `fix:` → PATCH bump (0.1.0 → 0.1.1)
- `feat!:` ou `BREAKING CHANGE:` → MAJOR bump (0.1.0 → 1.0.0)

## 5. Checklist de conformité

Pour qu'un module soit **conforme** :

- [ ] ✅ Commits suivent Conventional Commits (enforced par Commitlint)
- [ ] ✅ Dockerfile présent et fonctionnel (multi-stage)
- [ ] ✅ Au moins 1 test healthcheck + 1 test fonctionnel
- [ ] ✅ Manifeste `lexorbital.module.json` complet et valide
- [ ] ✅ README.md avec toutes les sections obligatoires
- [ ] ✅ CI passe sans erreur (lint, type-check, test, build)
- [ ] ✅ TypeScript strict mode activé
- [ ] ✅ Aucun warning ESLint non justifié
- [ ] ✅ Code formaté avec Prettier

## 6. Conséquences du non-respect

### ❌ Rejet automatique

Un module qui ne respecte **pas** ces règles sera **automatiquement rejeté** par :

1. **Les hooks Git** (si Conventional Commits non respectés)
2. **La CI** (si tests/lint/build échouent)
3. **Le Meta-Kernel** (si manifeste invalide)

### ⚠️ Impossibilité d'amarrage

Un module non-conforme **ne peut pas être amarré** à la station LexOrbital.

### 🔒 Blocage des PRs

Les PRs avec CI en échec sont **automatiquement bloquées** (branch protection rules).
