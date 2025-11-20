// commitlint.config.ts

import type { UserConfig } from "@commitlint/types";
import { baseConfig } from "./config/commitlint/base";

const Configuration: UserConfig = {
  ...baseConfig,
  // Ici tu peux surcharger quelques règles spécifiques au repo si besoin
};

export default Configuration;
