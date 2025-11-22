import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { validator } from "@exodus/schemasafe"

describe("Module Manifest Validation", () => {
  const manifestPath = join(process.cwd(), "lexorbital.module.json")
  const schemaPath = join(process.cwd(), "schemas/module-manifest.schema.json")

  let manifest: any
  let schema: any

  it("should load the manifest file", () => {
    expect(() => {
      manifest = JSON.parse(readFileSync(manifestPath, "utf-8"))
    }).not.toThrow()
    expect(manifest).toBeDefined()
  })

  it("should load the schema file", () => {
    expect(() => {
      schema = JSON.parse(readFileSync(schemaPath, "utf-8"))
    }).not.toThrow()
    expect(schema).toBeDefined()
  })

  describe("Schema Validation", () => {
    it("should validate the manifest against the JSON schema", () => {
      const validate = validator(schema, { includeErrors: true })
      const isValid = validate(manifest)

      if (!isValid) {
        console.error("Validation errors:", validate.errors)
      }

      expect(isValid).toBe(true)
    })
  })

  describe("Template Customization Checks", () => {
    it("should have a customized module name (not the template default)", () => {
      expect(manifest.name).toBeDefined()
      expect(manifest.name).not.toBe("lexorbital-template-module")
      expect(manifest.name).toMatch(/^lexorbital-[a-z0-9-]+$/)
    })

    it("should have a meaningful description", () => {
      expect(manifest.description).toBeDefined()
      expect(manifest.description.length).toBeGreaterThan(10)
      expect(manifest.description).not.toContain("Template")
      expect(manifest.description).not.toContain("template")
    })

    it("should have a customized role (not 'template-module')", () => {
      expect(manifest.lexorbital?.role).toBeDefined()
      expect(manifest.lexorbital.role).not.toBe("template-module")
    })

    it("should have customized maintainer information", () => {
      expect(manifest.maintainer?.name).toBeDefined()
      expect(manifest.maintainer.name).not.toBe("LexOrbital Core")
      expect(manifest.maintainer.contact).toBeDefined()
    })

    it("should have a customized repository URL", () => {
      expect(manifest.repository?.url).toBeDefined()
      expect(manifest.repository.url).not.toBe(
        "https://github.com/YohanGH/lexorbital-template-module"
      )
    })
  })

  describe("Required Fields", () => {
    it("should have all required top-level fields", () => {
      expect(manifest.name).toBeDefined()
      expect(manifest.description).toBeDefined()
      expect(manifest.type).toBeDefined()
      expect(manifest.version).toBeDefined()
      expect(manifest.entryPoints).toBeDefined()
      expect(manifest.lexorbital).toBeDefined()
      expect(manifest.maintainer).toBeDefined()
      expect(manifest.repository).toBeDefined()
      expect(manifest.license).toBeDefined()
    })

    it("should have valid entry points", () => {
      expect(manifest.entryPoints.main).toBeDefined()
      expect(manifest.entryPoints.main).toMatch(/^dist\/.+\.js$/)

      if (manifest.entryPoints.types) {
        expect(manifest.entryPoints.types).toMatch(/^dist\/.+\.d\.ts$/)
      }
    })

    it("should have valid lexorbital configuration", () => {
      expect(manifest.lexorbital.role).toBeDefined()
      expect(manifest.lexorbital.layer).toBeDefined()
      expect(manifest.lexorbital.compatibility).toBeDefined()
      expect(manifest.lexorbital.compatibility.metaKernel).toBeDefined()
    })
  })

  describe("Version and Compatibility", () => {
    it("should have a valid semantic version", () => {
      const semverRegex =
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

      expect(manifest.version).toMatch(semverRegex)
    })

    it("should have valid metaKernel compatibility range", () => {
      const compatibility = manifest.lexorbital.compatibility.metaKernel
      expect(compatibility).toBeDefined()
      expect(compatibility).toMatch(/^[><=~^]+[0-9]/)
    })
  })

  describe("Module Type and Layer", () => {
    const validTypes = [
      "utility",
      "service",
      "ui-component",
      "data-provider",
      "middleware",
      "plugin",
      "theme",
      "integration",
      "library",
    ]

    const validLayers = [
      "infrastructure",
      "domain",
      "application",
      "presentation",
      "integration",
    ]

    it("should have a valid module type", () => {
      expect(validTypes).toContain(manifest.type)
    })

    it("should have a valid architectural layer", () => {
      expect(validLayers).toContain(manifest.lexorbital.layer)
    })
  })

  describe("Tags and Metadata", () => {
    it("should have at least one tag", () => {
      if (manifest.lexorbital.tags) {
        expect(Array.isArray(manifest.lexorbital.tags)).toBe(true)
        expect(manifest.lexorbital.tags.length).toBeGreaterThan(0)

        // Check uniqueness
        const uniqueTags = new Set(manifest.lexorbital.tags)
        expect(uniqueTags.size).toBe(manifest.lexorbital.tags.length)
      }
    })
  })

  describe("Developer Guidance", () => {
    it("should provide helpful error messages for common mistakes", () => {
      const errors: string[] = []

      if (manifest.name === "lexorbital-template-module") {
        errors.push(
          "❌ Please change the 'name' field from 'lexorbital-template-module' to your module name"
        )
      }

      if (manifest.lexorbital?.role === "template-module") {
        errors.push(
          "❌ Please change 'lexorbital.role' from 'template-module' to your module's actual role"
        )
      }

      if (manifest.maintainer?.name === "LexOrbital Core") {
        errors.push(
          "❌ Please update 'maintainer.name' with your name or organization"
        )
      }

      if (
        manifest.repository?.url ===
        "https://github.com/YohanGH/lexorbital-template-module"
      ) {
        errors.push(
          "❌ Please update 'repository.url' with your repository URL"
        )
      }

      if (
        manifest.description?.includes("template") ||
        manifest.description?.includes("Template")
      ) {
        errors.push(
          "⚠️  Consider updating 'description' to remove references to 'template'"
        )
      }

      if (errors.length > 0) {
        console.error("\n🔴 Module Manifest Customization Issues:\n")
        errors.forEach(error => console.error(error))
        console.error(
          "\n📖 See docs/02_module-manifest.md for more information\n"
        )
      }

      expect(errors).toHaveLength(0)
    })
  })
})
