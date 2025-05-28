import type { Meta, StoryObj } from "@storybook/react";

import Toast, { ToastProps } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<ToastProps>;

export const Default: Story = {
  args: {
    message: "Opération effectuée avec succès",
    duration: 3000,
    onClose: () => console.log("Toast fermé"),
  },
};

export const LongDuration: Story = {
  args: {
    message: "Ce message reste affiché plus longtemps",
    duration: 5000,
    onClose: () => console.log("Toast fermé"),
  },
};

export const ShortDuration: Story = {
  args: {
    message: "Message rapide",
    duration: 1000,
    onClose: () => console.log("Toast fermé"),
  },
};
