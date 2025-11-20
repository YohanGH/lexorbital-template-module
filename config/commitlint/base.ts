// config/commitlint/base.ts

import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";
import { COMMIT_TYPES, COMMIT_SCOPES } from "./types";

export const baseConfig: UserConfig = {
  /*
   * On étend la config "conventional" officielle.
   * Ça garantit la compatibilité avec les outils type standard-version / semantic-release.
   */
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Types autorisés
    "type-enum": [RuleConfigSeverity.Error, "always", [...COMMIT_TYPES]],

    // Scopes autorisés
    "scope-enum": [RuleConfigSeverity.Error, "always", [...COMMIT_SCOPES]],

    // Imposer un scope : chaque commit doit dire *où* il agit
    "scope-empty": [RuleConfigSeverity.Error, "never"],

    // Type obligatoire
    "type-empty": [RuleConfigSeverity.Error, "never"],

    // Sujet obligatoire
    "subject-empty": [RuleConfigSeverity.Error, "never"],

    // Pas de majuscule façon titre au début, style phrase ou lower
    "subject-case": [
      RuleConfigSeverity.Error,
      "always",
      ["sentence-case", "lower-case"],
    ],

    // Pas de point final dans le header
    "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],

    // Longueur max du header (lisible dans git log / GitHub UI)
    "header-max-length": [RuleConfigSeverity.Error, "always", 100],

    // Optionnel : tu peux désactiver certaines règles par défaut
    // "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
    // "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
  },

  /*
   * Si tu veux aussi vérifier les messages "Merge branch '...'" etc,
   * tu peux mettre defaultIgnores: false. Sinon on laisse la valeur par défaut.
   */
  // defaultIgnores: false,
};
