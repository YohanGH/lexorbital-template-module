# Fiche n°0 : Démarrage rapide {#fiche-0-demarrage-rapide}

## 1. Objectif de la fiche

Fournir un guide étape par étape pour installer, configurer et utiliser le template LexOrbital Module, permettant aux développeurs de créer rapidement des modules conformes aux standards de la station.

## 2. Prérequis

### 2.1. Logiciels requis

| Outil              | Version minimale   | Installation                          |
| ------------------ | ------------------ | ------------------------------------- |
| **Node.js**        | ≥24.11.1           | [nodejs.org](https://nodejs.org/)     |
| **pnpm**           | Latest             | `npm install -g pnpm`                 |
| **Git**            | ≥2.0               | [git-scm.com](https://git-scm.com/)   |
| **Docker**         | Latest (optionnel) | [docker.com](https://www.docker.com/) |
| **Docker Compose** | Latest (optionnel) | Inclus avec Docker Desktop            |

### 2.2. Connaissances requises

- **TypeScript** : Niveau intermédiaire
- **Node.js** : Bases de npm/pnpm et modules
- **Git** : Commits, branches, git subtree (recommandé)
- **Docker** : Optionnel, pour containerisation

## 3. Installation

### 3.1. Créer un module depuis le template

#### Option 1 : Via GitHub UI (recommandé)

1. Aller sur [github.com/lexorbital/lexorbital-template-module](https://github.com/lexorbital/lexorbital-template-module)
2. Cliquer sur **"Use this template"** → **"Create a new repository"**
3. Nommer le nouveau dépôt : `lexorbital-module-<scope>`
   - Exemple : `lexorbital-module-auth`, `lexorbital-module-dossiers`
4. Choisir la visibilité (Public/Private)
5. Cliquer sur **"Create repository"**

#### Option 2 : Via CLI

```bash
# Cloner le template
git clone https://github.com/lexorbital/lexorbital-template-module.git lexorbital-module-<scope>
cd lexorbital-module-<scope>

# Supprimer l'historique Git du template
rm -rf .git
git init
git add .
git commit -m "chore: initial commit from template"

# Lier au nouveau dépôt distant
git remote add origin git@github.com:your-org/lexorbital-module-<scope>.git
git push -u origin main
```

### 3.2. Installer les dépendances

```bash
cd lexorbital-module-<scope>
pnpm install
```

Cela installe :

- **TypeScript** (strict mode)
- **ESLint + Prettier** (quality gates)
- **Vitest** (testing framework)
- **Husky** (git hooks)
- **Commitlint** (conventional commits)
- **Semantic-release** (versioning automatique)

### 3.3. Configurer le module

#### Étape 1 : Mettre à jour `package.json`

```json
{
  "name": "lexorbital-module-<scope>",
  "version": "0.1.0",
  "description": "Description courte de votre module",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/lexorbital-module-<scope>"
  },
  "author": "Votre Nom <email@example.com>",
  "keywords": ["lexorbital", "module", "<scope>"]
}
```

#### Étape 2 : Configurer `lexorbital.module.json`

```json
{
  "name": "lexorbital-module-<scope>",
  "description": "Description de votre module",
  "type": "back",
  "version": "0.1.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "<scope>-module",
    "layer": "back",
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "tags": ["<scope>", "your-tags"]
  },
  "env": ["ENV_VAR_1", "ENV_VAR_2"],
  "maintainer": {
    "name": "Votre Nom",
    "contact": "https://github.com/your-org/lexorbital-module-<scope>"
  }
}
```

**Champs importants** :

- `type` : `"back"` (backend), `"front"` (frontend), ou `"infra"` (infrastructure)
- `lexorbital.role` : Identifiant unique du module
- `lexorbital.layer` : Couche d'intégration (`"back"`, `"front"`, `"infra"`)
- `env` : Variables d'environnement requises

#### Étape 3 : Mettre à jour le `README.md`

````markdown
# LexOrbital Module - <Scope>

Description courte du module.

## Installation

```bash
pnpm install
```
````

## Configuration

Variables d'environnement requises :

- `ENV_VAR_1` - Description
- `ENV_VAR_2` - Description

## Usage

@TODO: Ajouter le code d'exemple

## 4. Commandes de développement

### 4.1. Commandes principales

```bash
# Mode développement (watch mode avec hot reload)
pnpm run dev

# Tests (Vitest)
pnpm test

# Tests en mode watch
pnpm run test:ui

# Build production
pnpm run build

# Linting
pnpm run lint

# Correction automatique lint + format
pnpm run lint:fix

# Formatage (Prettier)
pnpm run format

# Vérification des types TypeScript
pnpm run type-check
```

### 4.2. Commandes Docker (optionnel)

```bash
# Build image Docker
pnpm run docker:build

# Démarrer en mode développement avec Docker
pnpm run docker:dev

# Démarrer avec Docker Compose (si infrastructure nécessaire)
docker-compose -f infra/docker-compose.local.yml up
```

## 5. Validation du setup

Avant de commencer à développer, validez que tout fonctionne :

```bash
# 1. Vérifier que les hooks Git sont actifs
ls -la .husky/
# Doit afficher : pre-commit, commit-msg

# 2. Lancer les tests
pnpm test
# ✅ Doit afficher au moins 1 test qui passe

# 3. Vérifier le lint
pnpm run lint
# ✅ Aucune erreur

# 4. Build
pnpm run build
# ✅ Doit créer le dossier dist/

# 5. Tester un commit (Conventional Commits)
git add .
git commit -m "test: validate setup"
# ✅ Le hook commitlint doit valider le message
```

Si toutes ces étapes passent, votre environnement est prêt ! 🎉

## 6. Premier développement

### 6.1. Structure de départ

Le template fournit une structure minimale :

```
tests/
└── template-module.test.ts       # Exemple de test (à adapter)
```

### 6.2. Créer votre premier service

```typescript
// src/services/my-service.ts
export class MyService {
  constructor(private readonly config: Config) {}

  async doSomething(): Promise<string> {
    // Votre logique métier
    return "Hello from MyService"
  }
}
```

### 6.3. Écrire le test

```typescript
// tests/my-service.test.ts
import { describe, it, expect } from "vitest"
import { MyService } from "../src/services/my-service"

describe("MyService", () => {
  it("should return a greeting", async () => {
    const service = new MyService({})
    const result = await service.doSomething()
    expect(result).toBe("Hello from MyService")
  })
})
```

### 6.4. Commit avec Conventional Commits

```bash
git add src/services/my-service.ts tests/my-service.test.ts
git commit -m "feat: add MyService with basic functionality"
```

Le hook `commitlint` validera automatiquement le format.

## 7. Checklist de démarrage

- [ ] Node.js ≥24.11.1 installé
- [ ] pnpm installé globalement
- [ ] Dépôt créé depuis le template
- [ ] `pnpm install` exécuté avec succès
- [ ] `package.json` mis à jour (name, description, author)
- [ ] `lexorbital.module.json` configuré (name, type, role)
- [ ] `README.md` personnalisé
- [ ] Tests passent (`pnpm test`)
- [ ] Lint passe (`pnpm run lint`)
- [ ] Build réussit (`pnpm run build`)
- [ ] Premier commit avec Conventional Commits validé

## 8. Prochaines étapes

Une fois le setup validé, consultez :

- [[01_structure-template]] : Comprendre l'organisation des fichiers
- [[02_manifeste-module]] : Détails du `lexorbital.module.json`
- [[03_regles-developpement]] : Règles obligatoires pour intégration
- [[04_tests-qualite]] : Standards de tests et couverture

## 9. Dépannage

### Erreur : Hooks Git ne se déclenchent pas

```bash
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Erreur : `commitlint` rejette mes commits

Vérifiez le format : `type(scope): description`

Exemples valides :

- `feat: add new feature`
- `fix: correct bug in service`
- `docs: update README`

### Tests échouent après installation

```bash
# Nettoyer et réinstaller
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test
```
