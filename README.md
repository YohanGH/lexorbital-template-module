# **LexOrbital – Module Template**

_Official template for creating standardized, compliant, and autonomous LexOrbital modules._

This repository defines the **canonical structure**, **tooling**, and **conventions** required for any module that integrates into the **LexOrbital Station** (Core + Rings + Modules ecosystem).

---

## 🌌 **Purpose of This Template**

Every module generated from this template is guaranteed to be:

- **Autonomous** — runs independently (own Dockerfile + own CI)
- **Replaceable** — plug-and-play via a shared manifest
- **Consistent** — same structure, same quality bar
- **Secure by design** — enforced commit rules + static analysis
- **Documented** — markdown + manifest
- **Properly versioned** — SemVer + automated CHANGELOG

This is the required starting point for modules such as:

- `lexorbital-module-auth`
- `lexorbital-module-audit`
- `lexorbital-module-mailer`
- `lexorbital-module-rbac`
- `lexorbital-module-<community>`

---

## 📦 **Included Structure**

This template provides:

**Core folders**

- `src/` — main source code
- `tests/` — unit tests
- `docs/` — optional documentation
- `module.json` — module manifest
- `Dockerfile` — minimal containerization

**Project configuration**

- `.editorconfig`
- `.gitignore`
- `README.md`
- `CHANGELOG.md`

**Tooling**

- TypeScript (strict)
- ESLint + Prettier
- Husky (pre-commit + commit-msg)
- Commitlint (Conventional Commits)
- Standard-version (Semantic Versioning + changelog automation)
- Minimal GitHub Actions CI workflow

All LexOrbital modules **share the exact same skeleton**.

---

## 🛠️ **Getting Started**

**1. Create a new module from this template**

Use GitHub → **Use this template** →  
Name your repo:

- `lexorbital-module-auth`
- `lexorbital-module-audit`
- `lexorbital-module-mailer`

**2. Install dependencies**

pnpm install

**3. Development**

pnpm run dev

**4. Testing**

pnpm test

**5. Production build**

pnpm run build

**6. Optional: build Docker image**

docker build -t lexorbital/<module-name>:dev .

---


## 🚀 **Create a LexOrbital Module**

1. **Use this template** — enable this repo as a GitHub Template, then click **Use this template** to generate `lexorbital-module-<scope>`.
2. **Rename the package** — align both the repository name and the `package.json` `name` field with the required `lexorbital-module-` prefix.
3. **Install dependencies** — run `npm install` (or `pnpm install`) to pull TypeScript, ESLint, Vitest, Husky, and Commitlint.
4. **Adjust metadata** — update `package.json` (`description`, `repository`, `author`, scripts) along with `lexorbital.module.json` and this `README.md` before pushing the module.
5. **Validate the baseline** — run `npm run lint`, `npm test`, and `npm run build` to ensure CI passes before adding your features.

## 🧮 **Versioning Policy**

- Strict SemVer: MAJOR.MINOR.PATCH for every module release.
- `feat:` (without breaking changes) bumps MINOR and updates the CHANGELOG.
- `fix:` and `perf:` bump PATCH for safe corrections and optimizations.
- `feat!:` or any commit with `BREAKING CHANGE` bumps MAJOR.
- `chore:`, `docs:`, `refactor:` with no breaking changes do not trigger a release.

---

## 📜 **Module Manifest (`module.json`)**

Example:

{
"name": "lexorbital-module-auth",
"version": "0.1.0",
"type": "back",
"entry": "dist/index.js",
"compat": {
"rings": ["back"],
"core": ">=0.1.0"
},
"env": ["JWT_SECRET", "DATABASE_URL"]
}

The LexOrbital Core uses this manifest to:

- validate the module
- dock it into the appropriate Ring (front/back/infra)
- ensure compatibility
- auto-generate documentation

The manifest is **mandatory**.

---

## 📐 **Development Rules (Mandatory)**

Every LexOrbital module MUST:

- use **Conventional Commits** (`feat:`, `fix:`, `refactor:`…)
- include a **Dockerfile** (module-scoped only)
- include at least **one healthcheck test** + **one functional test**
- expose a complete **module.json** manifest
- provide a clear **README**
- pass the included **CI** without errors

No module can be integrated into the Station without fulfilling these rules.

---

## 🔄 **CI Workflow**

A minimal GitHub Actions workflow is included.  
It runs:

- Install
- Lint
- Test
- Build

Deployment (CD) belongs to the **LexOrbital Station** (`lexorbital-stack`)  
and must **not** be added to individual modules.

---

## 🔗 **Integration With LexOrbital Core**

Modules are docked into `lexorbital-core` using **git subtree**.

Example:

git subtree add --prefix=modules/auth git@github.com:lexorbital/lexorbital-module-auth.git main --squash

Do **not** modify modules directly inside `lexorbital-core/modules/*`.  
All changes must originate from the module’s own repository.

---

## 🧪 **Testing Guidelines**

Recommended tools:

- **Jest** — unit testing
- **Supertest** — backend HTTP modules
- **React Testing Library** — frontend UI modules

Commands:

- `pnpm test`
- `pnpm run coverage` (optional)

Each module should test:

- healthcheck endpoint or entrypoint
- at least one functional behaviour

---

## 🔒 **Security**

Do **not** open public issues for vulnerabilities.  
Instead, follow the instructions in:

➡️ `SECURITY.md`

---

## 🤝 **Contributing**

Before contributing or opening an issue, please read:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`

---

## 🛸 **LexOrbital Philosophy**

LexOrbital modules are conceived as:

- **vessels**
- **orbiting a law-driven core**
- bound by shared **contracts**
- minimal, secure, and replaceable

> _“Modules are vessels — autonomous, replaceable, orbiting a stable core.”_

---

## 📝 **License**

Add your module’s license here (MIT recommended).

---

## 🧭 **Maintainers**

Add maintainer names or GitHub handles here.

---

Thank you for contributing to **LexOrbital**  
and helping build a modular, compliant, and elegant architecture.
