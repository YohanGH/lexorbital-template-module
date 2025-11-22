# LexOrbital Module Template Guide

Complete guide for the LexOrbital Module template: creation, development, testing, integration and deployment of modules compatible with the orbital station.

## Table of Contents

0. [Quick Start](00_quick-start.md)
1. [Template Structure](01_template-structure.md)
2. [Module Manifest](02_module-manifest.md)
3. [Development Rules](03_development-rules.md)
4. [Tests and Quality](04_tests-quality.md)
5. [CI/CD Workflow](05_ci-workflow.md)
6. [Semantic Versioning (SemVer)](06_versioning-semver.md)
7. [Integration with LexOrbital Core](07_core-integration.md)
8. [Sources](08_sources.md)
9. [Appendix : Manifest Validation](09_appendix-manifest-validation.md)

## Overview

The **LexOrbital Module Template** is a standardized template for creating modules compatible with the LexOrbital orbital station. It includes:

- ⚙️ **Complete configuration**: TypeScript, ESLint, Prettier, Husky, Commitlint
- 🧪 **Pre-configured tests**: Vitest with code coverage
- 🔄 **CI/CD**: GitHub Actions with quality gates
- 📦 **Automatic versioning**: Semantic-release based on Conventional Commits
- 🐳 **Dockerfile**: Ready-to-use multi-stage containerization
- 📝 **Documentation**: Markdown structure → Pandoc (HTML/PDF/DOCX)

## Documentation Organization

### Technical Sheets (00–07)

The **8 numbered sheets** cover all aspects of module development:

| Sheet  | Title               | Content                                     |
| ------ | ------------------- | ------------------------------------------- |
| **00** | Quick Start         | Installation, configuration, first module   |
| **01** | Template Structure  | File tree, files, organization              |
| **02** | Module Manifest     | `lexorbital.module.json` format (MANDATORY) |
| **03** | Development Rules   | 7 mandatory rules for integration           |
| **04** | Tests and Quality   | Test standards, coverage, tools             |
| **05** | CI/CD Workflow      | GitHub Actions pipeline, quality gates      |
| **06** | Semantic Versioning | Automatic Semantic Versioning               |
| **07** | Core Integration    | Git subtree, docking, discovery             |
| **08** | Sources             | References and resources                    |
| **09** | Manifest Validation | JSON Schema validation and testing          |

### Additional Documentation

- **QUICKSTART.md**: Quick installation and usage guide
- **legal/sources.md**: Sources and references used

### Configure the Module

1. **Update `package.json`**: name, description, author
2. **Configure `lexorbital.module.json`**: name, type, role, compatibility
3. **Customize `README.md`**
4. **Develop** your module in `src/`
5. **Test** with `pnpm test`
6. **Commit** with Conventional Commits: `git commit -m "feat: add my feature"`

## Mandatory Rules (MANDATORY)

For a module to be integrated into LexOrbital, it **must** comply with:

1. ✅ **Conventional Commits** (enforced by Commitlint)
2. ✅ **Dockerfile** present and functional
3. ✅ **Mandatory tests** (min. healthcheck + functional)
4. ✅ **Complete manifest** (`lexorbital.module.json`)
5. ✅ **Complete README** with installation instructions
6. ✅ **CI compliance** (lint, type-check, test, build)
7. ✅ **TypeScript strict mode** enabled

**Non-negotiable**: These rules are automatically enforced by Husky, Commitlint and CI.

## Contributing to Documentation

### Add a New Sheet

1. Create a file `docs/NN_sheet-title.md` (NN = 2-digit number)
2. Use the header template:

```markdown
# Sheet #N: Sheet Title {#sheet-N-title}

Summary in 2-3 sentences.

## 1. Sheet Objective

## 2. Key Concepts and Decisions

## 3. Technical Implications

## 4. Implementation Checklist

## 5. Key Takeaways

## 6. Related Links
```

3. Add an entry in the `README.md` table of contents
4. Regenerate the doc: `./scripts/generate-docs.sh`

### Update an Existing Sheet

1. Edit the relevant `docs/NN_*.md` file
2. Respect the structure (numbered sections, explicit IDs)
3. Commit with Conventional Commits: `docs(sheet-N): description`
4. Automatically regenerate doc (CI/CD GitHub Actions)

## License

This project is licensed under **MIT**. See the [LICENSE](../LICENSE) file at the project root.

## Support

For any questions or contributions, consult:

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guide
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Code of conduct
- [GitHub Issues](https://github.com/lexorbital/lexorbital-template-module/issues) - Report a bug or propose a feature
