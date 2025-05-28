import type { Meta, StoryObj } from "@storybook/react";

import Tooltip, { TooltipProps } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<TooltipProps>;

export const Default: Story = {
  args: {
    icon: "fr-icon-information-fill",
    text: "Les mentions administratives sont communes à tous les postes de travaux. Elles sont obligatoires pour les obtentions d’aides financières.",
  },
};
