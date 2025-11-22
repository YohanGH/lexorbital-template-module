# Fiche n°7 : Intégration avec LexOrbital Core {#fiche-7-integration-core}

## 1. Objectif de la fiche

Expliquer le processus d'intégration des modules dans `lexorbital-core`, l'utilisation de git subtree, les règles d'autonomie et le workflow de mise à jour.

## 2. Principe d'intégration

### 2.1. Modules autonomes, station unifiée

**Concept** : Chaque module est un **dépôt Git indépendant**, mais tous sont **intégrés** dans `lexorbital-core` pour former la station complète.

```
lexorbital-module-auth       ← Dépôt indépendant
lexorbital-module-dossiers   ← Dépôt indépendant
lexorbital-module-documents  ← Dépôt indépendant
           ↓
   lexorbital-core
      ├── modules/
      │   ├── auth/         ← git subtree de lexorbital-module-auth
      │   ├── dossiers/     ← git subtree de lexorbital-module-dossiers
      │   └── documents/    ← git subtree de lexorbital-module-documents
```

### 2.2. Pourquoi git subtree ?

**Avantages** :

- ✅ **Transparence** : Le code du module est physiquement présent dans `lexorbital-core`
- ✅ **Clone simple** : `git clone lexorbital-core` suffit, pas de submodules
- ✅ **Historique préservé** : L'historique du module est fusionné dans le Core
- ✅ **Autonomie** : Le module peut évoluer indépendamment
- ✅ **Contribution** : Facile de pousser des changements upstream

**Vs git submodule** :

| Critère          | git subtree                | git submodule                     |
| ---------------- | -------------------------- | --------------------------------- |
| **Clone**        | Simple (`git clone`)       | Complexe (`--recurse-submodules`) |
| **Code présent** | ✅ Oui                     | ❌ Non (référence uniquement)     |
| **État détaché** | ✅ Non                     | ❌ Oui (detached HEAD)            |
| **Contribution** | ✅ Facile (`subtree push`) | ❌ Complexe                       |

## 3. Amarrage d'un module (Initial Docking)

### 3.1. Commande git subtree add

Depuis le dépôt `lexorbital-core` :

```bash
git subtree add \
  --prefix=modules/auth \
  git@github.com:lexorbital/lexorbital-module-auth.git \
  main \
  --squash
```

**Paramètres** :

- `--prefix=modules/auth` : Où placer le module dans le monorepo
- `git@github.com:...` : URL du dépôt du module
- `main` : Branche à intégrer
- `--squash` : Fusionner l'historique en un seul commit (recommandé)

### 3.2. Script d'amarrage

Le Core fournit un script pour simplifier :

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

echo "🛰️  Amarrage du module ${MODULE_NAME}..."

git remote add -f "${MODULE_NAME}-remote" "$MODULE_REPO"
git subtree add --prefix="modules/${MODULE_NAME}" "${MODULE_NAME}-remote" "$MODULE_BRANCH" --squash
git remote remove "${MODULE_NAME}-remote"

echo "✅ Module ${MODULE_NAME} amarré avec succès dans modules/${MODULE_NAME}"
```

**Usage** :

```bash
cd lexorbital-core
./scripts/add-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git
```

### 3.3. Vérification post-amarrage

Après l'amarrage, vérifier :

```bash
# 1. Le module est présent
ls -la modules/auth/

# 2. Le manifeste est valide
cat modules/auth/lexorbital.module.json

# 3. Le Meta-Kernel détecte le module
pnpm run start:dev
# Logs : "✅ Module auth-module chargé avec succès"
```

## 4. Mise à jour d'un module (Pull Upstream)

### 4.1. Commande git subtree pull

Depuis `lexorbital-core`, pour mettre à jour un module :

```bash
git subtree pull \
  --prefix=modules/auth \
  git@github.com:lexorbital/lexorbital-module-auth.git \
  main \
  --squash
```

### 4.2. Script de mise à jour

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

echo "🔄 Mise à jour du module ${MODULE_NAME}..."

git remote add -f "${MODULE_NAME}-remote" "$MODULE_REPO" 2>/dev/null || true
git subtree pull --prefix="modules/${MODULE_NAME}" "${MODULE_NAME}-remote" "$MODULE_BRANCH" --squash
git remote remove "${MODULE_NAME}-remote" 2>/dev/null || true

echo "✅ Module ${MODULE_NAME} mis à jour avec succès"
```

**Usage** :

```bash
./scripts/update-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git
```

### 4.3. Résolution de conflits

Si des conflits surviennent lors du pull :

```bash
# 1. Résoudre manuellement les conflits
git status
# Fichiers en conflit listés

# 2. Éditer les fichiers pour résoudre les conflits
code modules/auth/src/service.ts

# 3. Marquer comme résolu
git add modules/auth/src/service.ts

# 4. Continuer le merge
git commit
```

## 5. Contribution à un module (Push Upstream)

### 5.1. Règle d'or : Ne PAS modifier dans lexorbital-core

⚠️ **IMPORTANT** : Les modifications **doivent** être faites dans le dépôt du module, **pas** dans `lexorbital-core/modules/`.

**Raison** :

- Maintenir l'autonomie du module
- Préserver l'historique Git du module
- Éviter les désynchronisations

### 5.2. Workflow recommandé

#### Étape 1 : Cloner le module séparément

```bash
git clone git@github.com:lexorbital/lexorbital-module-auth.git
cd lexorbital-module-auth
```

#### Étape 2 : Développer dans le module

