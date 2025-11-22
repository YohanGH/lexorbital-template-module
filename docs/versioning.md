# Versioning Policy

LexOrbital modules follow **strict Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

## Version Bumps

### MINOR (0.1.0 → 0.2.0)

- `feat:` commits (without breaking changes)
- New features that are backward compatible
- Automatically updates CHANGELOG

### PATCH (0.1.0 → 0.1.1)

- `fix:` commits — Bug fixes
- `perf:` commits — Performance optimizations
- Safe corrections that don't change the API

### MAJOR (0.1.0 → 1.0.0)

- `feat!:` commits — Breaking changes
- Any commit with `BREAKING CHANGE:` in the footer
- Changes that require consumers to update their code

### No Release

- `chore:` commits — Maintenance tasks
- `docs:` commits — Documentation updates only
- `refactor:` commits — Code refactoring without breaking changes
- `test:` commits — Test-only changes

## Automated Versioning

This template uses **semantic-release** to automatically:

- Analyze commit messages
- Determine the next version
- Generate CHANGELOG entries
- Create git tags
- Publish releases (if configured)

## Manual Release

To manually trigger a release:

```bash
pnpm run release
```

This will:

1. Analyze commits since last release
2. Bump version according to SemVer rules
3. Update CHANGELOG.md
4. Create a git tag
5. Commit changes

## CHANGELOG

The `CHANGELOG.md` is automatically maintained. Each release includes:

- Version number and date
- List of changes grouped by type (Features, Fixes, etc.)
- Breaking changes highlighted
