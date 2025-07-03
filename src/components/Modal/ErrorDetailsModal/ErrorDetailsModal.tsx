"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import Modal, { ModalPosition } from "../Modal";
import { useIsConseiller } from "@/hooks";
import wording from "@/wording";

export interface ErrorDetailsModalProps {
  errorDetailsId: string;
  initialComment?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSubmitComment?: (comment: string, errorDetailsId: string) => void;
  problem: string | null;
  solution: string | null;
  title: string;
}

const ErrorDetailsModal: React.FC<ErrorDetailsModalProps> = ({
  errorDetailsId,
  initialComment = "",
  isOpen,
  onClose,
  onSubmitComment,
  problem,
  solution,
  title,
}) => {
  const [comment, setComment] = useState<string>(initialComment);
  const [isCommentModified, setIsCommentModified] = useState(false);

  const isConseillerAndEdit = useIsConseiller();

  useEffect(() => {
    if (isOpen) {
      setIsCommentModified(false);
      setComment(initialComment || "");
    }
  }, [isOpen, initialComment]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    setIsCommentModified(newComment !== initialComment);
  };

  const handleSubmit = () => {
    if (comment === "" && initialComment) {
      onSubmitComment?.("", errorDetailsId);
    } else if (comment.trim()) {
      onSubmitComment?.(comment.trim(), errorDetailsId);
    }
    onClose?.();
  };

  return (
    <Modal
      backButtonLabel={
        wording.components.error_feedbacks_modal.back_button_label
      }
      isOpen={isOpen}
      onClose={onClose}
      position={ModalPosition.RIGHT}
    >
      <div className="grow">
        <Image
          alt={wording.components.error_feedbacks_modal.icon_alt}
          className="mt-10!"
          height={64}
          src={wording.components.error_feedbacks_modal.icon_src}
          width={64}
        />
        <h4 className="mb-8!">{title}</h4>
        {problem && (
          <>
            <p className="fr-mb-1w fr-text--lead text-[var(--text-title-blue-france)] font-bold">
              {wording.components.error_feedbacks_modal.problem_title}
            </p>
            <p>{problem}</p>
          </>
        )}
        {solution && (
          <>
            <p className="fr-mb-1w fr-mt-3w fr-text--lead text-[var(--text-title-blue-france)] font-bold">
              {wording.components.error_feedbacks_modal.solution_title}
            </p>
            <p>{solution}</p>
          </>
        )}
      </div>
      {((isConseillerAndEdit && initialComment) ||
        (!isConseillerAndEdit && initialComment)) && (
        <div className="mb-8!">
          <div className="fr-input-group mt-4! flex flex-col p-4 rounded-lg bg-[var(--background-alt-grey)]">
            <span className="flex items-center justify-between fr-mb-1w">
              <Image
                alt="delete"
                height={40}
                src="/images/quotation_results/quotation_correction_comment.webp"
                width={40}
              />
              {initialComment && isConseillerAndEdit && (
                <button
                  className="fr-btn fr-btn--tertiary fr-icon-delete-line fr-btn--sm"
                  onClick={() => {
                    setComment("");
                    setIsCommentModified(true);
                  }}
                  title="Supprimer le commentaire"
                />
              )}
            </span>
            <label
              className="text-[var(--text-default-grey)] font-bold mb-2!"
              htmlFor="textarea-input"
            >
              {isConseillerAndEdit
                ? "Votre commentaire"
                : "Commentaire de votre conseiller"}
            </label>
            {isConseillerAndEdit ? (
              <>
                <textarea
                  aria-describedby="textarea-input-messages"
                  className="fr-input h-40 whitespace-pre-wrap"
                  id="textarea-input"
                  onChange={handleCommentChange}
                  value={comment}
                />
                <div
                  className="fr-messages-group"
                  id="textarea-input-messages"
                  aria-live="polite"
                />
              </>
            ) : (
              <p className="whitespace-pre-wrap h-40 overflow-y-auto">
                {comment}
              </p>
            )}
          </div>
          {isConseillerAndEdit && (
            <div className="mt-4! flex justify-end gap-4">
              <button
                className="fr-btn fr-btn--secondary"
                onClick={onClose}
                type="button"
              >
                Annuler
              </button>
              <button
                className="fr-btn fr-btn--primary"
                disabled={!isCommentModified}
                onClick={handleSubmit}
              >
                {comment === "" && initialComment ? "Supprimer" : "Enregistrer"}
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ErrorDetailsModal;
