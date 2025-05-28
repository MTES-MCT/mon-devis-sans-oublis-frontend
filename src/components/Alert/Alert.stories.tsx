import type { Meta, StoryObj } from "@storybook/react";

import Alert from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const WithMoreDescription: Story = {
  args: {
    description: "Les devis soumis restent strictement confidentiels.",
    moreDescription:
      "Les devis sont conservés de manière sécurisée pendant une durée de six mois afin de vous permettre l'accès aux corrections si nécessaire, après quoi ils sont automatiquement supprimés de nos systèmes.",
  },
};

export const WithoutMoreDescription: Story = {
  args: {
    description: "Les devis soumis restent strictement confidentiels.",
  },
};
