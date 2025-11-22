# Sheet #7: Integration with LexOrbital Core {#sheet-7-core-integration}

How modules are discovered, validated, and docked to the LexOrbital Core station via **git subtree**, while maintaining their autonomy and independent repository.

## 1. Sheet Objective

Explain the module integration process into `lexorbital-core`, the use of git subtree, autonomy rules, and the update workflow.

## 2. Integration Principle

### 2.1. Autonomous Modules, Unified Station

**Concept**: Each module is an **independent Git repository**, but all are **integrated** into `lexorbital-core` to form the complete station.

```
lexorbital-module-auth       ← Independent repository
lexorbital-module-dossiers   ← Independent repository
lexorbital-module-documents  ← Independent repository
           ↓
   lexorbital-core
      ├── modules/
      │   ├── auth/         ← git subtree of lexorbital-module-auth
      │   ├── dossiers/     ← git subtree of lexorbital-module-dossiers
      │   └── documents/    ← git subtree of lexorbital-module-documents
```

### 2.2. Why git subtree?

**Advantages**:

- ✅ **Transparency**: Module code is physically present in `lexorbital-core`
- ✅ **Simple clone**: `git clone lexorbital-core` is sufficient, no submodules
- ✅ **Preserved history**: Module history is merged into Core
- ✅ **Autonomy**: Module can evolve independently
- ✅ **Contribution**: Easy to push changes upstream

**Vs git submodule**:

| Criterion          | git subtree              | git submodule                    |
| ------------------ | ------------------------ | -------------------------------- |
| **Clone**          | Simple (`git clone`)     | Complex (`--recurse-submodules`) |
| **Code Present**   | ✅ Yes                   | ❌ No (reference only)           |
| **Detached State** | ✅ No                    | ❌ Yes (detached HEAD)           |
| **Contribution**   | ✅ Easy (`subtree push`) | ❌ Complex                       |

## 3. Module Docking (Initial Docking)

### 3.1. git subtree add Command

From the `lexorbital-core` repository:

```bash
git subtree add \
  --prefix=modules/auth \
  git@github.com:lexorbital/lexorbital-module-auth.git \
  main \
  --squash
```

**Parameters**:

- `--prefix=modules/auth`: Where to place the module in the monorepo
- `git@github.com:...`: Module repository URL
- `main`: Branch to integrate
- `--squash`: Merge history into a single commit (recommended)

### 3.2. Docking Script

The Core provides a script to simplify:

**`lexorbital-core/scripts/add-module.sh`**

```bash
#!/bin/bash
set -e

MODULE_NAME=$1
MODULE_REPO=$2
MODULE_BRANCH=${3:-main}

if [ -z "$MODULE_NAME" ] || [ -z "$MODULE_REPO" ]; then
  echo "Usage: ./scripts/add-module.sh <module-name> <repo-url> [branch]"
  echo "Example: ./scripts/add-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git"
  exit 1
fi

echo "🛰️  Docking module ${MODULE_NAME}..."

git remote add -f "${MODULE_NAME}-remote" "$MODULE_REPO"
git subtree add --prefix="modules/${MODULE_NAME}" "${MODULE_NAME}-remote" "$MODULE_BRANCH" --squash
git remote remove "${MODULE_NAME}-remote"

echo "✅ Module ${MODULE_NAME} docked successfully in modules/${MODULE_NAME}"
```

**Usage**:

```bash
cd lexorbital-core
./scripts/add-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git
```

### 3.3. Post-Docking Verification

After docking, verify:

```bash
# 1. Module is present
ls -la modules/auth/

# 2. Manifest is valid
cat modules/auth/lexorbital.module.json

# 3. Meta-Kernel detects the module
pnpm run start:dev
# Logs: "✅ Module auth-module loaded successfully"
```

## 4. Module Update (Pull Upstream)

### 4.1. git subtree pull Command

From `lexorbital-core`, to update a module:

```bash
git subtree pull \
  --prefix=modules/auth \
  git@github.com:lexorbital/lexorbital-module-auth.git \
  main \
  --squash
```

### 4.2. Update Script

**`lexorbital-core/scripts/update-module.sh`**

```bash
#!/bin/bash
set -e

MODULE_NAME=$1
MODULE_REPO=$2
MODULE_BRANCH=${3:-main}

if [ -z "$MODULE_NAME" ] || [ -z "$MODULE_REPO" ]; then
  echo "Usage: ./scripts/update-module.sh <module-name> <repo-url> [branch]"
  exit 1
fi

echo "🔄 Updating module ${MODULE_NAME}..."

git remote add -f "${MODULE_NAME}-remote" "$MODULE_REPO" 2>/dev/null || true
git subtree pull --prefix="modules/${MODULE_NAME}" "${MODULE_NAME}-remote" "$MODULE_BRANCH" --squash
git remote remove "${MODULE_NAME}-remote" 2>/dev/null || true

echo "✅ Module ${MODULE_NAME} updated successfully"
```

**Usage**:

```bash
./scripts/update-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git
```

### 4.3. Conflict Resolution

If conflicts occur during pull:

```bash
# 1. Manually resolve conflicts
git status
# Conflicted files listed

# 2. Edit files to resolve conflicts
code modules/auth/src/service.ts

# 3. Mark as resolved
git add modules/auth/src/service.ts

# 4. Continue merge
git commit
```

## 5. Contributing to a Module (Push Upstream)

### 5.1. Golden Rule: Do NOT Modify in lexorbital-core

⚠️ **IMPORTANT**: Modifications **must** be made in the module repository, **not** in `lexorbital-core/modules/`.

**Reason**:

- Maintain module autonomy
- Preserve module Git history
- Avoid desynchronization

