import { featureFlags } from "../config/feature-flags.js";

export const featureFlagService = {
  isEnabled(flag: keyof typeof featureFlags): boolean {
    return featureFlags[flag];
  },

  all() {
    return { ...featureFlags };
  },
};
