"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

  const { trackEvent } = useMatomo();

  const isQuoteCase = !!quoteCase;

  const copyUrlToClipboard = () => {
    let targetUrl = pathname;

    // Extraire l'ID du devis s'il existe dans l'URL
    const devisMatch = pathname.match(/\/devis\/([^\/]+)/);

    // Extraire l'ID du dossier s'il existe dans l'URL
    const dossierMatch = pathname.match(/\/dossier\/([^\/]+)/);

    if (devisMatch) {
      // Si on est sur un devis, rediriger vers /devis/ID (sans profil)
      const devisId = devisMatch[1];
      targetUrl = `/devis/${devisId}`;
    } else if (dossierMatch) {
      // Si on est sur un dossier, rediriger vers /dossier/ID (sans profil)
      const dossierId = dossierMatch[1];
      targetUrl = `/dossier/${dossierId}`;
    } else {
      // Fallback : supprimer le profil de l'URL actuelle si présent
      // Regex pour matcher /{profile}/quelque-chose
      const profileMatch = pathname.match(
        /^\/(artisan|conseiller|particulier)(\/.*)?$/
      );
      if (profileMatch && profileMatch[2]) {
        // Si on a un profil suivi d'un chemin, prendre seulement le chemin
        targetUrl = profileMatch[2];
      } else if (profileMatch && !profileMatch[2]) {
        // Si on a seulement un profil (ex: /artisan), rediriger vers /
        targetUrl = "/";
      }
      // Sinon, garder l'URL actuelle
    }

    const fullUrl = `${baseUrl}${targetUrl}`;
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
        className={`bg-[var(--background-alt-grey)] border-shadow flex items-start gap-6 px-4 py-6 rounded-lg w-full max-w-fit ${className}`}
      >
        <Image
          alt={QUOTE_ERROR_SHARING_WORDING.image_alt}
          className="shrink-0"
          height={32}
          src={QUOTE_ERROR_SHARING_WORDING.image_src}
          width={32}
        />
        <div className="flex flex-col h-full justify-between min-h-[80px] min-w-0 flex-1">
          <h5 className="fr-mb-2w">
            {QUOTE_ERROR_SHARING_WORDING.getTitle(isQuoteCase)}
          </h5>
          <span className="flex flex-col lg:flex-row gap-2 lg:gap-4 mt-auto">
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
