import { defineConfig } from "vitest/config"

export default defineConfig({
  // Vite cache (used by Vitest)
  cacheDir: "./node_modules/.vitest",

  test: {
    // Enable globals API for better DX
    globals: true,

    // Node.js environment for the module
    environment: "node",

    // Tests directory
    dir: "./tests",

    // Simplified exclusions (Vitest 4.0)
    // By default, only node_modules and .git are excluded
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.git/**",
      "**/coverage/**",
    ],

    // Pool options (new Vitest 4.0 API)
    maxWorkers: 4, // Replaces maxThreads
    isolate: true, // Isolation between tests

    // V8 coverage configuration
    coverage: {
      // V8 provider with AST-aware remapping (default in v4)
      provider: "v8",

      // Reporters
      reporter: ["text", "json", "html", "lcov", "text-summary"],

      // Include: files to include in coverage
      // In Vitest 4.0, it's recommended to explicitly define patterns
      include: [
        "src/**/*.{js,jsx,ts,tsx}",
        "config/**/*.{js,ts}",
        "scripts/**/*.{js,ts}",
      ],

      // Exclusions applied to files matching include
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/tests/**",
        "**/*.test.{js,ts}",
        "**/*.spec.{js,ts}",
        "**/*.config.{js,ts,cjs,mjs}",
        "**/__mocks__/**",
        "**/.husky/**",
      ],

      // Coverage thresholds
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },

      // Support for coverage.ignoreClassMethods (new in v4 for V8)
      ignoreClassMethods: [],

      // Coverage output directory
      reportsDirectory: "./coverage",
    },

    // Reporters configuration
    reporters: ["default", "verbose"],

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Retry on failure (optional)
    retry: 0,

    // Sequence options
    sequence: {
      // 'list' for Jest-like behavior (sequential)
      // 'stack' for Vitest behavior (default)
      hooks: "stack",
      shuffle: false,
    },

    // Server options (formerly deps)
    server: {
      deps: {
        inline: [],
        external: [],
      },
    },
  },
})
