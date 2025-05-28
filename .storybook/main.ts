import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-onboarding",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
};

export default config;
