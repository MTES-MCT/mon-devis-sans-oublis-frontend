import { useState } from "react";
import type { Meta } from "@storybook/react";

import Modal, { ModalPosition } from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    position: {
      control: "radio",
      options: [ModalPosition.CENTER, ModalPosition.RIGHT],
    },
    isOpen: {
      control: "boolean",
    },
    backButtonLabel: {
      control: "text",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;

export const Default: React.FC = () => {
  const [openModal, setOpenModal] = useState<null | "center" | "right">(null);

  return (
    <div>
      <div className="flex gap-4">
        <button
          onClick={() => setOpenModal("center")}
          className="fr-btn fr-btn--primary"
        >
          Modal Center
        </button>
        <button
          onClick={() => setOpenModal("right")}
          className="fr-btn fr-btn--primary"
        >
          Right Modal
        </button>
      </div>
      <Modal
        backButtonLabel="Fermer"
        isOpen={openModal === "center"}
        position={ModalPosition.CENTER}
        onClose={() => setOpenModal(null)}
      >
        <div className="p-4">Content</div>
      </Modal>
      <Modal
        backButtonLabel="Retour"
        isOpen={openModal === "right"}
        position={ModalPosition.RIGHT}
        onClose={() => setOpenModal(null)}
      >
        <div className="p-4">Content</div>
      </Modal>
    </div>
  );
};
