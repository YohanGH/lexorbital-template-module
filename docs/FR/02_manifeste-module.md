# Fiche n°2 : Manifeste de module {#fiche-2-manifeste-module}

## 1. Objectif de la fiche

Spécifier le format exact du manifeste `lexorbital.module.json`, son rôle dans l'écosystème LexOrbital et comment le Core l'utilise pour découvrir et valider les modules.

## 2. Rôle du manifeste

### 2.1. Pourquoi un manifeste ?

Le manifeste permet au **Meta-Kernel** de LexOrbital Core de :

- **Découvrir** les modules automatiquement (scan de `modules/*/lexorbital.module.json`)
- **Valider** la compatibilité (version du Core, dépendances)
- **Charger** les modules dans le bon anneau (Ring)
- **Documenter** automatiquement l'architecture (graphes de dépendances)
- **Configurer** les variables d'environnement requises

### 2.2. Sans manifeste, pas d'intégration

Un module **sans** `lexorbital.module.json` :

- ❌ Ne peut pas être amarré à la station
- ❌ Ne sera pas détecté par le Meta-Kernel
- ❌ Ne peut pas déclarer ses dépendances
- ❌ Ne peut pas être documenté automatiquement

## 3. Structure complète du manifeste

```json
{
  "name": "lexorbital-module-<scope>",
  "description": "Description courte du module (1-2 phrases)",
  "type": "back",
  "version": "0.1.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "<scope>-module",
    "layer": "back",
    "orbit": 2,
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "dependencies": {
      "required": ["config-module", "logger-module"],
      "optional": ["notification-module"]
    },
    "provides": {
      "services": ["MyService", "AnotherService"],
      "events": ["module.event.created", "module.event.updated"],
      "endpoints": ["/api/<scope>"]
    },
    "consumes": {
      "events": ["user.created", "user.deleted"]
    },
    "tags": ["<scope>", "backend", "database"]
  },
  "env": ["DATABASE_URL", "API_KEY"],
  "healthcheck": {
    "endpoint": "/health",
    "interval": 30000
  },
  "maintainer": {
    "name": "Votre Nom ou Organisation",
    "contact": "https://github.com/your-org/lexorbital-module-<scope>"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/lexorbital-module-<scope>"
  },
  "license": "MIT"
}
```

## 4. Champs obligatoires

### 4.1. `name` (string, required)

**Format** : `lexorbital-module-<scope>`

**Exemples** :

- `lexorbital-module-auth`
- `lexorbital-module-dossiers`
- `lexorbital-module-documents`

**Règles** :

- Doit commencer par `lexorbital-module-`
- Kebab-case uniquement (minuscules + tirets)
- Unique dans l'écosystème LexOrbital

### 4.2. `version` (semver, required)

**Format** : Semantic Versioning (`MAJOR.MINOR.PATCH`)

**Exemples** :

- `0.1.0` (développement initial)
- `1.0.0` (première version stable)
- `2.3.5` (version mature)

**Règles** :

- Doit correspondre à la version dans `package.json`
- Géré automatiquement par `semantic-release`

### 4.3. `type` (enum, required)

**Valeurs possibles** :

- `"back"` — Module backend (NestJS, Express, API)
- `"front"` — Module frontend (React, Vue, UI)
- `"infra"` — Module infrastructure (scripts, config, orchestration)

**Exemple** :

```json
{
  "type": "back"
}
```

### 4.4. `entryPoints` (object, required)

**Structure** :

```json
{
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  }
}
```

**Champs** :

