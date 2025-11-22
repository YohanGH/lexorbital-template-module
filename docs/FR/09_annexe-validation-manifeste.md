# 🔍 Annexe : Validation du Manifeste Module

## Vue d'ensemble

Le système de validation du manifeste garantit que votre module LexOrbital est correctement configuré et conforme aux standards de l'écosystème.

## Composants de Validation

### 1. Schéma JSON (`schemas/module-manifest.schema.json`)

Un schéma JSON Schema complet qui définit :

- **Champs obligatoires** et optionnels
- **Formats** et patterns (semver, URLs, etc.)
- **Énumérations** pour types et couches
- **Règles de validation** personnalisées
- **Contraintes** sur les valeurs par défaut

### 2. Tests Automatisés (`tests/module-manifest.test.ts`)

Suite de tests qui vérifie :

- ✅ Conformité au schéma JSON
- ✅ Personnalisation du template (pas de valeurs par défaut)
- ✅ Présence de tous les champs requis
- ✅ Validité des formats (semver, URLs)
- ✅ Cohérence des types et couches
- ✅ Unicité des tags

### 3. Documentation (`schemas/README.md`)

Guide complet sur :

- Utilisation du schéma
- Règles de validation
- Types et énumérations disponibles
- Exemples et cas d'usage

## 🚀 Utilisation

### Validation Rapide

```bash
# Valider votre manifeste
pnpm test:manifest

# Validation détaillée avec messages d'erreur
pnpm validate:manifest

# Tous les tests (y compris manifeste)
pnpm test:all
```

### Intégration IDE

Le schéma est automatiquement reconnu par les IDEs modernes grâce à la propriété `$schema` dans `lexorbital.module.json` :

```json
{
  "$schema": "./schemas/module-manifest.schema.json",
  ...
}
```

**Fonctionnalités IDE** :

- 🎯 **Autocomplétion** des champs
- 💡 **IntelliSense** avec documentation
- ⚠️ **Validation en temps réel**
- 📝 **Tooltips** avec descriptions

### Validation CI/CD

Les tests de validation sont exécutés automatiquement dans le pipeline CI/CD pour s'assurer que :

1. Le manifeste est valide
2. Tous les champs requis sont présents
3. Le template a été personnalisé
4. Les formats sont corrects

## 📋 Checklist de Personnalisation

Avant de commiter votre module, assurez-vous d'avoir personnalisé :

### Informations de Base

- [ ] `name` : Changé de `lexorbital-template-module` vers `lexorbital-your-module`
- [ ] `description` : Description significative de votre module (pas de référence à "template")
- [ ] `type` : Type approprié pour votre module
- [ ] `version` : Version semver (généralement `0.1.0` pour démarrer)

### Configuration LexOrbital

- [ ] `lexorbital.role` : Rôle spécifique (pas `template-module`)
- [ ] `lexorbital.layer` : Couche architecturale appropriée
- [ ] `lexorbital.tags` : Tags pertinents pour votre module
- [ ] `lexorbital.compatibility.metaKernel` : Version compatible

### Métadonnées

- [ ] `maintainer.name` : Votre nom ou organisation (pas `LexOrbital Core`)
- [ ] `maintainer.contact` : Votre email ou URL de contact
- [ ] `repository.url` : URL de votre repository (pas celle du template)
- [ ] `license` : Licence appropriée (par défaut `MIT`)

### Points d'Entrée

- [ ] `entryPoints.main` : Point d'entrée principal (généralement `dist/index.js`)
- [ ] `entryPoints.types` : Définitions TypeScript (généralement `dist/index.d.ts`)

## 🎯 Types et Couches

### Types de Modules

| Type            | Description              | Exemple                                 |
| --------------- | ------------------------ | --------------------------------------- |
| `utility`       | Utilitaires et helpers   | Fonctions de formatage, helpers de date |
| `service`       | Services métier          | Service d'authentification, API client  |
| `ui-component`  | Composants UI            | Boutons, formulaires, modals            |
| `data-provider` | Fournisseurs de données  | Connecteurs BDD, API wrappers           |
| `middleware`    | Middlewares              | Logging, validation, transformation     |
| `plugin`        | Plugins extensibles      | Extensions, hooks système               |
| `theme`         | Thèmes visuels           | Styles, configurations visuelles        |
| `integration`   | Intégrations tierces     | Stripe, SendGrid, AWS                   |
| `library`       | Bibliothèques génériques | Collections, algorithmes                |

### Couches Architecturales

| Couche           | Description              | Exemples                       |
| ---------------- | ------------------------ | ------------------------------ |
| `infrastructure` | Infrastructure technique | Database, caching, logging     |
| `domain`         | Logique métier           | Entities, business rules       |
| `application`    | Coordination applicative | Use cases, services            |
| `presentation`   | Interface utilisateur    | Components, views, controllers |
| `integration`    | Intégrations externes    | APIs, webhooks, adapters       |

