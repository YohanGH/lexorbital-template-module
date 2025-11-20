// config/commitlint/types.ts

export const COMMIT_TYPES = [
  "build", // build-related changes (webpack, vite, etc.)
  "chore", // chores, scripts, maintenance
  "ci", // CI/CD pipeline
  "docs", // documentation only
  "feat", // new feature
  "fix", // bug fix
  "perf", // performance improvement
  "refactor", // internal refactor without functional change
  "revert", // revert a commit
  "style", // formatting or lint, no logic
  "test", // tests only
] as const;

export type CommitType = (typeof COMMIT_TYPES)[number];

export const COMMIT_SCOPES = [
  // Architecture & core
  "core",
  "kernel",
  "domain",

  // LexOrbital modules/applications
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

  // Documentation & knowledge
  "docs",
  "guides",
  "specs",
] as const;

export type CommitScope = (typeof COMMIT_SCOPES)[number];
