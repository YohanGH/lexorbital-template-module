// eslint.config.cjs

const tsParser = require("@typescript-eslint/parser")
const tsPlugin = require("@typescript-eslint/eslint-plugin")
const importPlugin = require("eslint-plugin-import")

// Global config: ignore
const baseIgnoreConfig = {
  name: "global-ignores",
  ignores: [
    "node_modules/**",
    "dist/**",
    "build/**",
    "coverage/**",
    ".next/**",
  ],
}

// Config TypeScript/JavaScript (Node, ESM)
const typescriptConfig = {
  name: "typescript-node",
  files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      // Node globals
      process: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      console: "readonly",
      Buffer: "readonly",
      global: "readonly",
    },
    parser: tsParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  linterOptions: {
    noInlineConfig: false,
    reportUnusedDisableDirectives: "warn",
    reportUnusedInlineConfigs: "off",
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
    import: importPlugin,
  },
  rules: {
    // General style
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // TypeScript
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // Imports
    "import/order": [
      "warn",
      {
        groups: [
          ["builtin", "external"],
          ["internal"],
          ["parent", "sibling", "index"],
        ],
        "newlines-between": "always",
      },
    ],
  },
}

// Export final: array of configuration objects
module.exports = [baseIgnoreConfig, typescriptConfig]
