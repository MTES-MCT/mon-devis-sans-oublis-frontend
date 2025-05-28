import type { Meta, StoryObj } from "@storybook/react";
import CardImage from "./CardImage";

const meta = {
  title: "Components/CardImage",
  component: CardImage,
  tags: ["autodocs"],
} satisfies Meta<typeof CardImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreControl: Story = {
  args: {
    title: "Pré-contrôler en un clic les devis de rénovation énergétique",
    description:
      "Identifiez les mentions manquantes aux attendus réglementaires des aides.",
    image: "/images/steps_analyze_quote/quote_control.webp",
  },
};

export const GetHelp: Story = {
  args: {
    title: "Obtenez vos aides de rénovation plus rapidement",
    description:
      "Accélérez l’instruction des aides de rénovation énergétique en évitant les allers-retours avec les instructeurs grâce à des devis conformes.",
    image: "/images/steps_analyze_quote/get_help.webp",
  },
};

export const ChangeQuote: Story = {
  args: {
    title: "Recevez un pas à pas des modifications à apporter au devis",
    description:
      "Appliquez les corrections pour un devis sans oublis, prêt pour les demandes d’aides.",
    image: "/images/steps_analyze_quote/change_quote.webp",
  },
};
