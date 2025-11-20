// commitlint.config.ts

import type { UserConfig } from "@commitlint/types";
import { baseConfig } from "./config/commitlint/base";

const Configuration: UserConfig = {
  ...baseConfig,
  // Override repo-specific rules here if needed
};

export default Configuration;
