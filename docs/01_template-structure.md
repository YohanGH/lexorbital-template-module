# Sheet #1: Template Structure {#sheet-1-template-structure}

## 1. Sheet Objective

Present the complete file tree of the template, explain the role of each file and folder, and justify organizational choices to maintain consistency across all LexOrbital modules.

## 2. Complete File Tree

```
lexorbital-module-<scope>/
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI GitHub Actions
├── .husky/
│   ├── pre-commit                  # Git hook (lint-staged)
│   └── commit-msg                  # Git hook (commitlint)
├── docs/
│   ├── README.md                   # Documentation index
│   └── [...]                       # Other doc files
├── infra/
│   └── docker-compose.local.yml    # Local infrastructure (optional)
├── src/
│   ├── index.ts                    # Main entry point
│   └── [...]                       # Module source code
├── tests/
│   └── example.test.ts             # Tests (Vitest)
├── .editorconfig                   # Editor configuration
├── .gitignore                      # Git exclusions
├── .prettierignore                 # Prettier exclusions
├── .prettierrc                     # Prettier configuration
├── CHANGELOG.md                    # Version history (auto)
├── CODE_OF_CONDUCT.md              # Code of conduct
├── commitlint.config.ts            # Commitlint configuration
├── CONTRIBUTING.md                 # Contribution guide
├── Dockerfile                      # Module Docker image
├── eslint.config.cjs               # ESLint configuration (flat config)
├── lexorbital.module.json          # ⭐ LexOrbital Manifest (MANDATORY)
├── LICENSE                         # License (MIT recommended)
├── package.json                    # npm/pnpm configuration
├── pnpm-lock.yaml                  # pnpm lock file
├── README.md                       # Main documentation
├── SECURITY.md                     # Security policy
├── SUPPORT.md                      # Support and help
├── tsconfig.json                   # TypeScript configuration
└── vitest.config.ts                # Vitest configuration (optional)
```

## 3. Main Folders

### 3.1. `src/` — Source Code

**Role**: Contains all TypeScript source code for the module.

**Recommended Structure**:

```
@TODO: Add recommended structure
```

**Conventions**:

- One file = one responsibility (single responsibility)
- Exports via `index.ts` (barrel exports)
- No code outside `src/` (except config)

### 3.2. `tests/` — Tests

**Role**: Contains all module tests (unit, integration, e2e).

**Recommended Structure**:

```
@TODO: Add recommended structure
```

**Conventions**:

- Test files: `\*.test.ts`
- Mirrors `src/` structure for unit tests
- At least **1 test** mandatory (healthcheck or functional)

### 3.3. `docs/` — Documentation

**Role**: Detailed module documentation (beyond README).

**Structure**:

```
docs/
├── README.md               # Doc index
├── 00_quick-start.md       # Quick start guide
├── 01_template-structure.md # This sheet
├── [...]                   # Other sheets
└── templates/              # Pandoc templates (optional)
    └── custom.html
```

**Conventions**:

- Markdown format (`.md`)
- Numbered sheets for Pandoc generation
- README as main index

### 3.4. `infra/` — Infrastructure

**Role**: Docker Compose configuration and local infrastructure (databases, caches, etc.).

**Example**:

```
@TODO: Add example
```

**Usage**:

```bash
docker-compose -f infra/docker-compose.local.yml up
```

**Note**: Infrastructure **must not** be deployed by the module, only for local development.

### 3.5. `.github/workflows/` — CI/CD

**Role**: GitHub Actions workflows for continuous integration.

**Main File: `ci.yml`**

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

**Mandatory Steps**:

1. Lint (ESLint)
2. Type check (tsc --noEmit)
3. Tests (Vitest)
4. Build (tsc)

### 3.6. `.husky/` — Git Hooks

**Role**: Automatic Git hooks to ensure code quality.

#### `pre-commit`: Lint before commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**`.lintstagedrc.json` file** (lint-staged configuration):

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml}": ["prettier --write"]
}
```

#### `commit-msg`: Conventional Commits Validation

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit "$1"
```

## 4. Configuration Files

### 4.1. `lexorbital.module.json` ⭐ (MANDATORY)

**Role**: Declarative manifest of the module for LexOrbital integration.

See [[02_module-manifest]] for complete specification.

### 4.2. `package.json`

**Mandatory Scripts**:

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

**Standard Dependencies**:

- `typescript` (≥5.0)
- `eslint` + `@typescript-eslint/*`
- `prettier`
- `vitest`
- `husky` + `lint-staged` + `commitlint`

### 4.3. `tsconfig.json`

**Recommended Strict Configuration**:

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

**Modern ESLint Configuration**:

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

**Prettier Configuration**:

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

**Commitlint Configuration**:

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

**Minimal Multi-Stage Dockerfile**:

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

## 5. Why This Structure?

### 5.1. Consistency

All LexOrbital modules share **exactly the same structure**:

- ✅ Facilitates navigation for developers
- ✅ Enables automation (scripts, CI)
- ✅ Guarantees interoperability with Core

### 5.2. Quality

Integrated tooling ensures:

- ✅ Lint-free code (ESLint + Prettier)
- ✅ Conventional commits (Commitlint)
- ✅ Automatic tests (Vitest + CI)
- ✅ Strict types (TypeScript strict mode)

### 5.3. Autonomy

Each module is **autonomous**:

- ✅ Independent Git repository
- ✅ Own CI/CD
- ✅ SemVer versioning
- ✅ Independent lifecycle

## 6. Compliance Checklist

For a module to be template-compliant:

- [ ] Manifest `lexorbital.module.json` present and valid
- [ ] `package.json` with mandatory scripts (lint, test, build)
- [ ] `tsconfig.json` with strict mode enabled
- [ ] ESLint configured (flat config)
- [ ] Prettier configured
- [ ] Husky + Commitlint installed and active
- [ ] At least 1 test (healthcheck or functional)
- [ ] Dockerfile present (multi-stage recommended)
- [ ] CI GitHub Actions configured (lint, test, build)
- [ ] README.md complete
- [ ] CHANGELOG.md automatically generated