- `main` : Fichier JavaScript compilé (point d'entrée)
- `types` : Fichiers de déclaration TypeScript (`.d.ts`)

### 4.5. `lexorbital.role` (string, required)

**Rôle** : Identifiant unique du module dans la station.

**Format** : `<scope>-module`

**Exemples** :

- `auth-module`
- `dossiers-module`
- `documents-module`

### 4.6. `lexorbital.layer` (enum, required)

**Valeurs possibles** :

- `"back"` — Backend (Meta-Kernel, services)
- `"front"` — Frontend (React, interface utilisateur)
- `"infra"` — Infrastructure (Docker, CI, scripts)

### 4.7. `lexorbital.compatibility` (object, required)

**Structure** :

```json
{
  "compatibility": {
    "metaKernel": ">=1.0.0 <2.0.0"
  }
}
```

**Format** : Range npm (semver)

**Exemples** :

- `">=1.0.0 <2.0.0"` — Compatible avec Meta-Kernel 1.x
- `"^1.2.0"` — Compatible avec 1.2.0 et plus (mineures)
- `"~1.2.3"` — Compatible avec 1.2.x (patches uniquement)

## 5. Champs optionnels

### 5.1. `description` (string, optional)

**Rôle** : Description courte du module (1-2 phrases).

**Exemple** :

```json
{
  "description": "Module d'authentification JWT avec support OAuth2 et RBAC"
}
```

### 5.2. `lexorbital.orbit` (number, optional)

**Rôle** : Anneau orbital du module (0-3).

**Valeurs** :

- `0` — Meta-Kernel (Core)
- `1` — Core Services (auth, audit, logs)
- `2` — Business Logic (dossiers, documents)
- `3` — Intégrations (API Gateway, webhooks)

**Exemple** :

```json
{
  "orbit": 1
}
```

### 5.3. `lexorbital.dependencies` (object, optional)

**Structure** :

```json
{
  "dependencies": {
    "required": ["config-module", "logger-module"],
    "optional": ["notification-module"]
  }
}
```

**Rôle** : Déclare les dépendances inter-modules.

**Validation** : Le Meta-Kernel vérifie que tous les modules `required` sont chargés avant d'initialiser ce module.

### 5.4. `lexorbital.provides` (object, optional)

**Structure** :

```json
{
  "provides": {
    "services": ["AuthService", "TokenService"],
    "events": ["user.login", "user.logout"],
    "endpoints": ["/auth/login", "/auth/logout"]
  }
}
```

**Rôle** : Déclare ce que le module expose (services, événements, endpoints HTTP).

**Usage** : Génération automatique de documentation et graphes de dépendances.

### 5.5. `lexorbital.consumes` (object, optional)

**Structure** :

```json
{
  "consumes": {
    "events": ["user.created", "user.deleted"]
  }
}
```

**Rôle** : Déclare les événements que le module écoute (pub/sub).

**Usage** : Cartographie des flux de communication inter-modules.

### 5.6. `lexorbital.tags` (array, optional)

**Rôle** : Tags pour recherche et catégorisation.

**Exemple** :

```json
{
  "tags": ["auth", "security", "jwt", "oauth2"]
}
```

### 5.7. `env` (array, optional)

**Rôle** : Liste des variables d'environnement requises.

**Exemple** :

```json
{
  "env": ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"]
}
```

**Usage** : Le Meta-Kernel peut valider que toutes les variables sont définies au démarrage.

### 5.8. `healthcheck` (object, optional)

**Structure** :

```json
{
  "healthcheck": {
    "endpoint": "/health",
    "interval": 30000
  }
}
```

**Rôle** : Configure le health check du module.

**Champs** :

- `endpoint` : Endpoint HTTP à poller (ex: `/health`)
- `interval` : Intervalle en ms (par défaut : 30000 = 30s)

### 5.9. `maintainer` (object, optional)

**Structure** :

```json
{
  "maintainer": {
    "name": "LexOrbital Core Team",
    "contact": "https://github.com/lexorbital/lexorbital-module-auth"
  }
}
```

### 5.10. `repository` (object, optional)

**Structure** :

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/lexorbital/lexorbital-module-auth"
  }
}
```

### 5.11. `license` (string, optional)

**Rôle** : Licence du module.

**Exemples** :

- `"MIT"` (recommandé)
- `"Apache-2.0"`
- `"GPL-3.0"`

## 6. Validation du manifeste

### 6.1. Validation au chargement

Le Meta-Kernel valide le manifeste à chaque chargement :

```typescript
// Pseudo-code de validation
function validateManifest(manifest: Manifest): void {
  // Champs obligatoires
  if (!manifest.name) throw new Error("Missing required field: name")
  if (!manifest.type) throw new Error("Missing required field: type")
  if (!manifest.version) throw new Error("Missing required field: version")

  // Format du nom
  if (!manifest.name.startsWith("lexorbital-module-")) {
    throw new Error('Module name must start with "lexorbital-module-"')
  }

  // Version SemVer
  if (!semver.valid(manifest.version)) {
    throw new Error("Invalid version format (must be SemVer)")
  }

  // Compatibilité
  if (!semver.satisfies(CORE_VERSION, manifest.lexorbital.compatibility.metaKernel)) {
    throw new Error(`Module incompatible with Meta-Kernel version ${CORE_VERSION}`)
  }

  // Dépendances
  for (const dep of manifest.lexorbital.dependencies?.required || []) {
    if (!loadedModules.has(dep)) {
      throw new Error(`Missing required dependency: ${dep}`)
    }
  }
}
```

### 6.2. Validation avec JSON Schema

Un schéma JSON Schema est disponible pour validation automatique :

**URL** : `https://lexorbital.dev/schemas/module-manifest.v1.json`

