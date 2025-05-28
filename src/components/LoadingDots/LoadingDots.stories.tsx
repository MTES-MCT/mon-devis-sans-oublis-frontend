import type { Meta, StoryObj } from "@storybook/react";

import LoadingDots from "./LoadingDots";

const meta = {
  title: "Components/LoadingDots",
  component: LoadingDots,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingDots>;

export default meta;
type Story = StoryObj<typeof LoadingDots>;

export const Default: Story = {
  args: {
    title: "Loading",
  },
};
