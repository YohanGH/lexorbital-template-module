# Sheet #6: Semantic Versioning (SemVer) {#sheet-6-versioning-semver}

> Automatic versioning policy based on Semantic Versioning and Conventional Commits, ensuring consistent versions and automatically generated changelogs.

## 1. Sheet Objective

Explain the automatic versioning system for LexOrbital modules, based on SemVer and powered by Conventional Commits, with automatic changelog generation.

## 2. Semantic Versioning (SemVer)

### 2.1. Format

**Format**: `MAJOR.MINOR.PATCH`

**Examples**:

- `0.1.0` — Initial development
- `1.0.0` — First stable version
- `1.2.5` — Mature version
- `2.0.0` — Breaking change

### 2.2. Bump Rules

| Version   | When to Bump                               | Example           |
| --------- | ------------------------------------------ | ----------------- |
| **PATCH** | Bug fixes, optimizations                   | `1.0.0` → `1.0.1` |
| **MINOR** | New features (backward compatible)         | `1.0.1` → `1.1.0` |
| **MAJOR** | Breaking changes (non backward compatible) | `1.1.0` → `2.0.0` |

### 2.3. Pre-releases

For development versions:

- `0.1.0-alpha.1` — Alpha (unstable)
- `0.1.0-beta.1` — Beta (complete features, testing in progress)
- `0.1.0-rc.1` — Release Candidate (ready for release)

## 3. Conventional Commits → SemVer

### 3.1. Automatic Mapping

| Commit Type                             | SemVer Impact | Example           |
| --------------------------------------- | ------------- | ----------------- |
| `fix:`                                  | **PATCH**     | `1.0.0` → `1.0.1` |
| `feat:`                                 | **MINOR**     | `1.0.0` → `1.1.0` |
| `feat!:` or `BREAKING CHANGE:`          | **MAJOR**     | `1.0.0` → `2.0.0` |
| `chore:`, `docs:`, `refactor:`, `test:` | **None**      | No release        |

### 3.2. Concrete Examples

#### PATCH (fix)

```bash
git commit -m "fix: correct token expiration bug"
```

**Result**: `1.0.0` → `1.0.1`

**CHANGELOG**:

```markdown
## [1.0.1] - 2025-11-22

### Bug Fixes

- correct token expiration bug ([abc123](https://github.com/...))
```

#### MINOR (feat)

```bash
git commit -m "feat: add OAuth2 Google provider"
```

**Result**: `1.0.1` → `1.1.0`

**CHANGELOG**:

```markdown
## [1.1.0] - 2025-11-22

### Features

- add OAuth2 Google provider ([def456](https://github.com/...))
```

#### MAJOR (breaking change)

```bash
git commit -m "feat!: change AuthService.login() signature

BREAKING CHANGE: login() now requires { email, password } object instead of separate parameters.

Migration: Replace authService.login(email, password) with authService.login({ email, password })"
```

**Result**: `1.1.0` → `2.0.0`

**CHANGELOG**:

```markdown
## [2.0.0] - 2025-11-22

### ⚠ BREAKING CHANGES

- change AuthService.login() signature

login() now requires { email, password } object instead of separate parameters.

**Migration:** Replace `authService.login(email, password)` with `authService.login({ email, password })`

### Features

- change AuthService.login() signature ([ghi789](https://github.com/...))
```

## 4. Semantic-release

### 4.1. Installation

The template already includes `semantic-release`:

```json
{
  "devDependencies": {
    "semantic-release": "^22.0.0",
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/git": "^10.0.1"
  }
}
```

### 4.2. Configuration: `.releaserc.json`

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        "npmPublish": false
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}
```

### 4.3. Plugins

| Plugin                    | Role                                                            |
| ------------------------- | --------------------------------------------------------------- |
| `commit-analyzer`         | Analyzes commits to determine release type                      |
| `release-notes-generator` | Generates release notes from commits                            |
| `changelog`               | Updates `CHANGELOG.md`                                          |
| `npm`                     | Publishes to npm (disabled by default with `npmPublish: false`) |
| `git`                     | Commits changes (CHANGELOG, package.json) and creates a tag     |
| `github`                  | Creates a GitHub Release                                        |

## 5. Automatic Workflow

### 5.1. Release on Push (main)

**GitHub Actions Workflow: `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Semantic Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 5.2. Automatic Process

1. **Push to `main`** → `release` workflow triggers
2. **Semantic-release** analyzes commits since last release
3. **Version determination**:
   - `fix:` commits → PATCH
   - `feat:` commits → MINOR
   - Commits with `BREAKING CHANGE` → MAJOR
