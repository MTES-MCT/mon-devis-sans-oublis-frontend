"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useConseillerRoutes } from "@/hooks";
import { ErrorDetails, Gestes } from "@/types";
import QuoteErrorSharingModal from "./QuoteErrorSharingCard.modal";
import { QUOTE_ERROR_SHARING_WORDING } from "./QuoteErrorSharingCard.wording";

export interface QuoteErrorSharingCardProps {
  baseUrl?: string;
  className?: string;
  adminErrorList?: ErrorDetails[];
  gestes: Gestes[];
  fileName?: string;
}

const QuoteErrorSharingCard: React.FC<QuoteErrorSharingCardProps> = ({
  baseUrl = typeof window !== "undefined" ? window.location.origin : "",
  className,
  adminErrorList = [],
  gestes = [],
  fileName,
}) => {
  const pathname = usePathname();
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { isConseillerAndEdit } = useConseillerRoutes();

  const nonEditionPath = pathname.replace(/\/modifier$/, "");

  const copyUrlToClipboard = () => {
    /* istanbul ignore next */
    const fullUrl = isConseillerAndEdit
      ? `${baseUrl}${nonEditionPath}`
      : `${baseUrl}${pathname}`;

    navigator.clipboard.writeText(fullUrl);
    setIsUrlCopied(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`bg-[var(--background-alt-grey)] border-shadow flex items-start gap-6 px-4 py-6 rounded-lg w-fit ${className}`}
      >
        <Image
          alt={QUOTE_ERROR_SHARING_WORDING.image_alt}
          className="shrink-0"
          height={32}
          src={QUOTE_ERROR_SHARING_WORDING.image_src}
          width={32}
        />
        <div className="flex flex-col">
          <h5 className="fr-mb-2w">{QUOTE_ERROR_SHARING_WORDING.title}</h5>
          <span className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              className="fr-btn fr-btn--sm fr-btn--icon-right fr-icon-align-left"
              onClick={handleOpenModal}
            >
              {QUOTE_ERROR_SHARING_WORDING.button_share_for_email}
            </button>
            <button
              className={`fr-btn ${
                isUrlCopied && "fr-btn--secondary"
              } fr-btn--sm shrink-0 self-start fr-btn--icon-right ${
                isUrlCopied ? "fr-icon-check-line" : "fr-icon-link"
              }`}
              onClick={copyUrlToClipboard}
            >
              {isUrlCopied
                ? QUOTE_ERROR_SHARING_WORDING.button_copied_url
                : QUOTE_ERROR_SHARING_WORDING.button_copy_url}
            </button>
          </span>
        </div>
      </div>

      <QuoteErrorSharingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        adminErrorList={adminErrorList}
        gestes={gestes}
        fileName={fileName}
      />
    </>
  );
};

export default QuoteErrorSharingCard;
