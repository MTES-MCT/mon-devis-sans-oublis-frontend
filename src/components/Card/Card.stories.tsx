import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhoAreWe: Story = {
  args: {
    children: (
      <p className="text-[var(--text-mention-grey)]">
        Mon Devis Sans Oublis est un service public gratuit qui vérifie en
        quelques secondes la conformité des devis aux attendus réglementaires
        des aides à la rénovation énergétique.
        <br />
        <br />
        {
          "Nous sommes un service public lancé par le Ministère de la Transition Ecologique et la Direction du Numérique (DINUM) sous la forme d'une start-up d'Etat. Elle est en phase d'expérimentation avant un déploiement massif. N'hésitez pas à nous faire part de vos retours et suggestions d'améliorations."
        }
      </p>
    ),
    image: "/images/ministere_transition_ecologique.webp",
    title: "Qui sommes-nous ?",
  },
};

export const WhatWeDo: Story = {
  args: {
    children: (
      <div className="[&_p]:m-0">
        <div className="flex flex-row gap-2 mt-8">
          <span className="fr-icon-map-pin-2-line text-[var(--background-action-high-blue-france)] mt-1" />
          <div className="flex flex-col">
            <p className="font-bold text-[var(--text-title-grey)]">
              Fluidifier l’instruction des aides
            </p>
            <p className="text-[var(--text-mention-grey)]">
              Création d’un modèle d’analyse automatique qui compare les devis
              de rénovation énergétique avec les exigences des demandes d’aides.
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-8">
          <span className="fr-icon-timer-line text-[var(--background-action-high-blue-france)] mt-1" />
          <div className="flex flex-col">
            <p className="font-bold text-[var(--text-title-grey)]">
              Réduire les délais d’instruction d’aide
            </p>
            <p className="text-[var(--text-mention-grey)]">
              Réduction du nombre d’allers-retours avec les instructeurs d’aides
              avec un pré-contrôle gratuit et instantané.
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-8">
          <span className="fr-icon-heart-line text-[var(--background-action-high-blue-france)] mt-1" />
          <div className="flex flex-col">
            <p className="font-bold text-[var(--text-title-grey)]">
              Améliorer la satisfaction des usagers
            </p>
            <p className="text-[var(--text-mention-grey)]">
              Conception d’une interface simple qui accompagne les usagers dans
              la lecture et la correction des devis.
            </p>
          </div>
        </div>
      </div>
    ),
    title: "Quelles sont nos missions ?",
  },
};
