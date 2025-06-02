"use client";

import { useState, useEffect } from "react";
import { GLOBAL_COMMENT_WORDING } from "./GlobalComment.wording";

interface GlobalCommentProps {
  comment: string;
  isEditable: boolean;
  quoteCheckId: string;
  onAddComment?: (quoteCheckId: string, comment: string) => void;
  onDeleteComment?: (quoteCheckId: string) => void;
  onOpenModal: () => void;
  className?: string;
  placement?: "button" | "zone"; // Nouveau prop pour définir le placement
}

export default function GlobalComment({
  comment,
  isEditable,
  quoteCheckId,
  onAddComment,
  onDeleteComment,
  onOpenModal,
  className = "",
  placement = "zone",
}: GlobalCommentProps) {
  const [editedComment, setEditedComment] = useState(comment || "");

  useEffect(() => {
    setEditedComment(comment || "");
  }, [comment]);

  // Si placement = "button", on ne retourne que le bouton d'ajout
  if (placement === "button") {
    // Ne retourne le bouton que si on est en mode édition ET qu'il n'y a pas de commentaire
    if (isEditable && (!comment || comment === "")) {
      return (
        <button
          className="fr-btn fr-btn--icon-left fr-btn--tertiary fr-btn--sm shrink-0 fr-icon-chat-new-line"
          onClick={onOpenModal}
        >
          {GLOBAL_COMMENT_WORDING.global_comment_title}
        </button>
      );
    }
    return null;
  }

  // Si placement = "zone", on gère les zones de commentaire
  if (placement === "zone") {
    // État 1: Lecture seule
    if (!isEditable && comment && comment !== "") {
      return (
        <div
          className={`flex flex-row p-6 rounded-lg bg-[var(--background-alt-grey)] w-full ${className}`}
        >
          <div className="pl-6 pr-2 w-full">
            <h6 className="fr-mb-2w">
              <span className="fr-icon-message-2-fill fr-mr-2v text-[var(--background-action-high-blue-france)] text-2xl" />
              {GLOBAL_COMMENT_WORDING.global_comment_title}
            </h6>
            <p className="whitespace-pre-wrap m-0! p-O!">{comment}</p>
          </div>
        </div>
      );
    }

    // État 2: Édition complète
    if (isEditable && comment && comment !== "") {
      return (
        <div
          className={`flex flex-row p-6 rounded-lg bg-[var(--background-alt-grey)] w-full ${className}`}
        >
          <div className="px-6 w-full">
            <h6 className="fr-mb-1w">
              <span className="fr-icon-message-2-fill fr-mr-2v text-[var(--background-action-high-blue-france)] text-2xl" />
              {GLOBAL_COMMENT_WORDING.global_comment_title}
            </h6>
            <textarea
              className="fr-input h-[200px] w-full whitespace-pre-wrap"
              maxLength={1000}
              onChange={(e) => setEditedComment(e.target.value)}
              value={editedComment}
            />
            <div className="fr-hint-text text-right mb-3 mt-2">
              {editedComment.length}/
              {GLOBAL_COMMENT_WORDING.editable_1000_characters}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="fr-btn fr-btn--secondary"
                onClick={() => setEditedComment(comment || "")}
              >
                {GLOBAL_COMMENT_WORDING.cancel}
              </button>
              <button
                className="fr-btn fr-btn--primary"
                disabled={!editedComment.trim() || editedComment === comment}
                onClick={() => onAddComment?.(quoteCheckId, editedComment)}
              >
                {GLOBAL_COMMENT_WORDING.save}
              </button>
            </div>
          </div>
          <div className="relative">
            <button
              className="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-delete-line"
              onClick={() => onDeleteComment?.(quoteCheckId)}
            />
          </div>
        </div>
      );
    }
  }

  // Cas par défaut: rien à afficher
  return null;
}
