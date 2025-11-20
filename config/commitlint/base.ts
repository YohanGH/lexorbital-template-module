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
    // Allowed types
    "type-enum": [RuleConfigSeverity.Error, "always", [...COMMIT_TYPES]],

    // Allowed scopes
    "scope-enum": [RuleConfigSeverity.Error, "always", [...COMMIT_SCOPES]],

    // Enforce a scope: every commit must state *where* it applies
    "scope-empty": [RuleConfigSeverity.Error, "never"],

    // Type is mandatory
    "type-empty": [RuleConfigSeverity.Error, "never"],

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
