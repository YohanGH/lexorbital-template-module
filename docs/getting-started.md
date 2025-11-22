# Getting Started

## Prerequisites

- Node.js (>=24.11.1)
- pnpm (or npm/yarn)
- Docker & Docker Compose (optional, for infrastructure)

## Installation

```bash
pnpm install
```

## Create a New Module

1. **Use this template** — Enable this repo as a GitHub Template, then click **Use this template** to generate `lexorbital-module-<scope>`.

2. **Rename the package** — Align both the repository name and the `package.json` `name` field with the required `lexorbital-module-` prefix.

3. **Install dependencies** — Run `pnpm install` to pull TypeScript, ESLint, Vitest, Husky, and Commitlint.

4. **Adjust metadata** — Update `package.json` (`description`, `repository`, `author`, scripts) along with `lexorbital.module.json` and `README.md` before pushing the module.

5. **Validate the baseline** — Run `pnpm run lint`, `pnpm test`, and `pnpm run build` to ensure CI passes before adding your features.

## Development Commands

```bash
# Development (watch mode)
pnpm run dev

# Testing
pnpm test

# Production build
pnpm run build

# Linting
pnpm run lint
pnpm run lint:fix

# Formatting
pnpm run format

# Docker (optional)
pnpm run docker:dev
```

## Next Steps

- Read about the [Template Structure](./template-structure.md)
- Understand the [Module Manifest](./module-manifest.md)
- Review [Development Rules](./development-rules.md)
