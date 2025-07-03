"use client";

import { useState } from "react";
import CommentErrorModal from "../Modal/CommentErrorModal/CommentErrorModal";
import DeleteErrorModal from "../Modal/DeleteErrorModal/DeleteErrorModal";
import ErrorDetailsModal from "../Modal/ErrorDetailsModal/ErrorDetailsModal";
import { useIsConseiller } from "@/hooks";
import { ErrorDetails } from "@/types";

interface QuoteCaseConsistencyErrorRowProps {
  error: ErrorDetails;
  quoteCaseId: string;
  isLastError: boolean;
  deleteErrorReasons: { id: string; label: string }[];
  onAddErrorComment: (
    quoteCaseId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onDeleteError: (
    quoteCaseId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment: (quoteCaseId: string, errorDetailsId: string) => void;
  onUndoDeleteError: (quoteCaseId: string, errorDetailsId: string) => void;
}

const QuoteCaseConsistencyErrorRow: React.FC<
  QuoteCaseConsistencyErrorRowProps
> = ({
  error,
  quoteCaseId,
  isLastError,
  deleteErrorReasons,
  onAddErrorComment,
  onDeleteError,
  onDeleteErrorComment,
  onUndoDeleteError,
}) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const isConseillerAndEdit = useIsConseiller();

  const handleDeleteConfirm = (
    quoteCaseId: string,
    errorDetailsId: string,
    reason: string
  ) => {
    if (!reason) {
      console.error("Raison de suppression manquante");
      return;
    }
    // TODO en attente Backend ?
    const foundReason = deleteErrorReasons?.find((r) => r.id === reason);
    const finalReason = foundReason ? foundReason.label : reason;
    onDeleteError(quoteCaseId, errorDetailsId, finalReason);
    setIsDeleteModalOpen(false);
  };

  const handleCommentSubmit = (
    quoteCaseId: string,
    errorDetailsId: string,
    comment: string
  ) => {
    // TODO en attente Backend ?
    onAddErrorComment(quoteCaseId, errorDetailsId, comment);
    setIsCommentModalOpen(false);
  };

  const hasDetails = error.solution || error.comment;

  return (
    <>
      <tr
        className={`font-bold ${isLastError ? "border-b-0" : "border-bottom-grey"}`}
      >
        <td className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <span
            className={
              error.deleted ? "line-through text-gray-500 opacity-50" : ""
            }
          >
            {error.title}
          </span>

          <div className="flex gap-2">
            {/* Bouton voir détails - visible pour tous si il y a du contenu */}
            {hasDetails && !error.deleted && (
              <button
                className="fr-btn fr-btn--tertiary fr-btn--sm shrink-0"
                onClick={() => setIsDetailsModalOpen(true)}
              >
                Voir détails
                {error.comment && (
                  <span className="fr-icon-message-2-fill fr-icon--sm ml-2" />
                )}
              </button>
            )}

            {/* Boutons conseiller uniquement */}
            {isConseillerAndEdit && !error.deleted && (
              <>
                {/* Ajouter commentaire si pas de commentaire */}
                {!error.comment && (
                  <button
                    className="fr-btn fr-btn--tertiary fr-icon-chat-new-line fr-btn--sm"
                    onClick={() => setIsCommentModalOpen(true)}
                    title="Ajouter un commentaire"
                  />
                )}

                {/* Supprimer erreur */}
                <button
                  className="fr-btn fr-btn--tertiary fr-icon-delete-line fr-btn--sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  title="Supprimer l'erreur"
                />
              </>
            )}

            {/* Annuler suppression */}
            {isConseillerAndEdit && error.deleted && (
              <button
                className="fr-btn fr-btn--tertiary fr-btn--sm"
                onClick={() => onUndoDeleteError(quoteCaseId, error.id)}
              >
                Annuler la suppression
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Modales */}
      <CommentErrorModal
        errorCategory={error.category}
        errorDetailsId={error.id}
        errorSolution={error.solution ?? undefined}
        errorTitle={error.title}
        initialComment={error.comment}
        isOpen={isCommentModalOpen}
        onAddErrorComment={handleCommentSubmit}
        onDeleteErrorComment={onDeleteErrorComment}
        onClose={() => setIsCommentModalOpen(false)}
        quoteCheckId={quoteCaseId}
      />

      <DeleteErrorModal
        deleteErrorReasons={deleteErrorReasons}
        errorCategory={error.category}
        errorDetailsId={error.id}
        errorTitle={error.title}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteError={handleDeleteConfirm}
        quoteCheckId={quoteCaseId}
      />

      {hasDetails && (
        <ErrorDetailsModal
          errorDetailsId={error.id}
          initialComment={error.comment || ""}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onSubmitComment={(comment) => {
            if (comment === "") {
              onDeleteErrorComment(quoteCaseId, error.id);
            } else {
              onAddErrorComment(quoteCaseId, error.id, comment);
            }
            setIsDetailsModalOpen(false);
          }}
          problem={error.problem || ""}
          solution={error.solution || ""}
          title={error.title}
        />
      )}
    </>
  );
};

export default QuoteCaseConsistencyErrorRow;