### 5.2. Recommended Workflow

#### Step 1: Clone Module Separately

```bash
git clone git@github.com:lexorbital/lexorbital-module-auth.git
cd lexorbital-module-auth
```

#### Step 2: Develop in Module

```bash
# Create feature branch
git checkout -b feat/add-oauth2

# Develop
# ... modifications ...

# Commit (Conventional Commits)
git add .
git commit -m "feat: add OAuth2 Google provider"

# Tests
pnpm test

# Push
git push origin feat/add-oauth2
```

#### Step 3: Pull Request

Create a PR on the module repository (`lexorbital-module-auth`).

#### Step 4: Merge

Once PR is merged into module `main`.

#### Step 5: Update Core

```bash
cd lexorbital-core
./scripts/update-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git
```

### 5.3. Exceptional Case: git subtree push

If a modification **absolutely must** be made in `lexorbital-core` (critical hotfix), we can push to the module:

```bash
git subtree push \
  --prefix=modules/auth \
  git@github.com:lexorbital/lexorbital-module-auth.git \
  hotfix-branch
```

⚠️ **Warning**: This command can be **very slow** (it filters entire history).

**Alternative Workflow** (faster):

```bash
# 1. Extract subdirectory
git subtree split --prefix=modules/auth -b temp-auth-branch

# 2. Push to module
git push git@github.com:lexorbital/lexorbital-module-auth.git temp-auth-branch:hotfix

# 3. Cleanup
git branch -D temp-auth-branch
```

## 6. Module Discovery by Meta-Kernel

### 6.1. Automatic Scan

On startup, the Meta-Kernel scans all subdirectories of `modules/`:

```typescript
// meta-kernel/src/core/module-loader.service.ts
async discoverModules(): Promise<ModuleManifest[]> {
  const modulesDir = path.join(__dirname, '../../../modules');
  const modules: ModuleManifest[] = [];

  const dirs = await fs.readdir(modulesDir, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;

    const manifestPath = path.join(modulesDir, dir.name, 'lexorbital.module.json');

    if (await fs.pathExists(manifestPath)) {
      const manifest = await fs.readJSON(manifestPath);
      modules.push(manifest);
    }
  }

  return modules;
}
```

### 6.2. Manifest Validation

For each discovered module, the Meta-Kernel validates:

```typescript
validateManifest(manifest: ModuleManifest): void {
  // 1. Required fields
  if (!manifest.name) throw new Error('Missing field: name');
  if (!manifest.version) throw new Error('Missing field: version');
  if (!manifest.type) throw new Error('Missing field: type');

  // 2. Name format
  if (!manifest.name.startsWith('lexorbital-module-')) {
    throw new Error('Module name must start with "lexorbital-module-"');
  }

  // 3. Compatibility
  if (!semver.satisfies(CORE_VERSION, manifest.lexorbital.compatibility.metaKernel)) {
    throw new Error(`Module incompatible with Core version ${CORE_VERSION}`);
  }

  // 4. Dependencies
  for (const dep of manifest.lexorbital.dependencies?.required || []) {
    if (!this.loadedModules.has(dep)) {
      throw new Error(`Missing required dependency: ${dep}`);
    }
  }
}
```

### 6.3. Dynamic Loading

Once validated, the module is loaded:

```typescript
async loadModule(manifestPath: string): Promise<void> {
  const manifest = await fs.readJSON(manifestPath);
  this.validateManifest(manifest);

  // Dynamic loading (ESM)
  const modulePath = path.dirname(manifestPath);
  const entryPoint = path.join(modulePath, manifest.entryPoints.main);

  const moduleExports = await import(entryPoint);

  // Registration
  this.loadedModules.set(manifest.lexorbital.role, {
    manifest,
    exports: moduleExports,
  });

  console.log(`✅ Module ${manifest.lexorbital.role} loaded successfully`);
}
```

## 7. Module Undocking

### 7.1. Command

```bash
git rm -r modules/auth
git commit -m "chore: remove auth module"
```

### 7.2. Undocking Script

**`lexorbital-core/scripts/remove-module.sh`**

```bash
#!/bin/bash
set -e

MODULE_NAME=$1

if [ -z "$MODULE_NAME" ]; then
  echo "Usage: ./scripts/remove-module.sh <module-name>"
  exit 1
fi

echo "🗑️  Undocking module ${MODULE_NAME}..."

git rm -r "modules/${MODULE_NAME}"
git commit -m "chore(modules): remove ${MODULE_NAME}"

echo "✅ Module ${MODULE_NAME} undocked successfully"
```

### 7.3. Pre-Undocking Checks

- [ ] No other module depends on it (check manifest `dependencies`)
- [ ] Remove module references in Core config
- [ ] Test that station starts without the module

## 8. Module Replacement

### 8.1. Use Case

Replace a module with a new implementation (same interface, different implementation).

**Example**: Replace `auth-module-jwt` with `auth-module-oauth`.

### 8.2. Workflow

```bash
# 1. Undock old module
./scripts/remove-module.sh auth-jwt

# 2. Dock new module
./scripts/add-module.sh auth-oauth git@github.com:lexorbital/lexorbital-module-auth-oauth.git

# 3. Update config (if necessary)
# Edit lexorbital-core/.env or config files

# 4. Test
pnpm run start:dev
```

## 9. Integration Checklist

For a module to be docked:

- [ ] Valid `lexorbital.module.json` manifest
- [ ] Version compatible with Meta-Kernel
- [ ] Required dependencies already loaded
- [ ] Tests pass in module (CI green)
- [ ] Documentation up to date
- [ ] Functional Dockerfile
- [ ] Module docked via `git subtree add`
- [ ] Meta-Kernel detects and loads module without error
