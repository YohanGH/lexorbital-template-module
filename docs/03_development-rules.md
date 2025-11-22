# Sheet #3: Development Rules {#sheet-3-development-rules}

## 1. Sheet Objective

Define strict development rules to ensure quality, consistency, and interoperability of all LexOrbital modules. No exceptions are tolerated: these rules are **mandatory** for docking.

## 2. The 7 Golden Rules

### Rule 1: Conventional Commits {#rule-1}

**Status**: ✅ MANDATORY

**Description**: All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

#### Required Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Allowed Types

| Type       | Description               | Example                                |
| ---------- | ------------------------- | -------------------------------------- |
| `feat`     | New feature               | `feat: add OAuth2 support`             |
| `fix`      | Bug fix                   | `fix: correct token expiration`        |
| `refactor` | Refactoring (no feat/fix) | `refactor: extract service logic`      |
| `docs`     | Documentation only        | `docs: update README`                  |
| `test`     | Test additions/changes    | `test: add unit tests for AuthService` |
| `chore`    | Maintenance, config, deps | `chore: update dependencies`           |
| `perf`     | Performance improvement   | `perf: optimize database queries`      |
| `ci`       | CI/CD modification        | `ci: add coverage report`              |
| `revert`   | Revert a commit           | `revert: revert "feat: add feature X"` |

#### Breaking Changes

For breaking changes:

```
feat!: remove deprecated API endpoint

BREAKING CHANGE: The /api/v1/old endpoint has been removed.
Migrate to /api/v2/new instead.
```

#### Enforcement

Conventional Commits are **enforced** by:

- **Husky** (hook `commit-msg`)
- **Commitlint** (format validation)
- **CI** (GitHub Actions)

If the commit does not respect the format, it will be **rejected**.

---

### Rule 2: Mandatory Dockerfile {#rule-2}

**Status**: ✅ MANDATORY

**Description**: Each module **must** include a `Dockerfile` for containerization.

#### Requirements

- ✅ **Multi-stage** Dockerfile (build + production)
- ✅ Official base image (`node:24-alpine` recommended)
- ✅ No secrets in image (use environment variables)
- ✅ Lightest possible image
- ✅ Non-root user (security)

#### Dockerfile Template

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
# Build must succeed
docker build -t lexorbital-module-<scope> .

# Image must start without error
docker run --rm lexorbital-module-<scope>
```

---

### Rule 3: Mandatory Tests {#rule-3}

**Status**: ✅ MANDATORY

**Description**: Each module must include **at minimum**:

1. **A healthcheck test** (validates the module can start)
2. **A functional test** (tests the main functionality)

#### Healthcheck Test (example)

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

#### Functional Test (example)

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

#### Test Coverage (recommended)

- **Goal**: ≥80% coverage
- **Tool**: Vitest with `c8` or `@vitest/coverage-v8`

```bash
pnpm run coverage
```

#### Enforcement

- ✅ Tests executed in CI (`pnpm test`)
- ✅ Build fails if tests fail
- ✅ No merge without passing tests

---

### Rule 4: Complete Manifest {#rule-4}

**Status**: ✅ MANDATORY

**Description**: A **complete and valid** `lexorbital.module.json` file is mandatory.

**See**: [[02_module-manifest]] for complete specification.

#### Required Fields

- ✅ `name` (format `lexorbital-module-<scope>`)
- ✅ `version` (SemVer)
- ✅ `type` (`back`, `front`, `infra`)
- ✅ `entryPoints.main` and `entryPoints.types`
- ✅ `lexorbital.role`
- ✅ `lexorbital.layer`
- ✅ `lexorbital.compatibility.metaKernel`

#### Validation

```bash
# Validate with JSON Schema
npx schemasafe validate lexorbital.module.json
```

### Rule 6: CI Compliance {#rule-6}

**Status**: ✅ MANDATORY

**Description**: The module must **pass** all CI tests without error.

#### Mandatory CI Pipeline

The `.github/workflows/ci.yml` workflow must execute:

1. **Install**: `pnpm install`
2. **Lint**: `pnpm run lint`
3. **Type check**: `pnpm run type-check` (or `tsc --noEmit`)
4. **Tests**: `pnpm test`
5. **Build**: `pnpm run build`

#### Enforcement

- ❌ **No PR can be merged** if CI fails
- ❌ **No module can be docked** if CI is not green

---

### Rule 7: TypeScript Strict Mode {#rule-7}

**Status**: ✅ MANDATORY

**Description**: All modules must use TypeScript in **strict mode**.

#### Enforcement

- ✅ `pnpm run type-check` must pass without error
- ✅ No `@ts-ignore` or `@ts-expect-error` without justification
- ✅ No `any` except exceptional cases (then annotate with `// eslint-disable-line`)

---

## 3. Best Practices (recommended but not mandatory)

### 3.1. Keep Modules Focused

One module = one responsibility (Single Responsibility Principle).

**Examples**:

- ✅ `lexorbital-module-auth`: Authentication only
- ❌ `lexorbital-module-auth-and-files`: Mixed responsibility

### 3.2. Minimize Dependencies

Fewer dependencies = fewer conflict risks.

**Tips**:

- Use Node.js native features when possible
- Avoid large frameworks if a utility is sufficient
- Check licenses of third-party dependencies

### 3.3. Document All Public APIs

Each exported function/class must have JSDoc.

```typescript
/**
 * Authenticates a user by email/password.
 * @param email - User email
 * @param password - Plain password
 * @returns JWT token if authentication succeeds
 * @throws UnauthorizedException if invalid credentials
 */
async login(email: string, password: string): Promise<string> {
  // ...
}
```

## 5. Compliance Checklist

For a module to be **compliant**:

- [ ] ✅ Commits follow Conventional Commits (enforced by Commitlint)
- [ ] ✅ Dockerfile present and functional (multi-stage)
- [ ] ✅ At least 1 healthcheck test + 1 functional test
- [ ] ✅ Complete and valid `lexorbital.module.json` manifest
- [ ] ✅ README.md with all mandatory sections
- [ ] ✅ CI passes without error (lint, type-check, test, build)
- [ ] ✅ TypeScript strict mode enabled
- [ ] ✅ No unjustified ESLint warnings
- [ ] ✅ Code formatted with Prettier

## 6. Consequences of Non-Compliance

### ❌ Automatic Rejection

A module that does **not** comply with these rules will be **automatically rejected** by:

1. **Git hooks** (if Conventional Commits not respected)
2. **CI** (if tests/lint/build fail)
3. **The Meta-Kernel** (if manifest invalid)

### ⚠️ Docking Impossibility

A non-compliant module **cannot be docked** to the LexOrbital station.

### 🔒 PR Blocking

PRs with failing CI are **automatically blocked** (branch protection rules).
