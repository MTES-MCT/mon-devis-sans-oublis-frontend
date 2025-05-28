import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import CommentErrorModal from "./CommentErrorModal";
import { Category } from "@/types";

const meta = {
  title: "Components/Modal/CommentErrorModal",
  component: CommentErrorModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Affiche ou cache la modale",
    },
    errorCategory: {
      control: "radio",
      options: [Category.ADMIN, Category.GESTES],
      description: "Catégorie de l'erreur",
    },
    errorDetailsId: {
      control: "text",
      description: "ID de l'erreur",
    },
    errorTitle: {
      control: "text",
      description: "Titre de l'erreur",
    },
    initialComment: {
      control: "text",
      description: "Commentaire initial",
    },
  },
} satisfies Meta<typeof CommentErrorModal>;

export default meta;
type Story = StoryObj<typeof CommentErrorModal>;

export const Default: Story = {
  args: {
    errorCategory: Category.ADMIN,
    errorDetailsId: "123",
    errorTitle: "Erreur dans le calcul de la TVA",
    errorSolution: "La solution proposée pour cette erreur",
    initialComment: "",
    isOpen: false,
    quoteCheckId: "456",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const handleClose = () => setIsOpen(false);
    const handleAddErrorComment = (
      quoteCheckId: string,
      errorDetailsId: string,
      comment: string
    ) => {
      console.log("Add comment:", { quoteCheckId, errorDetailsId, comment });
      setIsOpen(false);
    };

    const handleDeleteErrorComment = (
      quoteCheckId: string,
      errorDetailsId: string
    ) => {
      console.log("Delete comment:", { quoteCheckId, errorDetailsId });
      setIsOpen(false);
    };

    return (
      <>
        <button
          className="fr-btn fr-btn--primary"
          onClick={() => setIsOpen(true)}
        >
          Ouvrir la modale de commentaire
        </button>
        <CommentErrorModal
          {...args}
          isOpen={isOpen}
          onClose={handleClose}
          onAddErrorComment={handleAddErrorComment}
          onDeleteErrorComment={handleDeleteErrorComment}
        />
      </>
    );
  },
};

export const WithInitialComment: Story = {
  ...Default,
  args: {
    ...Default.args,
    initialComment: "Ceci est un commentaire existant",
  },
};
