# Sheet #5: CI/CD Workflow {#sheet-5-ci-workflow}

## 1. Sheet Objective

Present the GitHub Actions workflow included in the template, explain each step, and show how to extend it for specific needs.

## 2. Minimal CI Workflow

### 2.1. Pipeline Steps

File: `.github/workflows/ci.yml`

#### Step 1: Checkout Code

```yaml
- uses: actions/checkout@v4
```

**Role**: Clone the Git repository into the GitHub Actions runner.

#### Step 2: Setup Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 24
```

**Role**: Install Node.js version 24 (LTS).

**Matrix strategy**: Allows testing on multiple Node versions (if needed).

#### Step 3: Enable Corepack

```yaml
- run: corepack enable
```

**Role**: Enable Corepack to use pnpm without global installation.

#### Step 4: Install Dependencies

```yaml
- run: pnpm install --frozen-lockfile
```

**Role**: Install exact dependencies from `pnpm-lock.yaml`.

**`--frozen-lockfile`**: Fails if lock file is not up to date (ensures reproducibility).

#### Step 5: Lint

```yaml
- run: pnpm run lint
```

**Role**: Check code quality with ESLint.

**Fails if**: ESLint errors detected.

#### Step 6: Type Check

```yaml
- run: pnpm run type-check
```

**Role**: Check TypeScript types without generating files.

**Command**: `tsc --noEmit`

**Fails if**: Type errors detected.

#### Step 7: Run Tests

```yaml
- run: pnpm test
```

**Role**: Execute all tests with Vitest.

**Fails if**: One or more tests fail.

#### Step 8: Build

```yaml
- run: pnpm run build
```

**Role**: Compile TypeScript code to JavaScript.

**Fails if**: Compilation errors detected.

#### Step 9: Upload Coverage (optional)

```yaml
- uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
    fail_ci_if_error: false
```

**Role**: Send coverage report to Codecov.

**Optional**: Can be removed if Codecov is not used.

## 3. Workflow Triggers

### 3.1. Push on Main Branches

```yaml
on:
  push:
    branches:
      - main
      - develop
```

**When**: On each push to `main` or `develop`.

**Objective**: Ensure main branches always remain green.

### 3.2. Pull Requests

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
```

**When**: On each PR to `main` or `develop`.

**Objective**: Validate code before merge.

## 4. Branch Protection Rules

### 4.1. GitHub Configuration

To enforce CI, configure branch protection rules:

**Settings → Branches → Branch protection rules → Add rule**

**Recommended Rules for `main`**:

- ✅ **Require status checks to pass before merging**
  - ✅ `quality-checks` (CI job name)
- ✅ **Require branches to be up to date before merging**
- ✅ **Require approvals** (at least 1 review)
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require linear history** (no merge commits)
- ✅ **Do not allow bypassing the above settings** (even for admins)

### 4.2. Result

With these rules:

- ❌ **Impossible to merge** a PR if CI fails
- ❌ **Impossible to push directly** to `main` without PR
- ✅ **Guarantee** that only tested and validated code reaches production

## 5. Possible Extensions

### 5.1. Security Tests (Snyk)

Test that Docker image builds correctly:

```yaml
- name: Build Docker image
  run: docker build -t lexorbital-module-test .

- name: Test Docker image
  run: docker run --rm lexorbital-module-test node --version
```

### 5.4. pnpm Publication (CD)

Separate workflow for publication:

```yaml
name: Publish

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: "https://registry.npmjs.org"

      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build

      - name: Publish to pnpm
        run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 5.5. Semantic Release

Automate versioning and changelogs:

```yaml
- name: Semantic Release
  run: npx semantic-release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 6. Deployment (CD)

### 6.1. Important Rule

⚠️ **Deployment (CD) MUST NOT be added to individual modules.**

**Reason**: Modules are deployed **via the LexOrbital station** (`lexorbital-stack`), not individually.

### 6.2. Deployment Workflow

Deployment happens at the `lexorbital-core` level:

1. **Module pushed** → Module repo (CI passes)
2. **Subtree update** → `lexorbital-core` pulls updated module
3. **Deploy station** → `lexorbital-stack` deploys entire station

**Consequence**: Modules only need **CI**, not **CD**.

## 7. CI Monitoring

### 7.1. Status Badges

Add a GitHub Actions badge to README:

```markdown
[![CI](https://github.com/your-org/lexorbital-module-<scope>/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/lexorbital-module-<scope>/actions/workflows/ci.yml)
```

### 7.2. Notifications

Configure Slack/Discord notifications:

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: "CI failed for ${{ github.repository }}"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 8. Optimizations

### 8.1. pnpm Cache

Speed up dependency installation:

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Get pnpm store directory
  id: pnpm-cache
  run: echo "pnpm_cache_dir=$(pnpm store path)" >> $GITHUB_OUTPUT

- name: Cache pnpm modules
  uses: actions/cache@v3
  with:
    path: ${{ steps.pnpm-cache.outputs.pnpm_cache_dir }}
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

### 8.2. Parallel Jobs

Run lint and tests in parallel:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
```

## 9. CI Checklist

For a module to be compliant:

- [ ] Workflow `.github/workflows/ci.yml` present
- [ ] Pipeline executes: install, lint, type-check, test, build
- [ ] CI runs on push and PR
- [ ] All steps pass without error
- [ ] Branch protection rules configured
- [ ] Status badge in README (optional)

## 10. Troubleshooting

### Error: `pnpm: command not found`

**Solution**: Add `corepack enable` before `pnpm install`.

### Error: Lock File Out of Date

**Solution**: Update lock file locally and commit:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lock file"
```

### Tests Fail in CI but Pass Locally

**Possible Causes**:

- Missing environment variables
- Timezone difference (UTC in CI vs local)
- Non-reproducible dependencies

**Solution**: Use `--frozen-lockfile` and define variables in GitHub Secrets.
