// config/commitlint/types.ts

export const COMMIT_TYPES = [
    "build",   // changements liés au build (webpack, vite, etc.)
    "chore",   // tâches diverses, scripts, maintenance
    "ci",      // pipeline CI/CD
    "docs",    // documentation uniquement
    "feat",    // nouvelle fonctionnalité
    "fix",     // correction de bug
    "perf",    // amélioration de perf
    "refactor",// refacto interne sans changement fonctionnel
    "revert",  // revert d'un commit
    "style",   // formatage, lint, pas de logique
    "test",    // tests uniquement
  ] as const;
  
  export type CommitType = (typeof COMMIT_TYPES)[number];
  
  export const COMMIT_SCOPES = [
    // Architecture & noyau
    "core",
    "kernel",
    "domain",
  
    // Modules/applications LexOrbital
    "module-auth",
    "module-orchestrator",
    "module-agents",
    "module-api",
    "module-ui",
  
    // Infra & tooling
    "infra",
    "devops",
    "config",
    "deps",
  
    // Documentation & connaissance
    "docs",
    "guides",
    "specs",
  ] as const;
  
  export type CommitScope = (typeof COMMIT_SCOPES)[number];
  