import type { Meta, StoryObj } from "@storybook/react";

import Badge, { BadgeSize, BadgeVariant } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    size: {
      control: "radio",
      options: Object.values(BadgeSize),
    },
    variant: {
      control: "radio",
      options: Object.values(BadgeVariant),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const BlueDark: Story = {
  args: {
    label: "Blue Dark Badge",
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.BLUE_DARK,
  },
};

export const BlueLight: Story = {
  args: {
    label: "Blue Light Badge",
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.BLUE_LIGHT,
  },
};

export const Green: Story = {
  args: {
    label: "Green Badge",
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.GREEN,
  },
};

export const Grey: Story = {
  args: {
    label: "Grey Badge",
    size: BadgeSize.MEDIUM,
    variant: BadgeVariant.GREY,
  },
};
