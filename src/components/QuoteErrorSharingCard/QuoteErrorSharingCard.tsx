"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useConseillerRoutes, useUserProfile } from "@/hooks";
import { ErrorDetails, Gestes, QuoteCase } from "@/types";
import QuoteErrorSharingModal from "./QuoteErrorSharingCard.modal";
import { QUOTE_ERROR_SHARING_WORDING } from "./QuoteErrorSharingCard.wording";
import { useMatomo } from "@/hooks/useMatomo";
import { MATOMO_EVENTS } from "@/lib/constants/matomoEvents";

export interface QuoteErrorSharingCardProps {
  baseUrl?: string;
  className?: string;

  // Props pour QuoteCheck
  adminErrorList?: ErrorDetails[];
  gestesErrorList?: ErrorDetails[];
  gestes?: Gestes[];
  fileName?: string;

  // Props pour QuoteCase
  quoteCase?: QuoteCase;
}

const QuoteErrorSharingCard: React.FC<QuoteErrorSharingCardProps> = ({
  baseUrl = typeof window !== "undefined" ? window.location.origin : "",
  className,
  adminErrorList = [],
  gestesErrorList = [],
  gestes = [],
  fileName,
  quoteCase,
}) => {
  const pathname = usePathname();
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { isConseillerAndEdit } = useConseillerRoutes();
  const profile = useUserProfile();

  const { trackEvent } = useMatomo();

  const copyUrlToClipboard = () => {
    let targetUrl = pathname;

    // Si on est sur un devis dans un dossier, rediriger vers le devis seul
    const devisMatch = pathname.match(/\/devis\/([^\/]+)/);
    if (devisMatch) {
      const devisId = devisMatch[1];
      // Construire l'URL avec le profil si disponible
      targetUrl = profile
        ? `/${profile}/devis/${devisId}`
        : `/devis/${devisId}`;
    }

    // Gérer le mode édition conseiller
    const finalUrl = isConseillerAndEdit
      ? targetUrl.replace(/\/modifier$/, "")
      : targetUrl;

    const fullUrl = `${baseUrl}${finalUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setIsUrlCopied(true);
  };

  const handleOpenModal = () => {
    trackEvent(MATOMO_EVENTS.BUTTON_EXPORT_FOR_MAIL);
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
        gestesErrorList={gestesErrorList}
        gestes={gestes}
        fileName={fileName}
        quoteCase={quoteCase}
      />
    </>
  );
};

export default QuoteErrorSharingCard;
