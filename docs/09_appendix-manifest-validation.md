# 🔍 Appendix: Module Manifest Validation

## Overview

The manifest validation system ensures that your LexOrbital module is properly configured and compliant with ecosystem standards.

## Validation Components

### 1. JSON Schema (`schemas/module-manifest.schema.json`)

A complete JSON Schema that defines:

- **Required** and optional fields
- **Formats** and patterns (semver, URLs, etc.)
- **Enumerations** for types and layers
- **Custom validation** rules
- **Constraints** on default values

### 2. Automated Tests (`tests/module-manifest.test.ts`)

Test suite that verifies:

- ✅ Compliance with JSON schema
- ✅ Template customization (no default values)
- ✅ Presence of all required fields
- ✅ Format validity (semver, URLs)
- ✅ Type and layer consistency
- ✅ Tag uniqueness

### 3. Documentation (`schemas/README.md`)

Complete guide on:

- Schema usage
- Validation rules
- Available types and enumerations
- Examples and use cases

## 🚀 Usage

### Quick Validation

```bash
# Validate your manifest
pnpm test:manifest

# Detailed validation with error messages
pnpm validate:manifest

# All tests (including manifest)
pnpm test:all
```

### IDE Integration

The schema is automatically recognized by modern IDEs thanks to the `$schema` property in `lexorbital.module.json`:

```json
{
  "$schema": "./schemas/module-manifest.schema.json",
  ...
}
```

**IDE Features**:

- 🎯 **Autocompletion** of fields
- 💡 **IntelliSense** with documentation
- ⚠️ **Real-time validation**
- 📝 **Tooltips** with descriptions

### CI/CD Validation

Validation tests are automatically executed in the CI/CD pipeline to ensure that:

1. The manifest is valid
2. All required fields are present
3. The template has been customized
4. Formats are correct

## 📋 Customization Checklist

Before committing your module, make sure you have customized:

### Basic Information

- [ ] `name`: Changed from `lexorbital-template-module` to `lexorbital-your-module`
- [ ] `description`: Meaningful description of your module (no reference to "template")
- [ ] `type`: Appropriate type for your module
- [ ] `version`: Semver version (generally `0.1.0` to start)

### LexOrbital Configuration

- [ ] `lexorbital.role`: Specific role (not `template-module`)
- [ ] `lexorbital.layer`: Appropriate architectural layer
- [ ] `lexorbital.tags`: Relevant tags for your module
- [ ] `lexorbital.compatibility.metaKernel`: Compatible version

### Metadata

