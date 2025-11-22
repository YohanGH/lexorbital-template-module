# Integration With LexOrbital Core

Modules are integrated into `lexorbital-core` using **git subtree** to maintain module autonomy while allowing them to be part of the Station.

## Integration Method

Modules are docked into `lexorbital-core` using git subtree:

```bash
git subtree add --prefix=modules/auth git@github.com:lexorbital/lexorbital-module-auth.git main --squash
```

This approach:

- Keeps modules in their own repositories
- Allows independent versioning and CI
- Maintains a single source of truth
- Enables easy updates and replacements

## Update Process

To update a module in the Core:

```bash
git subtree pull --prefix=modules/auth git@github.com:lexorbital/lexorbital-module-auth.git main --squash
```

## Important Rules

⚠️ **Do NOT modify modules directly inside `lexorbital-core/modules/*`**

All changes must:

1. Originate from the module's own repository
2. Be committed and pushed to the module repo
3. Then be pulled into Core using git subtree

This ensures:

- Modules remain autonomous
- Changes are tracked in the module's history
- Modules can be easily replaced or removed
- CI runs independently for each module

## Module Discovery

The LexOrbital Core discovers modules by:

1. Scanning `modules/*/lexorbital.module.json` files
2. Validating manifest structure
3. Checking compatibility constraints
4. Loading modules into the appropriate Ring (front/back/infra)

## Replacement

To replace a module:

1. Remove the old module subtree
2. Add the new module subtree
3. Update any Core configuration if needed

Modules are designed to be **replaceable** — the same interface can be implemented by different modules.
