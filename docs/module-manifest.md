# Module Manifest

The `lexorbital.module.json` file is the **mandatory manifest** that defines how a module integrates with the LexOrbital ecosystem.

## Purpose

The LexOrbital Core uses this manifest to:

- Validate the module
- Dock it into the appropriate Ring (front/back/infra)
- Ensure compatibility with Core and other modules
- Auto-generate documentation
- Manage dependencies and environment variables

## Example

```json
{
  "name": "lexorbital-module-auth",
  "description": "Authentication module for LexOrbital",
  "type": "back",
  "version": "0.1.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "auth-module",
    "layer": "back",
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "tags": ["auth", "security", "jwt"]
  },
  "env": ["JWT_SECRET", "DATABASE_URL"],
  "maintainer": {
    "name": "Module Author",
    "contact": "https://github.com/lexorbital/lexorbital-module-auth"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/lexorbital/lexorbital-module-auth"
  },
  "license": "MIT"
}
```

## Required Fields

- `name` — Module name (must follow `lexorbital-module-<scope>` pattern)
- `version` — Semantic version
- `type` — Module type: `"back"`, `"front"`, or `"infra"`
- `entryPoints` — Entry points for the module
- `lexorbital.role` — Module role identifier
- `lexorbital.layer` — Layer assignment
- `lexorbital.compatibility` — Compatibility constraints

## Optional Fields

- `env` — Array of required environment variables
- `maintainer` — Maintainer information
- `tags` — Searchable tags for the module

The manifest is **mandatory** and must be present in every LexOrbital module.
