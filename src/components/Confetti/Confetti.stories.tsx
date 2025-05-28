import type { Meta, StoryObj } from "@storybook/react";
import Confetti from "./Confetti";

const meta: Meta<typeof Confetti> = {
  title: "Components/Confetti",
  component: Confetti,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Confetti>;

export const Default: Story = {
  render: () => (
    <div className="relative w-screen h-screen overflow-hidden">
      <Confetti />
    </div>
  ),
};