4. **CHANGELOG generation** (adds new commits)
5. **Version bump** in `package.json`
6. **Commit** changes: `chore(release): X.Y.Z [skip ci]`
7. **Tag creation** Git: `vX.Y.Z`
8. **Push** commit + tag
9. **GitHub Release creation** with release notes

### 5.3. Result

After a push with `feat: add new feature`:

- ✅ `package.json`: `"version": "1.1.0"`
- ✅ `CHANGELOG.md` updated with new version
- ✅ Git tag: `v1.1.0`
- ✅ GitHub Release created automatically

## 6. Automatic CHANGELOG

### 6.1. Structure

The `CHANGELOG.md` is automatically generated:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-11-22

### Features

- add OAuth2 Google provider ([abc123](https://github.com/.../commit/abc123))
- add 2FA support ([def456](https://github.com/.../commit/def456))

### Bug Fixes

- correct token refresh logic ([ghi789](https://github.com/.../commit/ghi789))

## [1.0.1] - 2025-11-20

### Bug Fixes

- fix password hashing issue ([jkl012](https://github.com/.../commit/jkl012))

## [1.0.0] - 2025-11-15

### Features

- initial release with JWT authentication
```

### 6.2. Commit Groups

Commits are automatically grouped by type:

- **⚠ BREAKING CHANGES** — Breaking changes
- **Features** — New features (`feat:`)
- **Bug Fixes** — Fixes (`fix:`)
- **Performance Improvements** — Optimizations (`perf:`)
- **Reverts** — Commit reverts (`revert:`)

## 7. Manual Release

### 7.1. Dry Run (simulation)

Simulate a release without publishing:

```bash
npx semantic-release --dry-run
```

**Output**:

```
[semantic-release] › ℹ  Start step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[semantic-release] › ℹ  Analyzing commit: feat: add new feature
[semantic-release] › ✔  Completed step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
[semantic-release] › ℹ  The next release version is 1.1.0
```

### 7.2. Local Release

Create a release manually (if not in GitHub Actions):

```bash
npx semantic-release --no-ci
```

⚠️ **Warning**: Requires `GITHUB_TOKEN` and `NPM_TOKEN` environment tokens.

## 8. Branch Management

### 8.1. Release Branches

By default, semantic-release only releases from `main`:

```json
{
  "branches": ["main"]
}
```

### 8.2. Multi-branches (optional)

To support multiple release channels:

```json
{
  "branches": [
    "main",
    {
      "name": "next",
      "prerelease": true
    },
    {
      "name": "beta",
      "prerelease": true
    }
  ]
}
```

**Result**:

- Push to `main` → `1.0.0`
- Push to `next` → `1.1.0-next.1`
- Push to `beta` → `1.1.0-beta.1`

## 9. npm Publication (optional)

### 9.1. Enable Publication

In `.releaserc.json`, remove `"npmPublish": false`:

```json
{
  "plugins": ["@semantic-release/npm"]
}
```

### 9.2. npm Token

Add the `NPM_TOKEN` secret in GitHub:

**Settings → Secrets → Actions → New repository secret**

**Name**: `NPM_TOKEN`  
**Value**: Your npm token (generated on [npmjs.com](https://www.npmjs.com/settings/~/tokens))

### 9.3. npm Scope

To publish a scoped package (e.g., `@lexorbital/module-auth`):

**`package.json`**:

```json
{
  "name": "@lexorbital/module-auth",
  "publishConfig": {
    "access": "public"
  }
}
```

## 10. Best Practices

### 10.1. Squash Commits

Squash PR commits into a single commit:

```bash
git rebase -i HEAD~5
# Squash all commits except the first
# Edit final message to respect Conventional Commits
```

### 10.2. Clear Commit Messages

**Bad**:

```
fix stuff
update code
wip
```

**Good**:

```
fix: correct token expiration calculation
feat: add support for refresh tokens
refactor: extract auth logic into service
```

### 10.3. Manual Changelog (if necessary)

If manual notes are needed in CHANGELOG:

```markdown
## [1.0.0] - 2025-11-22

### Migration Guide

This is a major release with breaking changes. Please follow this guide:

1. Update all imports from `auth` to `@lexorbital/auth`
2. Replace `login(email, password)` with `login({ email, password })`
3. Update environment variables (see README)

## 11. Versioning Checklist

- [ ] All commits follow Conventional Commits
- [ ] `semantic-release` configured in `.releaserc.json`
- [ ] GitHub Actions `release.yml` workflow present
- [ ] `GITHUB_TOKEN` secret available (automatic)
- [ ] `NPM_TOKEN` secret configured (if npm publication)
- [ ] CHANGELOG.md automatically generated
- [ ] Git tags automatically created
- [ ] GitHub Releases automatically created
```