# Tests LexOrbital Template Module

Ce répertoire contient les tests pour le template de module LexOrbital.

## Structure des Tests

### 1. `template-module.test.ts`

Tests de base pour vérifier que la structure du template est fonctionnelle.

**Exécution** :

```bash
pnpm test
```

### 2. `module-manifest.test.ts`

Tests de validation du manifeste `lexorbital.module.json`.

**Exécution** :

```bash
pnpm test:manifest
# ou
pnpm validate:manifest  # avec sortie détaillée
```

## ⚠️ Important : Tests de Validation du Manifeste

Les tests dans `module-manifest.test.ts` **vont échouer par défaut** tant que vous n'avez pas personnalisé votre module. C'est intentionnel !

### Pourquoi ces tests échouent-ils ?

Ces tests vérifient que vous avez bien **personnalisé le template** avec les informations de votre propre module. Ils échouent tant que vous utilisez les valeurs par défaut du template :

- ❌ `name: "lexorbital-template-module"`
- ❌ `lexorbital.role: "template-module"`
- ❌ `maintainer.name: "LexOrbital Core"`
- ❌ `repository.url: "https://github.com/YohanGH/lexorbital-template-module"`

### Comment faire passer ces tests ?

1. **Ouvrez** `lexorbital.module.json`
2. **Modifiez** les champs suivants :

```json
{
  "$schema": "./schemas/module-manifest.schema.json",
  "name": "lexorbital-my-awesome-module", // ✅ Changez ceci
  "description": "My awesome module for...", // ✅ Changez ceci
  "type": "service", // ✅ Choisissez le bon type
  "version": "0.1.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "authentication-service", // ✅ Changez ceci
    "layer": "application", // ✅ Choisissez la bonne couche
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "tags": ["auth", "security"] // ✅ Ajoutez vos tags
  },
  "maintainer": {
    "name": "Your Name", // ✅ Changez ceci
    "contact": "your.email@example.com" // ✅ Changez ceci
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-repo" // ✅ Changez ceci
  },
  "license": "MIT"
}
```

3. **Relancez** les tests :

```bash
pnpm test:manifest
```

### Exemple de Sortie avec Erreurs

Si vous n'avez pas personnalisé le manifeste, vous verrez :

```
🔴 Module Manifest Customization Issues:

❌ Please change the 'name' field from 'lexorbital-template-module' to your module name
❌ Please change 'lexorbital.role' from 'template-module' to your module's actual role
❌ Please update 'maintainer.name' with your name or organization
❌ Please update 'repository.url' with your repository URL
⚠️  Consider updating 'description' to remove references to 'template'

📖 See docs/02_module-manifest.md for more information
```

### Exemple de Sortie Réussie

Une fois le manifeste personnalisé :

```
✓ tests/module-manifest.test.ts > Module Manifest Validation (17 tests) 45ms
  ✓ should load the manifest file
  ✓ should load the schema file
  ✓ should validate the manifest against the JSON schema
  ✓ should have a customized module name
  ✓ should have a meaningful description
  ✓ should have a customized role
  ✓ should have customized maintainer information
  ✓ should have a customized repository URL
  ...

Test Files  1 passed (1)
     Tests  17 passed (17)
```

## Validation du Schéma JSON

Le schéma JSON (`schemas/module-manifest.schema.json`) valide automatiquement :

### Champs Obligatoires

- ✅ `name` : Format `lexorbital-*` (non par défaut)
- ✅ `description` : 10-500 caractères
- ✅ `type` : Un des types valides
- ✅ `version` : Semver valide
- ✅ `entryPoints` : Points d'entrée vers `dist/`
- ✅ `lexorbital` : Configuration complète
- ✅ `maintainer` : Nom et contact
- ✅ `repository` : Type et URL
- ✅ `license` : Identifiant de licence

### Types de Modules Valides

- `utility`, `service`, `ui-component`, `data-provider`
- `middleware`, `plugin`, `theme`, `integration`, `library`

### Couches Architecturales Valides

- `infrastructure`, `domain`, `application`, `presentation`, `integration`

## Intégration CI/CD

Ces tests sont automatiquement exécutés dans le pipeline CI/CD pour garantir que :

1. Le manifeste est valide selon le schéma JSON
2. Tous les champs obligatoires sont présents
3. Le template a été personnalisé (pas de valeurs par défaut)
4. Les versions suivent le format semver
5. Les URLs et formats sont corrects

## Développement Local

### Exécuter Uniquement les Tests du Manifeste

```bash
pnpm test:manifest
```

## Besoin d'Aide ?

Si les tests échouent et que vous ne comprenez pas pourquoi :

1. Lisez les messages d'erreur détaillés
2. Consultez `docs/02_module-manifest.md`
3. Vérifiez que vous avez bien modifié TOUTES les valeurs par défaut
4. Consultez `schemas/README.md` pour les règles de validation

Les tests sont là pour vous guider ! 🎯