```bash
# Créer une branche feature
git checkout -b feat/add-oauth2

# Développer
# ... modifications ...

# Commit (Conventional Commits)
git add .
git commit -m "feat: add OAuth2 Google provider"

# Tests
pnpm test

# Push
git push origin feat/add-oauth2
```

#### Étape 3 : Pull Request

Créer une PR sur le dépôt du module (`lexorbital-module-auth`).

#### Étape 4 : Merge

Une fois la PR mergée dans `main` du module.

#### Étape 5 : Mettre à jour le Core

```bash
cd lexorbital-core
./scripts/update-module.sh auth git@github.com:lexorbital/lexorbital-module-auth.git
```

### 5.3. Cas exceptionnel : git subtree push

Si une modification **doit absolument** être faite dans `lexorbital-core` (hotfix critique), on peut pousser vers le module :

```bash
git subtree push \
  --prefix=modules/auth \
  git@github.com:lexorbital/lexorbital-module-auth.git \
  hotfix-branch
```

⚠️ **Attention** : Cette commande peut être **très lente** (elle filtre tout l'historique).

**Workflow alternatif** (plus rapide) :

```bash
# 1. Extraire le sous-répertoire
git subtree split --prefix=modules/auth -b temp-auth-branch

# 2. Push vers le module
git push git@github.com:lexorbital/lexorbital-module-auth.git temp-auth-branch:hotfix

# 3. Nettoyer
git branch -D temp-auth-branch
```

## 6. Découverte des modules par le Meta-Kernel

### 6.1. Scan automatique

Au démarrage, le Meta-Kernel scanne tous les sous-dossiers de `modules/` :

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

### 6.2. Validation du manifeste

Pour chaque module découvert, le Meta-Kernel valide :

```typescript
validateManifest(manifest: ModuleManifest): void {
  // 1. Champs obligatoires
  if (!manifest.name) throw new Error('Missing field: name');
  if (!manifest.version) throw new Error('Missing field: version');
  if (!manifest.type) throw new Error('Missing field: type');

  // 2. Format du nom
  if (!manifest.name.startsWith('lexorbital-module-')) {
    throw new Error('Module name must start with "lexorbital-module-"');
  }

  // 3. Compatibilité
  if (!semver.satisfies(CORE_VERSION, manifest.lexorbital.compatibility.metaKernel)) {
    throw new Error(`Module incompatible with Core version ${CORE_VERSION}`);
  }

  // 4. Dépendances
  for (const dep of manifest.lexorbital.dependencies?.required || []) {
    if (!this.loadedModules.has(dep)) {
      throw new Error(`Missing required dependency: ${dep}`);
    }
  }
}
```

### 6.3. Chargement dynamique

Une fois validé, le module est chargé :

```typescript
async loadModule(manifestPath: string): Promise<void> {
  const manifest = await fs.readJSON(manifestPath);
  this.validateManifest(manifest);

  // Chargement dynamique (ESM)
  const modulePath = path.dirname(manifestPath);
  const entryPoint = path.join(modulePath, manifest.entryPoints.main);

  const moduleExports = await import(entryPoint);

  // Enregistrement
  this.loadedModules.set(manifest.lexorbital.role, {
    manifest,
    exports: moduleExports,
  });

  console.log(`✅ Module ${manifest.lexorbital.role} chargé avec succès`);
}
```

## 7. Désamarrage d'un module

### 7.1. Commande

```bash
git rm -r modules/auth
git commit -m "chore: remove auth module"
```

### 7.2. Script de désamarrage

**`lexorbital-core/scripts/remove-module.sh`**

```bash
#!/bin/bash
set -e

MODULE_NAME=$1

if [ -z "$MODULE_NAME" ]; then
  echo "Usage: ./scripts/remove-module.sh <module-name>"
  exit 1
fi

echo "🗑️  Désamarrage du module ${MODULE_NAME}..."

git rm -r "modules/${MODULE_NAME}"
git commit -m "chore(modules): remove ${MODULE_NAME}"

echo "✅ Module ${MODULE_NAME} désamarré avec succès"
```

### 7.3. Vérifications avant désamarrage

- [ ] Aucun autre module ne dépend de celui-ci (vérifier les `dependencies` des manifestes)
- [ ] Supprimer les références au module dans la config du Core
- [ ] Tester que la station démarre sans le module

## 8. Remplacement d'un module

### 8.1. Cas d'usage

Remplacer un module par une nouvelle implémentation (même interface, implémentation différente).

**Exemple** : Remplacer `auth-module-jwt` par `auth-module-oauth`.

### 8.2. Workflow

```bash
# 1. Désamarrer l'ancien module
./scripts/remove-module.sh auth-jwt

# 2. Amarrer le nouveau module
./scripts/add-module.sh auth-oauth git@github.com:lexorbital/lexorbital-module-auth-oauth.git

# 3. Mettre à jour la config (si nécessaire)
# Éditer lexorbital-core/.env ou config files

# 4. Tester
pnpm run start:dev
```

## 9. Checklist d'intégration

Pour qu'un module soit amarré :

- [ ] Manifeste `lexorbital.module.json` valide
- [ ] Version compatible avec le Meta-Kernel
- [ ] Dépendances requises déjà chargées
- [ ] Tests passent dans le module (CI verte)
- [ ] Documentation à jour
- [ ] Dockerfile fonctionnel
- [ ] Module amarré via `git subtree add`
- [ ] Meta-Kernel détecte et charge le module sans erreur