- [ ] `maintainer.name`: Your name or organization (not `LexOrbital Core`)
- [ ] `maintainer.contact`: Your email or contact URL
- [ ] `repository.url`: Your repository URL (not the template's)
- [ ] `license`: Appropriate license (default `MIT`)

### Entry Points

- [ ] `entryPoints.main`: Main entry point (generally `dist/index.js`)
- [ ] `entryPoints.types`: TypeScript definitions (generally `dist/index.d.ts`)

## 🎯 Types and Layers

### Module Types

| Type            | Description              | Example                             |
| --------------- | ------------------------ | ----------------------------------- |
| `utility`       | Utilities and helpers    | Formatting functions, date helpers  |
| `service`       | Business services        | Authentication service, API client  |
| `ui-component`  | UI components            | Buttons, forms, modals              |
| `data-provider` | Data providers           | Database connectors, API wrappers   |
| `middleware`    | Middlewares              | Logging, validation, transformation |
| `plugin`        | Extensible plugins       | Extensions, system hooks            |
| `theme`         | Visual themes            | Styles, visual configurations       |
| `integration`   | Third-party integrations | Stripe, SendGrid, AWS               |
| `library`       | Generic libraries        | Collections, algorithms             |

### Architectural Layers

| Layer            | Description              | Examples                       |
| ---------------- | ------------------------ | ------------------------------ |
| `infrastructure` | Technical infrastructure | Database, caching, logging     |
| `domain`         | Business logic           | Entities, business rules       |
| `application`    | Application coordination | Use cases, services            |
| `presentation`   | User interface           | Components, views, controllers |
| `integration`    | External integrations    | APIs, webhooks, adapters       |

# LexOrbital Template Module Tests

This directory contains tests for the LexOrbital module template.

## Test Structure

### 1. `template-module.test.ts`

Basic tests to verify that the template structure is functional.

**Execution**:

```bash
pnpm test
```

### 2. `module-manifest.test.ts`

Validation tests for the `lexorbital.module.json` manifest.

**Execution**:

```bash
pnpm test:manifest
# or
pnpm validate:manifest  # with detailed output
```

## ⚠️ Important: Manifest Validation Tests

The tests in `module-manifest.test.ts` **will fail by default** until you have customized your module. This is intentional!

### Why do these tests fail?

These tests verify that you have **customized the template** with your own module's information. They fail as long as you use the template's default values:

- ❌ `name: "lexorbital-template-module"`
- ❌ `lexorbital.role: "template-module"`
- ❌ `maintainer.name: "LexOrbital Core"`
- ❌ `repository.url: "https://github.com/YohanGH/lexorbital-template-module"`

### How to make these tests pass?

1. **Open** `lexorbital.module.json`
2. **Modify** the following fields:

```json
{
  "$schema": "./schemas/module-manifest.schema.json",
  "name": "lexorbital-my-awesome-module", // ✅ Change this
  "description": "My awesome module for...", // ✅ Change this
  "type": "service", // ✅ Choose the right type
  "version": "0.1.0",
  "entryPoints": {
    "main": "dist/index.js",
    "types": "dist/index.d.ts"
  },
  "lexorbital": {
    "role": "authentication-service", // ✅ Change this
    "layer": "application", // ✅ Choose the right layer
    "compatibility": {
      "metaKernel": ">=1.0.0 <2.0.0"
    },
    "tags": ["auth", "security"] // ✅ Add your tags
  },
  "maintainer": {
    "name": "Your Name", // ✅ Change this
    "contact": "your.email@example.com" // ✅ Change this
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-repo" // ✅ Change this
  },
  "license": "MIT"
}
```

3. **Rerun** the tests:

```bash
pnpm test:manifest
```

### Example Output with Errors

If you haven't customized the manifest, you'll see:

```
🔴 Module Manifest Customization Issues:

❌ Please change the 'name' field from 'lexorbital-template-module' to your module name
❌ Please change 'lexorbital.role' from 'template-module' to your module's actual role
❌ Please update 'maintainer.name' with your name or organization
❌ Please update 'repository.url' with your repository URL
⚠️  Consider updating 'description' to remove references to 'template'

📖 See docs/02_module-manifest.md for more information
```

### Example Successful Output

Once the manifest is customized:

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

## JSON Schema Validation

The JSON schema (`schemas/module-manifest.schema.json`) automatically validates:

### Required Fields

- ✅ `name`: `lexorbital-*` format (not default)
- ✅ `description`: 10-500 characters
- ✅ `type`: One of the valid types
- ✅ `version`: Valid semver
- ✅ `entryPoints`: Entry points to `dist/`
- ✅ `lexorbital`: Complete configuration
- ✅ `maintainer`: Name and contact
- ✅ `repository`: Type and URL
- ✅ `license`: License identifier

### Valid Module Types

- `utility`, `service`, `ui-component`, `data-provider`
- `middleware`, `plugin`, `theme`, `integration`, `library`

### Valid Architectural Layers

- `infrastructure`, `domain`, `application`, `presentation`, `integration`

## CI/CD Integration

These tests are automatically executed in the CI/CD pipeline to ensure that:

1. The manifest is valid according to the JSON schema
2. All required fields are present
3. The template has been customized (no default values)
4. Versions follow the semver format
5. URLs and formats are correct

## Local Development

### Run Manifest Tests Only

```bash
pnpm test:manifest
```

## Need Help?

If the tests fail and you don't understand why:

1. Read the detailed error messages
2. Consult `docs/02_module-manifest.md`
3. Verify that you have modified ALL default values
4. Consult `schemas/README.md` for validation rules

The tests are there to guide you! 🎯
