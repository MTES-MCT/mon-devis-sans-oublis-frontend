"use client";

import { useState } from "react";
import { ErrorDetails, Gestes } from "@/types";
import { generateEmailContent } from "./QuoteErrorSharingCard.modal.content";
import { handleCopyToClipboard } from "./QuoteErrorSharingCard.modal.utils";
import Modal, { ModalPosition } from "../Modal/Modal";
import { QUOTE_ERROR_SHARING_WORDING_MODAL } from "./QuoteErrorSharingCard.modal.wording";

export interface QuoteErrorSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminErrorList: ErrorDetails[];
  gestes: Gestes[];
  fileName?: string;
}

const QuoteErrorSharingModal: React.FC<QuoteErrorSharingModalProps> = ({
  isOpen,
  onClose,
  adminErrorList,
  gestes = [],
  fileName = "",
}) => {
  const [emailContent, setEmailContent] = useState(() =>
    generateEmailContent(adminErrorList, gestes, fileName)
  );
  const [isCopied, setIsCopied] = useState(false);
  const [showHTML, setShowHTML] = useState(false);

  const handleCopy = () => handleCopyToClipboard(emailContent, setIsCopied);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position={ModalPosition.CENTER}
      backButtonLabel={QUOTE_ERROR_SHARING_WORDING_MODAL.close}
      className="z-50"
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        <div className="mb-4">
          <h4
            id="share-errors-title"
            className="text-[var(--text-title-grey)]! fr-mb-1w flex items-center gap-2"
          >
            {QUOTE_ERROR_SHARING_WORDING_MODAL.title}
          </h4>

          <div className="flex justify-between items-center">
            <p className="text-xs text-[var(--text-mention-grey)]">
              {QUOTE_ERROR_SHARING_WORDING_MODAL.subTitle}
            </p>

            <fieldset className="fr-segmented fr-segmented--sm">
              <div className="fr-segmented__elements">
                <div className="fr-segmented__element">
                  <input
                    value="preview"
                    type="radio"
                    id="display-mode-preview"
                    name="display-mode"
                    checked={!showHTML}
                    onChange={() => setShowHTML(false)}
                  />
                  <label className="fr-label" htmlFor="display-mode-preview">
                    Aperçu
                  </label>
                </div>
                <div className="fr-segmented__element">
                  <input
                    value="html"
                    type="radio"
                    id="display-mode-html"
                    name="display-mode"
                    checked={showHTML}
                    onChange={() => setShowHTML(true)}
                  />
                  <label className="fr-label" htmlFor="display-mode-html">
                    HTML
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="flex-1 mb-4">
          {showHTML ? (
            <textarea
              id="email-content"
              className="fr-input w-full h-128 resize-none font-mono text-sm"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          ) : (
            <div
              className="w-full h-128 overflow-y-auto p-4 bg-white border rounded text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            className={`fr-btn fr-btn--icon-left ${
              isCopied
                ? "fr-btn--secondary fr-icon-check-line"
                : "fr-icon-clipboard-line"
            }`}
            onClick={handleCopy}
          >
            {isCopied
              ? QUOTE_ERROR_SHARING_WORDING_MODAL.copied
              : QUOTE_ERROR_SHARING_WORDING_MODAL.copy}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuoteErrorSharingModal;
