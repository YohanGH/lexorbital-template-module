# Sheet #0: Quick Start {#sheet-0-quick-start}

## 1. Sheet Objective

Provide a step-by-step guide to install, configure, and use the LexOrbital Module template, enabling developers to quickly create modules that comply with station standards.

## 2. Prerequisites

### 2.1. Required Software

| Tool               | Minimum Version   | Installation                          |
| ------------------ | ----------------- | ------------------------------------- |
| **Node.js**        | ≥24.11.1          | [nodejs.org](https://nodejs.org/)     |
| **pnpm**           | Latest            | `npm install -g pnpm`                 |
| **Git**            | ≥2.0              | [git-scm.com](https://git-scm.com/)   |
| **Docker**         | Latest (optional) | [docker.com](https://www.docker.com/) |
| **Docker Compose** | Latest (optional) | Included with Docker Desktop          |

### 2.2. Required Knowledge

- **TypeScript**: Intermediate level
- **Node.js**: Basics of npm/pnpm and modules
- **Git**: Commits, branches, git subtree (recommended)
- **Docker**: Optional, for containerization

## 3. Installation

### 3.1. Create a Module from the Template

#### Option 1: Via GitHub UI (recommended)

1. Go to [github.com/lexorbital/lexorbital-template-module](https://github.com/lexorbital/lexorbital-template-module)
2. Click **"Use this template"** → **"Create a new repository"**
3. Name the new repository: `lexorbital-module-<scope>`
   - Example: `lexorbital-module-auth`, `lexorbital-module-dossiers`
4. Choose visibility (Public/Private)
5. Click **"Create repository"**

#### Option 2: Via CLI

```bash
# Clone the template
git clone https://github.com/lexorbital/lexorbital-template-module.git lexorbital-module-<scope>
cd lexorbital-module-<scope>

# Remove Git history from template
rm -rf .git
git init
git add .
git commit -m "chore: initial commit from template"

# Link to new remote repository
git remote add origin git@github.com:your-org/lexorbital-module-<scope>.git
git push -u origin main
```

### 3.2. Install Dependencies

```bash
cd lexorbital-module-<scope>
pnpm install
```

This installs:

- **TypeScript** (strict mode)
- **ESLint + Prettier** (quality gates)
- **Vitest** (testing framework)
- **Husky** (git hooks)
- **Commitlint** (conventional commits)
- **Semantic-release** (automatic versioning)

### 3.3. Configure the Module

#### Step 1: Update `package.json`

```json
{
  "name": "lexorbital-module-<scope>",
  "version": "0.1.0",
  "description": "Short description of your module",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/lexorbital-module-<scope>"
  },
  "author": "Your Name <email@example.com>",
  "keywords": ["lexorbital", "module", "<scope>"]
}
```

#### Step 2: Configure `lexorbital.module.json`

```json
{
  "name": "lexorbital-module-<scope>",
  "description": "Description of your module",
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
    "name": "Your Name",
    "contact": "https://github.com/your-org/lexorbital-module-<scope>"
  }
}
```

**Important fields**:

- `type`: `"back"` (backend), `"front"` (frontend), or `"infra"` (infrastructure)
- `lexorbital.role`: Unique module identifier
- `lexorbital.layer`: Integration layer (`"back"`, `"front"`, `"infra"`)
- `env`: Required environment variables

#### Step 3: Update `README.md`

```markdown
# LexOrbital Module - <Scope>

> Short description of the module.

## Installation

```bash
pnpm install
```

## Configuration

Required environment variables:

- `ENV_VAR_1` - Description
- `ENV_VAR_2` - Description

## Usage

```typescript
import { YourService } from 'lexorbital-module-<scope>';

const service = new YourService();
```

## Documentation

See [docs/README.md](./docs/README.md)
```

## 4. Development Commands

### 4.1. Main Commands

```bash
# Development mode (watch mode with hot reload)
pnpm run dev

# Tests (Vitest)
pnpm test

# Tests in watch mode
pnpm run test:ui

# Production build
pnpm run build

# Linting
pnpm run lint

# Automatic lint + format fix
pnpm run lint:fix

# Formatting (Prettier)
pnpm run format

# TypeScript type checking
pnpm run type-check
```

### 4.2. Docker Commands (optional)

```bash
# Build Docker image
pnpm run docker:build

# Start in development mode with Docker
pnpm run docker:dev

# Start with Docker Compose (if infrastructure needed)
docker-compose -f infra/docker-compose.local.yml up
```

## 5. Setup Validation

Before starting development, validate that everything works:

```bash
# 1. Verify Git hooks are active
ls -la .husky/
# Should display: pre-commit, commit-msg

# 2. Run tests
pnpm test
# ✅ Should display at least 1 passing test

# 3. Check lint
pnpm run lint
# ✅ No errors

# 4. Build
pnpm run build
# ✅ Should create dist/ folder

# 5. Test a commit (Conventional Commits)
git add .
git commit -m "test: validate setup"
# ✅ The commitlint hook should validate the message
```

If all these steps pass, your environment is ready! 🎉

## 6. First Development

### 6.1. Starting Structure

The template provides a minimal structure:

```
tests/
└── example.test.ts       # Example test (to adapt)
```

### 6.2. Create Your First Service

```typescript
// src/services/my-service.ts
export class MyService {
  constructor(private readonly config: Config) {}

  async doSomething(): Promise<string> {
    // Your business logic
    return "Hello from MyService"
  }
}
```

### 6.3. Write the Test

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

### 6.4. Commit with Conventional Commits

```bash
git add src/services/my-service.ts tests/my-service.test.ts
git commit -m "feat: add MyService with basic functionality"
```

The `commitlint` hook will automatically validate the format.

## 7. Startup Checklist

- [ ] Node.js ≥24.11.1 installed
- [ ] pnpm installed globally
- [ ] Repository created from template
- [ ] `pnpm install` executed successfully
- [ ] `package.json` updated (name, description, author)
- [ ] `lexorbital.module.json` configured (name, type, role)
- [ ] `README.md` customized
- [ ] Tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm run lint`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] First commit with Conventional Commits validated

## 8. Next Steps

Once setup is validated, consult:

- [[01_template-structure]]: Understand file organization
- [[02_module-manifest]]: Details of `lexorbital.module.json`
- [[03_development-rules]]: Mandatory rules for integration
- [[04_tests-quality]]: Test standards and coverage

## 9. Troubleshooting

### Error: `pnpm: command not found`

```bash
npm install -g pnpm
```

### Error: Git hooks not triggering

```bash
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Error: `commitlint` rejects my commits

Check the format: `type(scope): description`

Valid examples:

- `feat: add new feature`
- `fix: correct bug in service`
- `docs: update README`

### Tests fail after installation

```bash
# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test
```
