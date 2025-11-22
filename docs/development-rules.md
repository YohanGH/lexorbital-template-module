# Development Rules

Every LexOrbital module **MUST** follow these mandatory rules to be integrated into the Station.

## Mandatory Requirements

### 1. Conventional Commits

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring
- `docs:` — Documentation changes
- `test:` — Test additions/changes
- `chore:` — Maintenance tasks
- `perf:` — Performance improvements
- `feat!:` or `BREAKING CHANGE:` — Breaking changes

### 2. Dockerfile

Every module must include a **Dockerfile** (module-scoped only). The Dockerfile should:

- Be minimal and secure
- Use multi-stage builds when appropriate
- Follow Docker best practices

### 3. Testing

Each module must include:

- **At least one healthcheck test** — Validates the module can start and respond
- **At least one functional test** — Tests core functionality

### 4. Module Manifest

A complete `lexorbital.module.json` manifest is **mandatory**. See [Module Manifest](./module-manifest.md) for details.

### 5. README

Every module must provide a clear `README.md` that explains:

- What the module does
- How to install and use it
- Configuration options
- API documentation (if applicable)

### 6. CI Compliance

The module must pass the included **CI workflow** without errors:

- Lint checks
- Type checking
- Unit tests
- Build process

## Validation

No module can be integrated into the LexOrbital Station without fulfilling all these rules. The CI pipeline will enforce these requirements automatically.

## Best Practices

- Keep modules focused and single-purpose
- Minimize dependencies
- Document all public APIs
- Follow TypeScript strict mode
- Use semantic versioning (see [Versioning Policy](./versioning.md))