**Usage dans le manifeste** :

```json
{
  "$schema": "https://lexorbital.dev/schemas/module-manifest.v1.json",
  "name": "lexorbital-module-auth",
  ...
}
```

**Validation en CLI** :

```bash
# Installer ajv-cli
pnpm install -g ajv-cli

# Valider le manifeste
ajv validate -s module-manifest.schema.json -d lexorbital.module.json
```

## 7. Exemples complets

### 7.1. Module backend (Auth)

```json
{
  "$schema": "https://lexorbital.dev/schemas/module-manifest.v1.json",
  "name": "lexorbital-module-auth",
  "description": "Module d'authentification JWT avec support OAuth2 et RBAC",
  "type": "back",
  "version": "1.2.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "auth-module",
    "layer": "back",
    "orbit": 1,
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "dependencies": {
      "required": ["config-module", "logger-module"],
      "optional": ["notification-module"]
    },
    "provides": {
      "services": ["AuthService", "RBACService", "TokenService"],
      "events": ["user.login", "user.logout", "token.refreshed"],
      "endpoints": ["/auth/login", "/auth/logout", "/auth/refresh"]
    },
    "consumes": {
      "events": ["user.created", "user.deleted"]
    },
    "tags": ["auth", "jwt", "oauth2", "rbac", "security"]
  },
  "env": ["JWT_SECRET", "JWT_EXPIRY", "DATABASE_URL"],
  "healthcheck": {
    "endpoint": "/auth/health",
    "interval": 30000
  },
  "maintainer": {
    "name": "LexOrbital Core Team",
    "contact": "https://github.com/lexorbital/lexorbital-module-auth"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/lexorbital/lexorbital-module-auth"
  },
  "license": "MIT"
}
```

### 7.2. Module frontend (Console)

```json
{
  "name": "lexorbital-module-console",
  "description": "Console de contrôle 3D avec Three.js",
  "type": "front",
  "version": "0.5.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "console-module",
    "layer": "front",
    "orbit": 3,
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "dependencies": {
      "required": ["api-gateway-module"]
    },
    "tags": ["frontend", "react", "threejs", "console", "ui"]
  },
  "license": "MIT"
}
```

### 7.3. Module infrastructure

```json
{
  "name": "lexorbital-module-ci-scripts",
  "description": "Scripts CI/CD et automatisation",
  "type": "infra",
  "version": "1.0.0",
  "entryPoints": {
    "main": "dist/index.js"
  },
  "lexorbital": {
    "role": "ci-scripts",
    "layer": "infra",
    "compatibility": {
      "metaKernel": "*"
    },
    "tags": ["ci", "cd", "automation", "scripts"]
  },
  "license": "MIT"
}
```

## 8. Checklist de conformité

- [ ] Fichier `lexorbital.module.json` présent à la racine
- [ ] Champ `name` au format `lexorbital-module-<scope>`
- [ ] Champ `version` en SemVer (correspond à `package.json`)
- [ ] Champ `type` défini (`back`, `front`, ou `infra`)
- [ ] `entryPoints.main` et `entryPoints.types` définis
- [ ] `lexorbital.role` unique et descriptif
- [ ] `lexorbital.layer` correspond au type
- [ ] `lexorbital.compatibility.metaKernel` défini
- [ ] Variables `env` listées si nécessaires
- [ ] `healthcheck.endpoint` défini (pour modules back)
- [ ] Validation JSON Schema passe sans erreur
