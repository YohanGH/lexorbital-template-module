// config/commitlint/base.ts

import type { UserConfig } from "@commitlint/types"
import { RuleConfigSeverity } from "@commitlint/types"

import { COMMIT_TYPES, COMMIT_SCOPES } from "./types"

export const baseConfig: UserConfig = {
  /*
   * Extends the official "conventional" config.
   * This guarantees compatibility with tools such as standard-version / semantic-release.
   */
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Allowed types (warning only so developers keep flexibility)
    "type-enum": [RuleConfigSeverity.Warning, "always", [...COMMIT_TYPES]],

    // Type must be lowercase
    "type-case": [RuleConfigSeverity.Error, "always", "lower-case"],

    // Type is mandatory
    "type-empty": [RuleConfigSeverity.Error, "never"],

    // Allowed scopes (warning-level to keep guidance without blocking)
    "scope-enum": [RuleConfigSeverity.Warning, "always", [...COMMIT_SCOPES]],

    // Scope must be lowercase
    "scope-case": [RuleConfigSeverity.Error, "always", "lower-case"],

    // Scope is fully optional
    "scope-empty": [RuleConfigSeverity.Disabled],

    // Subject is mandatory
    "subject-empty": [RuleConfigSeverity.Error, "never"],

    // Subject case - disabled to allow any case
    "subject-case": [RuleConfigSeverity.Disabled],

    // No trailing period in the header
    "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],

    // Max header length (readable in git log / GitHub UI)
    "header-max-length": [RuleConfigSeverity.Error, "always", 255],

    // Allow long body lines (warn only)
    "body-max-line-length": [RuleConfigSeverity.Warning, "always", 255],

    // Optional: disable some default rules if needed
    // "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
    // "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
  },

  /*
   * Ignore patterns for commits that don't need to follow conventional format:
   * - Merge commits (handled by defaultIgnores from @commitlint/config-conventional)
   * - Automated commits from bots/tools
   */
  ignores: [
    (commit: string) => {
      const message = commit || ""
      const firstLine = message.split("\n")[0] || ""

      // Ignore merge commits (should be handled by defaultIgnores, but adding for safety)
      if (firstLine.startsWith("Merge ")) return true

      // Ignore automated GitHub commits (code scanning alerts, Dependabot, etc.)
      if (firstLine.startsWith("Potential fix")) return true
      if (firstLine.includes("code scanning alert")) return true

      // Ignore commits with Co-authored-by from GitHub bots
      if (message.includes("Co-authored-by:") && message.includes("github-advanced-security")) return true
      if (message.includes("Signed-off-by:") && message.includes("github-advanced-security")) return true

      // Ignore commits that don't start with a conventional type (likely automated)
      // but only if they contain bot signatures
      if (!firstLine.match(/^(feat|fix|chore|docs|ci|refactor|style|test|perf|build|revert)(\(.+\))?:/) 
          && (message.includes("Co-authored-by:") || message.includes("Signed-off-by:"))) {
        return true
      }

      return false
    },
  ],
}
