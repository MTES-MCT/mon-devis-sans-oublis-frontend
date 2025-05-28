import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import GlobalErrorFeedbacksModal from "./GlobalErrorFeedbacksModal";
import { Rating } from "@/types";

const meta: Meta<typeof GlobalErrorFeedbacksModal> = {
  title: "Components/Modal/GlobalErrorFeedbacks",
  component: GlobalErrorFeedbacksModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Affiche ou cache le modal",
    },
  },
};

export default meta;

type Story = StoryObj<typeof GlobalErrorFeedbacksModal>;

export const Default: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const handleClose = () => setIsOpen(false);

    const handleSubmitFeedback = (
      comment: string,
      email: string | null,
      rating: Rating
    ) => {
      console.log("Feedback soumis :", { comment, email, rating });
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
        <GlobalErrorFeedbacksModal
          {...args}
          isOpen={isOpen}
          onClose={handleClose}
          onSubmitFeedback={handleSubmitFeedback}
        />
      </>
    );
  },
};
