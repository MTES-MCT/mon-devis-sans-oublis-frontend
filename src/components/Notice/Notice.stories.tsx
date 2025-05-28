import type { Meta, StoryObj } from "@storybook/react";

import Notice, { NoticeProps } from "./Notice";

const meta: Meta<typeof Notice> = {
  title: "Components/Notice",
  component: Notice,
  tags: ["autodocs"],
  argTypes: {
    buttonClose: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<NoticeProps>;

export const Alert: Story = {
  args: {
    className: "fr-notice--alert",
    title: "Attention",
    description: "Ceci est un message d'alerte important",
    buttonClose: true,
  },
};

export const Info: Story = {
  args: {
    className: "fr-notice--info",
    title: "Information",
    description: "Ceci est un message d'information",
    buttonClose: false,
  },
};

export const Warning: Story = {
  args: {
    className: "fr-notice--warning",
    title: "Information",
    description: "Ceci est un message d'information",
    buttonClose: false,
  },
};
