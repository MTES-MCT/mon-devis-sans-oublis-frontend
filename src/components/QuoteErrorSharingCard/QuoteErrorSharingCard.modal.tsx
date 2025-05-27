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
      <div className="flex flex-col h-full">
        <h4
          id="share-errors-title"
          className="fr-mb-1w flex items-center gap-2"
        >
          {QUOTE_ERROR_SHARING_WORDING_MODAL.title}
        </h4>

        <p className="text-xs text-[var(--text-mention-grey)] fr-mb-2w">
          {QUOTE_ERROR_SHARING_WORDING_MODAL.subTitle}
        </p>

        <div className="flex justify-end fr-mb-2w">
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
                  {QUOTE_ERROR_SHARING_WORDING_MODAL.show_preview}
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
                  {QUOTE_ERROR_SHARING_WORDING_MODAL.html_preview}
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="fr-input-group flex-1 min-h-0">
          {showHTML ? (
            <textarea
              id="email-content"
              className="fr-input resize-none font-mono text-sm"
              style={{ height: "400px", maxHeight: "60vh" }}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          ) : (
            <div
              className="p-4 bg-white border rounded text-base leading-relaxed overflow-y-auto"
              style={{ height: "400px", maxHeight: "60vh" }}
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            className={`fr-btn fr-btn--icon-left ${
              isCopied
                ? "fr-btn--secondary fr-icon-check-line"
                : "fr-icon-clipboard-line"
            }`}
            onClick={handleCopy}
            type="button"
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
