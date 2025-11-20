// config/commitlint/base.ts

import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";
import { COMMIT_TYPES, COMMIT_SCOPES } from "./types";

export const baseConfig: UserConfig = {
  /*
   * Extends the official "conventional" config.
   * This guarantees compatibility with tools such as standard-version / semantic-release.
   */
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Allowed types (warning only so developers keep flexibility)
    "type-enum": [RuleConfigSeverity.Warning, "always", [...COMMIT_TYPES]],

    // Allowed scopes (warning-level to keep guidance without blocking)
    "scope-enum": [RuleConfigSeverity.Warning, "always", [...COMMIT_SCOPES]],

    // Scope is recommended but optional
    "scope-empty": [RuleConfigSeverity.Warning, "never"],

    // Type is recommended but optional
    "type-empty": [RuleConfigSeverity.Warning, "never"],

    // Subject is mandatory
    "subject-empty": [RuleConfigSeverity.Error, "never"],

    // No title-style capitalization, use sentence-case or lower-case
    "subject-case": [
      RuleConfigSeverity.Error,
      "always",
      ["sentence-case", "lower-case"],
    ],

    // No trailing period in the header
    "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],

    // Max header length (readable in git log / GitHub UI)
    "header-max-length": [RuleConfigSeverity.Error, "always", 100],

    // Allow long body lines (warn only)
    "body-max-line-length": [RuleConfigSeverity.Warning, "always", 160],

    // Optional: disable some default rules if needed
    // "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
    // "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
  },

  /*
   * If you want to lint messages such as "Merge branch '...'",
   * set defaultIgnores to false. Otherwise keep the default.
   */
  // defaultIgnores: false,
};
