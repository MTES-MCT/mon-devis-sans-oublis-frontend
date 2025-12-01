"use client";

import { useEffect, useState } from "react";

import Modal, { ModalPosition } from "../Modal";
import RoundCheckboxGroup from "../../RoundCheckboxGroup/RoundCheckboxGroup";
import { Rating } from "@/types";
import wording from "@/wording";

export interface GlobalErrorFeedbacksModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmitFeedback: (
    comment: string,
    email: string | null,
    rating: Rating
  ) => void;
}

const GlobalErrorFeedbacksModal: React.FC<GlobalErrorFeedbacksModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rating, setRating] = useState<Rating | null>(null);

  const options: Rating[] = [0, 1, 2, 3, 4, 5];

  const handleSelect = (value: Rating) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (comment.trim() && rating !== null) {
      onSubmitFeedback(comment, email || null, rating);
      onClose?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Modal
      backButtonLabel={
        wording.components.global_error_feedbacks_modal.back_button_label
      }
      isOpen={isOpen}
      onClose={onClose}
      position={ModalPosition.CENTER}
    >
      <div onKeyDown={handleKeyDown} className="flex flex-col">
        <h4
          id="feedback-title"
          className="text-[var(--text-title-blue-france)]! fr-mb-1w flex items-center gap-2"
        >
          <span
            className="fr-icon-questionnaire-fill mt-1!"
            aria-hidden="true"
          />
          {wording.components.global_error_feedbacks_modal.title}
        </h4>
        <p
          id="feedback-description"
          className="fr-text--sm text-[var(--text-mention-grey)]"
        >
          {wording.components.global_error_feedbacks_modal.description}
        </p>
        <fieldset className="fr-mb-3w">
          <legend className="text-[var(--text-title-blue-france)] font-bold fr-mb-2w">
            {wording.components.global_error_feedbacks_modal.rating_title}
          </legend>
          <RoundCheckboxGroup
            defaultValue={rating || undefined}
            onChange={handleSelect}
            options={options.map((value) => ({ value }))}
          />
        </fieldset>
        <div className="fr-input-group">
          <label className="fr-label" htmlFor="feedback-comment">
            <span className="text-[var(--text-title-blue-france)] font-bold fr-mb-1w fr-mt-4w">
              {wording.components.global_error_feedbacks_modal.comment_title}
            </span>
          </label>
          <textarea
            className="fr-input"
            id="feedback-comment"
            onChange={(e) => setComment(e.target.value)}
            aria-required="true"
            value={comment}
          />
        </div>

        <div className="fr-input-group ">
          <label className="fr-label flex! flex-col" htmlFor="feedback-email">
            <span className="text-[var(--text-title-blue-france)] font-bold fr-mb-1w">
              {wording.components.global_error_feedbacks_modal.contact_title}
            </span>
            <span className="fr-text--xs fr-mb-1w fr-mt-0 text-[var(--text-mention-grey)]">
              {
                wording.components.global_error_feedbacks_modal
                  .contact_title_optional
              }
            </span>
          </label>
          <input
            className="fr-input"
            id="feedback-email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              wording.components.global_error_feedbacks_modal.email_placeholder
            }
            type="email"
            value={email}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="fr-btn fr-btn--primary fr-mt-3w"
            onClick={handleSubmit}
            disabled={!comment.trim() || rating === null}
            type="submit"
          >
            {wording.components.global_error_feedbacks_modal.submit_button}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalErrorFeedbacksModal;
