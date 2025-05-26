"use client";

import { useState } from "react";
import { ErrorDetails } from "@/types";
import {
  generateEmailContent,
  getModalTitle,
} from "./QuoteErrorSharingCard.modal.content";
import Modal, { ModalPosition } from "../Modal/Modal";
import { QUOTE_ERROR_SHARING_WORDING } from "./QuoteErrorSharingCard.wording";

export interface QuoteErrorSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorsList: ErrorDetails[];
}

const QuoteErrorSharingModal: React.FC<QuoteErrorSharingModalProps> = ({
  isOpen,
  onClose,
  errorsList,
}) => {
  const [emailContent, setEmailContent] = useState(() =>
    generateEmailContent(errorsList)
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position={ModalPosition.CENTER}
      backButtonLabel={QUOTE_ERROR_SHARING_WORDING.modal.close}
      className="z-50"
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        <div className="mb-4">
          <h4
            id="share-errors-title"
            className="text-[var(--text-title-grey)]! fr-mb-1w flex items-center gap-2"
          >
            {QUOTE_ERROR_SHARING_WORDING.modal.title}
          </h4>

          <p className="text-xs text-[var(--text-mention-grey)]">
            {QUOTE_ERROR_SHARING_WORDING.modal.subTitle}
          </p>
        </div>

        <div className="flex-1 mb-4">
          <textarea
            id="email-content"
            className="fr-input w-full h-128 resize-none font-mono text-sm"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            className={`fr-btn fr-btn--icon-left ${
              isCopied
                ? "fr-btn--secondary fr-icon-check-line"
                : "fr-icon-clipboard-line"
            }`}
            onClick={handleCopyToClipboard}
          >
            {isCopied
              ? QUOTE_ERROR_SHARING_WORDING.modal.copied
              : QUOTE_ERROR_SHARING_WORDING.modal.copy}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuoteErrorSharingModal;
