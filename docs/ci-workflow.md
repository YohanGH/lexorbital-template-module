# CI/CD Workflow

A minimal GitHub Actions workflow is included in every module template.

## CI Pipeline

The CI workflow runs on every push and pull request:

1. **Install** — Install dependencies using pnpm
2. **Lint** — Run ESLint to check code quality
3. **Type Check** — Validate TypeScript types
4. **Test** — Run unit tests with Vitest
5. **Build** — Compile TypeScript to JavaScript

## Workflow File

The workflow is located at `.github/workflows/ci.yml` (or similar). It ensures:

- Code quality standards are met
- Tests pass before merging
- The module builds successfully
- Type safety is maintained

## Deployment (CD)

**Important:** Deployment (CD) belongs to the **LexOrbital Station** (`lexorbital-stack`) and must **not** be added to individual modules.

Modules are deployed as part of the Station's deployment pipeline, not independently.

## Customization

You can extend the CI workflow to:

- Add additional test suites
- Run security scans
- Generate coverage reports
- Publish to npm (if applicable)

However, keep the core pipeline intact to maintain consistency across all LexOrbital modules.
