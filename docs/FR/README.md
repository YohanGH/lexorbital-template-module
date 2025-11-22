# Guide LexOrbital Module Template

Guide complet du template LexOrbital Module : création, développement, tests, intégration et déploiement de modules compatibles avec la station orbitale.

## Table des matières

0. [Démarrage rapide](#fiche-0-demarrage-rapide)
1. [Structure du template](#fiche-1-structure-template)
2. [Manifeste de module](#fiche-2-manifeste-module)
3. [Règles de développement](#fiche-3-regles-developpement)
4. [Tests et qualité](#fiche-4-tests-qualite)
5. [CI/CD Workflow](#fiche-5-ci-workflow)
6. [Versioning Semantic (SemVer)](#fiche-6-versioning-semver)
7. [Intégration avec LexOrbital Core](#fiche-7-integration-core)
8. [Sources et références](#fiche-8-sources-et-references)
9. [Annexe : Validation du manifeste](#fiche-9-annexe-validation-manifeste)

## Présentation

Le **LexOrbital Module Template** est un template standardisé pour créer des modules compatibles avec la station orbitale LexOrbital. Il inclut :

- ⚙️ **Configuration complète** : TypeScript, ESLint, Prettier, Husky, Commitlint
- 🧪 **Tests pré-configurés** : Vitest avec couverture de code
- 🔄 **CI/CD** : GitHub Actions avec quality gates
- 📦 **Versioning automatique** : Semantic-release basé sur Conventional Commits
- 🐳 **Dockerfile** : Containerisation multi-stage prête à l'emploi
- 📝 **Documentation** : Structure Markdown → Pandoc (HTML/PDF/DOCX)

## Organisation de la documentation

### Fiches techniques (00–07)

Les **8 fiches numérotées** couvrent tous les aspects du développement de modules :

| Fiche  | Titre                            | Contenu                                     |
| ------ | -------------------------------- | ------------------------------------------- |
| **00** | Démarrage rapide                 | Installation, configuration, premier module |
| **01** | Structure du template            | Arborescence, fichiers, organisation        |
| **02** | Manifeste de module              | Format `lexorbital.module.json` (MANDATORY) |
| **03** | Règles de développement          | 7 règles obligatoires pour intégration      |
| **04** | Tests et qualité                 | Standards de tests, couverture, outils      |
| **05** | CI/CD Workflow                   | Pipeline GitHub Actions, quality gates      |
| **06** | Versioning SemVer                | Semantic Versioning automatique             |
| **07** | Intégration Core                 | Git subtree, amarrage, découverte           |
| **08** | Sources et références            | Sources et références utilisées             |
| **09** | Annexe : Validation du manifeste | Validation JSON Schema et tests             |

### Documentation supplémentaire

- **QUICKSTART.md** : Guide d'installation et utilisation rapide
- **legal/sources.md** : Sources et références utilisées

### Configurer le module

1. **Mettre à jour `package.json`** : name, description, author
2. **Configurer `lexorbital.module.json`** : name, type, role, compatibility
3. **Personnaliser `README.md`**
4. **Développer** votre module dans `src/`
5. **Tester** avec `pnpm test`
6. **Commit** avec Conventional Commits : `git commit -m "feat: add my feature"`

## Règles obligatoires (MANDATORY)

Pour qu'un module soit intégré à LexOrbital, il **doit** respecter :

1. ✅ **Conventional Commits** (enforced par Commitlint)
2. ✅ **Dockerfile** présent et fonctionnel
3. ✅ **Tests obligatoires** (min. healthcheck + fonctionnel)
4. ✅ **Manifeste complet** (`lexorbital.module.json`)
5. ✅ **README complet** avec instructions d'installation
6. ✅ **CI compliance** (lint, type-check, test, build)
7. ✅ **TypeScript strict mode** activé

**Non-négociable** : Ces règles sont enforced automatiquement par Husky, Commitlint et la CI.

## Contribuer à la documentation

### Ajouter une nouvelle fiche

1. Créer un fichier `docs/NN_titre-fiche.md` (NN = numéro à 2 chiffres)
2. Utiliser le template d'en-tête :

```markdown
# Fiche n°N : Titre de la fiche {#fiche-N-titre}

Résumé en 2-3 phrases.

## 1. Objectif de la fiche

## 2. Concepts et décisions clés

## 3. Implications techniques

## 4. Checklist de mise en œuvre

## 5. À retenir

## 6. Liens connexes
```

3. Ajouter une entrée dans la table des matières du `README.md`
4. Régénérer la doc : `./scripts/generate-docs.sh`

### Mettre à jour une fiche existante

1. Éditer le fichier `docs/NN_*.md` concerné
2. Respecter la structure (sections numérotées, IDs explicites)
3. Commit avec Conventional Commits : `docs(fiche-N): description`
4. Régénérer la doc automatiquement (CI/CD GitHub Actions)

## Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](../LICENSE) à la racine du projet.

## Support

Pour toute question ou contribution, consultez :

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guide de contribution
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Code de conduite
- [GitHub Issues](https://github.com/lexorbital/lexorbital-template-module/issues) - Signaler un bug ou proposer une fonctionnalité
