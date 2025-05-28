import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ErrorFeedbacksModal from "./ErrorDetailsModal";

const meta = {
  title: "Components/Modal/ErrorFeedbacks",
  component: ErrorFeedbacksModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Affiche ou cache le modal",
    },
    errorDetailsId: {
      control: "text",
      description: "L'ID du détail d'erreur",
    },
    problem: {
      control: "text",
      description: "Description du problème détecté",
    },
    solution: {
      control: "text",
      description: "Solution suggérée pour le problème",
    },
    title: {
      control: "text",
      description: "Titre de l'erreur affichée",
    },
  },
} satisfies Meta<typeof ErrorFeedbacksModal>;

export default meta;
type Story = StoryObj<typeof ErrorFeedbacksModal>;

export const Default: Story = {
  args: {
    errorDetailsId: "123",
    isOpen: false,
    problem: "Problème détecté sur la ligne 3.",
    solution: "La solution suggérée est de vérifier le format du document.",
    title: "Erreur détectée",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const handleClose = () => setIsOpen(false);
    const handleSubmitComment = (comment: string, errorDetailsId: string) => {
      console.log("Feedback submitted:", { comment, errorDetailsId });
      setIsOpen(false);
    };

    return (
      <>
        <button
          className="fr-btn fr-btn--primary"
          onClick={() => setIsOpen(true)}
        >
          Ouvrir le modal
        </button>
        <ErrorFeedbacksModal
          {...args}
          isOpen={isOpen}
          onClose={handleClose}
          onSubmitComment={handleSubmitComment}
        />
      </>
    );
  },
};
