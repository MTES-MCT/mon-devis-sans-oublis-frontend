import type { Meta, StoryObj } from "@storybook/react";

import BlockNumber, { BlockNumberSize } from "./BlockNumber"; // {{ edit_1 }}

const meta: Meta<typeof BlockNumber> = {
  title: "Components/BlockNumber",
  component: BlockNumber,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlockNumber>;

export const Default: Story = {
  args: {
    number: 1,
    title:
      "Déposez votre devis afin qu’il soit analysé par notre outil qui vérifie que tous les attendus réglementaires soient bien présents.",
  },
};

export const Medium: Story = {
  args: {
    number: 1,
    size: BlockNumberSize.MEDIUM,
    title: "Découvrez les corrections",
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: BlockNumberSize.LARGE,
  },
};
