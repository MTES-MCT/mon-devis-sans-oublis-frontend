import type { Meta, StoryObj } from "@storybook/react";

import Footer from "./Footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    affiliatedMinistry: "Ministère<br>de la transition<br>écologique",
    buttons: [
      {
        href: "/",
        label: "Mentions légales / Confidentialité",
      },
      { href: "/", label: "Accessibilité : non conforme" },
      { href: "/", label: "Statistiques" },
    ],
    organizationDescription:
      "Mon Devis Sans Oublis est un service public conçu par la <a href='https://www.ecologie.gouv.fr/direction-generale-lamenagement-du-logement-et-nature-dgaln-0' rel='noopener noreferrer' target='_blank'>Direction générale de l'aménagement, du logement et de la nature (DGALN)</a> en partenariat avec le programme <a href='https://beta.gouv.fr/' rel='noopener noreferrer' target='_blank'>beta.gouv</a> de la <a href='https://www.numerique.gouv.fr/' rel='noopener noreferrer' target='_blank'>DINUM</a>. Mon Devis Sans Oublis est en phase d'expérimentation, n'hésitez pas à nous faire part de vos retours par mail à contact@mon-devis-sans-oublis.beta.gouv.fr",
    organizationLink: "/",
    organizationName: "Mon Devis Sans Oublis",
  },
};
