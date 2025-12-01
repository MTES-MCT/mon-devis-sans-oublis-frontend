"use client";

import { useState } from "react";

import CommentErrorModal from "../Modal/CommentErrorModal/CommentErrorModal";
import DeleteErrorModal from "../Modal/DeleteErrorModal/DeleteErrorModal";
import ErrorDetailsModal from "../Modal/ErrorDetailsModal/ErrorDetailsModal";
import { useIsConseiller } from "@/hooks";
import { ErrorDetails } from "@/types";
import wording from "@/wording";

export interface QuoteErrorLineProps {
  deleteErrorReasons?: { id: string; label: string }[];
  error: ErrorDetails;
  isLastErrorInTable?: boolean;
  onAddErrorComment?: (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onDeleteError?: (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment?: (quoteCheckId: string, errorDetailsId: string) => void;
  onUndoDeleteError?: (quoteCheckId: string, errorDetailsId: string) => void;
  quoteCheckId: string;
}

const QuoteErrorLine: React.FC<QuoteErrorLineProps> = ({
  deleteErrorReasons,
  error,
  isLastErrorInTable = false,
  onAddErrorComment,
  onDeleteError,
  onDeleteErrorComment,
  onUndoDeleteError,
  quoteCheckId,
}) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isConseillerAndEdit = useIsConseiller();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteConfirm = (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => {
    /* istanbul ignore next */
    if (!reason) {
      console.error("reason est vide dans QuoteErrorLine !");
      return;
    }

    const foundReason = deleteErrorReasons?.find((r) => r.id === reason);
    const finalReason = foundReason ? foundReason.label : reason;

    onDeleteError?.(quoteCheckId, errorDetailsId, finalReason);
  };

  const handleCommentSubmit = (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => {
    onAddErrorComment?.(quoteCheckId, errorDetailsId, comment);
    setIsCommentModalOpen(false);
  };

  /* istanbul ignore next */
  const problemValue = error.problem ?? "";
  /* istanbul ignore next */
  const solutionValue = error.solution ?? "";

  return (
    <>
      <tr
        className={`font-bold ${
          isLastErrorInTable
            ? "border-b-0"
            : "border-bottom-grey border-top-grey"
        }`}
        key={`${error.id}-${error.deleted}`}
      >
        <td className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <span
            className={
              error.deleted ? "line-through text-gray-500 opacity-50" : ""
            }
          >
            {error.title}
          </span>
          <span className="flex gap-2">
            {!isConseillerAndEdit &&
              (error.solution || error.comment) &&
              !error.deleted && (
                <button
                  className="fr-btn fr-btn--tertiary fr-btn--sm shrink-0"
                  onClick={openModal}
                >
                  {wording.components.quote_error_card.button_see_detail}
                  {error.comment && (
                    <span className="fr-icon-message-2-fill fr-icon--sm ml-2" />
                  )}
                </button>
              )}
            {isConseillerAndEdit && !error.deleted && (
              <>
                {error.solution && error.comment && (
                  <button
                    className="fr-btn fr-btn--tertiary fr-btn--sm shrink-0"
                    onClick={openModal}
                  >
                    {wording.components.quote_error_card.button_see_detail}
                    <span className="fr-icon-message-2-fill fr-icon--sm ml-2" />
                  </button>
                )}
                {error.solution && !error.comment && (
                  <button
                    className="fr-btn fr-btn--tertiary fr-btn--sm shrink-0"
                    onClick={openModal}
                  >
                    {wording.components.quote_error_card.button_see_detail}
                  </button>
                )}
                {!error.solution && error.comment && (
                  <button
                    className="fr-btn fr-btn--tertiary fr-icon-message-2-fill fr-btn--sm"
                    onClick={openModal}
                  />
                )}
              </>
            )}
            {isConseillerAndEdit && !error.comment && !error.deleted && (
              <button
                className="fr-btn fr-btn--tertiary fr-icon-chat-new-line fr-btn--sm"
                onClick={() => setIsCommentModalOpen(true)}
              />
            )}
            {isConseillerAndEdit && !error.deleted && (
              <button
                className="fr-btn fr-btn--tertiary fr-icon-delete-line fr-btn--sm"
                onClick={openDeleteModal}
              />
            )}
            {isConseillerAndEdit && error.deleted && onUndoDeleteError && (
              <button
                className="fr-btn fr-btn--tertiary fr-btn--sm"
                onClick={() => {
                  onUndoDeleteError(quoteCheckId, error.id);
                }}
              >
                Annuler la suppression
              </button>
            )}
          </span>
        </td>
      </tr>
      <CommentErrorModal
        errorCategory={error.category}
        errorDetailsId={error.id}
        errorSolution={error.solution || undefined}
        errorTitle={error.title}
        initialComment={error.comment}
        isOpen={isCommentModalOpen}
        onAddErrorComment={handleCommentSubmit}
        onDeleteErrorComment={onDeleteErrorComment}
        onClose={() => setIsCommentModalOpen(false)}
        quoteCheckId={quoteCheckId}
      />
      <DeleteErrorModal
        deleteErrorReasons={deleteErrorReasons}
        errorCategory={error.category}
        errorDetailsId={error.id}
        errorTitle={error.title}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDeleteError={handleDeleteConfirm}
        quoteCheckId={quoteCheckId}
      />
      {/* istanbul ignore else */}
      {(error.solution || error.comment) && (
        <ErrorDetailsModal
          errorDetailsId={error.id}
          initialComment={error.comment || ""}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmitComment={(comment) => {
            if (comment === "") {
              onDeleteErrorComment?.(quoteCheckId, error.id);
            } else {
              onAddErrorComment?.(quoteCheckId, error.id, comment);
            }
            closeModal();
          }}
          problem={problemValue}
          solution={solutionValue}
          title={error.title}
        />
      )}
    </>
  );
};

export default QuoteErrorLine;
