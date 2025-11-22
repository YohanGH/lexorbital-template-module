# Template Structure

This template provides a standardized structure for all LexOrbital modules.

## Core Folders

- `src/` — Main source code
- `tests/` — Unit tests
- `docs/` — Optional documentation
- `infra/` — Docker Compose and infrastructure configuration

## Configuration Files

- `lexorbital.module.json` — Module manifest (mandatory)
- `package.json` — Node.js package configuration
- `tsconfig.json` — TypeScript configuration
- `Dockerfile` — Minimal containerization (if needed)
- `.editorconfig` — Editor configuration
- `.gitignore` — Git ignore rules
- `README.md` — Project documentation
- `CHANGELOG.md` — Version history

## Tooling Configuration

- `eslint.config.cjs` — ESLint rules
- `.prettierrc` — Prettier formatting
- `commitlint.config.ts` — Commit message validation
- `.husky/` — Git hooks (pre-commit, commit-msg)

## Included Tooling

- **TypeScript** (strict mode)
- **ESLint** + **Prettier** — Code quality and formatting
- **Husky** — Pre-commit and commit-msg hooks
- **Commitlint** — Conventional Commits validation
- **Semantic-release** — Semantic versioning + changelog automation
- **Vitest** — Unit testing framework
- **GitHub Actions** — Minimal CI workflow

All LexOrbital modules **share the exact same skeleton** to ensure consistency and interoperability.
