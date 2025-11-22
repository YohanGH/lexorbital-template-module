# Sheet #2: Module Manifest {#sheet-2-module-manifest}

> The `lexorbital.module.json` file is the **mandatory manifest** for each LexOrbital module. It declares metadata, entry points, compatibility, and module dependencies.

## 1. Sheet Objective

Specify the exact format of the `lexorbital.module.json` manifest, its role in the LexOrbital ecosystem, and how the Core uses it to discover and validate modules.

## 2. Manifest Role

### 2.1. Why a Manifest?

The manifest allows the **Meta-Kernel** of LexOrbital Core to:

- **Discover** modules automatically (scan of `modules/*/lexorbital.module.json`)
- **Validate** compatibility (Core version, dependencies)
- **Load** modules into the correct ring (Ring)
- **Document** architecture automatically (dependency graphs)
- **Configure** required environment variables

### 2.2. No Manifest, No Integration

A module **without** `lexorbital.module.json`:

- ❌ Cannot be docked to the station
- ❌ Will not be detected by the Meta-Kernel
- ❌ Cannot declare its dependencies
- ❌ Cannot be automatically documented

## 3. Complete Manifest Structure

```json
{
  "name": "lexorbital-module-<scope>",
  "description": "Short module description (1-2 sentences)",
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
    "name": "Your Name or Organization",
    "contact": "https://github.com/your-org/lexorbital-module-<scope>"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/lexorbital-module-<scope>"
  },
  "license": "MIT"
}
```

## 4. Required Fields

### 4.1. `name` (string, required)

**Format**: `lexorbital-module-<scope>`

**Examples**:

- `lexorbital-module-auth`
- `lexorbital-module-dossiers`
- `lexorbital-module-documents`

**Rules**:

- Must start with `lexorbital-module-`
- Kebab-case only (lowercase + hyphens)
- Unique in the LexOrbital ecosystem

### 4.2. `version` (semver, required)

**Format**: Semantic Versioning (`MAJOR.MINOR.PATCH`)

**Examples**:

- `0.1.0` (initial development)
- `1.0.0` (first stable version)
- `2.3.5` (mature version)

**Rules**:

- Must match version in `package.json`
- Managed automatically by `semantic-release`

### 4.3. `type` (enum, required)

**Possible Values**:

- `"back"` — Backend module (NestJS, Express, API)
- `"front"` — Frontend module (React, Vue, UI)
- `"infra"` — Infrastructure module (scripts, config, orchestration)

**Example**:

```json
{
  "type": "back"
}
```

### 4.4. `entryPoints` (object, required)

**Structure**:

```json
{
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  }
}
```

**Fields**:

- `main`: Compiled JavaScript file (entry point)
- `types`: TypeScript declaration files (`.d.ts`)

### 4.5. `lexorbital.role` (string, required)

**Role**: Unique module identifier in the station.

**Format**: `<scope>-module`

**Examples**:

- `auth-module`
- `dossiers-module`
- `documents-module`

### 4.6. `lexorbital.layer` (enum, required)

**Possible Values**:

- `"back"` — Backend (Meta-Kernel, services)
- `"front"` — Frontend (React, user interface)
- `"infra"` — Infrastructure (Docker, CI, scripts)

### 4.7. `lexorbital.compatibility` (object, required)

**Structure**:

```json
{
  "compatibility": {
    "metaKernel": ">=1.0.0 <2.0.0"
  }
}
```

**Format**: pnpm range (semver)

**Examples**:

- `">=1.0.0 <2.0.0"` — Compatible with Meta-Kernel 1.x
- `"^1.2.0"` — Compatible with 1.2.0 and above (minor)
- `"~1.2.3"` — Compatible with 1.2.x (patches only)

## 5. Optional Fields

### 5.1. `description` (string, optional)

**Role**: Short module description (1-2 sentences).

**Example**:

```json
{
  "description": "JWT authentication module with OAuth2 and RBAC support"
}
```

### 5.2. `lexorbital.orbit` (number, optional)

**Role**: Module orbital ring (0-3).

**Values**:

- `0` — Meta-Kernel (Core)
- `1` — Core Services (auth, audit, logs)
- `2` — Business Logic (dossiers, documents)
- `3` — Integrations (API Gateway, webhooks)

**Example**:

```json
{
  "orbit": 1
}
```

### 5.3. `lexorbital.dependencies` (object, optional)

**Structure**:

```json
{
  "dependencies": {
    "required": ["config-module", "logger-module"],
    "optional": ["notification-module"]
  }
}
```

**Role**: Declares inter-module dependencies.

**Validation**: The Meta-Kernel verifies that all `required` modules are loaded before initializing this module.

### 5.4. `lexorbital.provides` (object, optional)

**Structure**:

```json
{
  "provides": {
    "services": ["AuthService", "TokenService"],
    "events": ["user.login", "user.logout"],
    "endpoints": ["/auth/login", "/auth/logout"]
  }
}
```

**Role**: Declares what the module exposes (services, events, HTTP endpoints).

**Usage**: Automatic documentation generation and dependency graphs.

### 5.5. `lexorbital.consumes` (object, optional)

**Structure**:

```json
{
  "consumes": {
    "events": ["user.created", "user.deleted"]
  }
}
```

**Role**: Declares events the module listens to (pub/sub).

**Usage**: Maps inter-module communication flows.

### 5.6. `lexorbital.tags` (array, optional)

**Role**: Tags for search and categorization.

**Example**:

```json
{
  "tags": ["auth", "security", "jwt", "oauth2"]
}
```

### 5.7. `env` (array, optional)

**Role**: List of required environment variables.

**Example**:

```json
{
  "env": ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"]
}
```

**Usage**: The Meta-Kernel can validate that all variables are defined at startup.

### 5.8. `healthcheck` (object, optional)

**Structure**:

```json
{
  "healthcheck": {
    "endpoint": "/health",
    "interval": 30000
  }
}
```

**Role**: Configures module health check.

**Fields**:

- `endpoint`: HTTP endpoint to poll (e.g., `/health`)
- `interval`: Interval in ms (default: 30000 = 30s)

### 5.9. `maintainer` (object, optional)

**Structure**:

```json
{
  "maintainer": {
    "name": "LexOrbital Core Team",
    "contact": "https://github.com/lexorbital/lexorbital-module-auth"
  }
}
```

### 5.10. `repository` (object, optional)

**Structure**:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/lexorbital/lexorbital-module-auth"
  }
}
```

### 5.11. `license` (string, optional)

**Role**: Module license.

**Examples**:

- `"MIT"` (recommended)
- `"Apache-2.0"`
- `"GPL-3.0"`

## 6. Manifest Validation

### 6.1. Validation on Load

The Meta-Kernel validates the manifest on each load:

```typescript
// Pseudo-code validation
function validateManifest(manifest: Manifest): void {
  // Required fields
  if (!manifest.name) throw new Error("Missing required field: name")
  if (!manifest.type) throw new Error("Missing required field: type")
  if (!manifest.version) throw new Error("Missing required field: version")

  // Name format
  if (!manifest.name.startsWith("lexorbital-module-")) {
    throw new Error('Module name must start with "lexorbital-module-"')
  }

  // SemVer version
  if (!semver.valid(manifest.version)) {
    throw new Error("Invalid version format (must be SemVer)")
  }

  // Compatibility
  if (!semver.satisfies(CORE_VERSION, manifest.lexorbital.compatibility.metaKernel)) {
    throw new Error(`Module incompatible with Meta-Kernel version ${CORE_VERSION}`)
  }

  // Dependencies
  for (const dep of manifest.lexorbital.dependencies?.required || []) {
    if (!loadedModules.has(dep)) {
      throw new Error(`Missing required dependency: ${dep}`)
    }
  }
}
```

### 6.2. Validation with JSON Schema

A JSON Schema is available for automatic validation:

**URL**: `https://lexorbital.dev/schemas/module-manifest.v1.json`

**Usage in Manifest**:

```json
{
  "$schema": "https://lexorbital.dev/schemas/module-manifest.v1.json",
  "name": "lexorbital-module-auth",
  ...
}
```

**CLI Validation**:

```bash
# Install @exodus/schemasafe
pnpm install --save-dev @exodus/schemasafe

# Validate manifest
npx schemasafe validate lexorbital.module.json
```

## 7. Complete Examples

### 7.1. Backend Module (Auth)

```json
{
  "$schema": "https://lexorbital.dev/schemas/module-manifest.v1.json",
  "name": "lexorbital-module-auth",
  "description": "JWT authentication module with OAuth2 and RBAC support",
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

### 7.2. Frontend Module (Console)

```json
{
  "name": "lexorbital-module-console",
  "description": "3D control console with Three.js",
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

### 7.3. Infrastructure Module

```json
{
  "name": "lexorbital-module-ci-scripts",
  "description": "CI/CD scripts and automation",
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

## 8. Compliance Checklist

- [ ] `lexorbital.module.json` file present at root
- [ ] `name` field in format `lexorbital-module-<scope>`
- [ ] `version` field in SemVer (matches `package.json`)
- [ ] `type` field defined (`back`, `front`, or `infra`)
- [ ] `entryPoints.main` and `entryPoints.types` defined
- [ ] `lexorbital.role` unique and descriptive
- [ ] `lexorbital.layer` matches type
- [ ] `lexorbital.compatibility.metaKernel` defined
- [ ] `env` variables listed if necessary
- [ ] `healthcheck.endpoint` defined (for back modules)
- [ ] JSON Schema validation passes without errors
