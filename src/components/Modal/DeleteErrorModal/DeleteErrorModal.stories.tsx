import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import DeleteErrorModal from "./DeleteErrorModal";
import { Category } from "@/types";

const meta = {
  title: "Components/Modal/DeleteErrorModal",
  component: DeleteErrorModal,
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
  },
} satisfies Meta<typeof DeleteErrorModal>;

export default meta;
type Story = StoryObj<typeof DeleteErrorModal>;

const deleteErrorReasons = [
  { id: "already_present", label: "Information déjà présente" },
  { id: "not_used", label: "Information non utilisée dans notre cas" },
];

export const Default: Story = {
  args: {
    errorCategory: Category.ADMIN,
    errorDetailsId: "123",
    errorTitle: "Erreur dans le calcul de la TVA",
    quoteCheckId: "456",
    deleteErrorReasons: deleteErrorReasons,
    isOpen: false,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const handleClose = () => setIsOpen(false);
    const handleDeleteError = (
      quoteCheckId: string,
      errorDetailsId: string,
      reason: string
    ) => {
      console.log("Delete error:", { quoteCheckId, errorDetailsId, reason });
      setIsOpen(false);
    };

    return (
      <>
        <button
          className="fr-btn fr-btn--primary"
          onClick={() => setIsOpen(true)}
        >
          Ouvrir la modale de suppression
        </button>
        <DeleteErrorModal
          {...args}
          isOpen={isOpen}
          onClose={handleClose}
          onDeleteError={handleDeleteError}
        />
      </>
    );
  },
};
