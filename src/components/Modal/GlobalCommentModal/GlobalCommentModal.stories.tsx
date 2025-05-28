import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import GlobalCommentModal from "./GlobalCommentModal";

const meta = {
  title: "Components/Modal/GlobalCommentModal",
  component: GlobalCommentModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Affiche ou cache la modale",
    },
  },
} satisfies Meta<typeof GlobalCommentModal>;

export default meta;
type Story = StoryObj<typeof GlobalCommentModal>;

export const Default: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const handleClose = () => setIsOpen(false);
    const handleSubmitComment = (comment: string) => {
      console.log("Submit comment:", comment);
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
        <GlobalCommentModal
          {...args}
          isOpen={isOpen}
          onClose={handleClose}
          onSubmitComment={handleSubmitComment}
        />
      </>
    );
  },
};
