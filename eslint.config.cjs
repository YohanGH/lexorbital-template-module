// config/eslint/eslint.config.cjs

const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

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
};

// Config JS/TS "backend" (Node, ESM)
const backendConfig = {
  name: "backend-node",
  files: ["backend/**/*.{js,ts,mjs,cjs}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      // some Node globals
      process: "readonly",
      __dirname: "readonly",
      module: "readonly",
    },
    parser: tsParser,
    parserOptions: {
      // you can put a specific tsconfig if needed:
      project: ["./backend/tsconfig.json"],
      tsconfigRootDir: __dirname,
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

    // TS
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
};

// Config frontend (React/TS)
const frontendConfig = {
  name: "frontend-react",
  basePath: "frontend", // everything in ./frontend
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      window: "readonly",
      document: "readonly",
      navigator: "readonly",
    },
    parser: tsParser,
    parserOptions: {
      project: ["./frontend/tsconfig.json"],
      tsconfigRootDir: __dirname,
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
    import: importPlugin,
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React / hooks
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // TS
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
};

// Export final: array of configuration objects
module.exports = [baseIgnoreConfig, backendConfig, frontendConfig];
