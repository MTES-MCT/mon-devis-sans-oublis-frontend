"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useConseillerRoutes } from "@/hooks";
import wording from "@/wording";
import { ErrorDetails } from "@/types";

export interface QuoteErrorSharingCardProps {
  baseUrl?: string;
  className?: string;
  errorsList?: ErrorDetails[];
}

const QuoteErrorSharingCard: React.FC<QuoteErrorSharingCardProps> = ({
  baseUrl = typeof window !== "undefined" ? window.location.origin : "",
  className,
  errorsList = [],
}) => {
  if (errorsList.length > 0) {
    console.log("errorsList :>> ", errorsList);
  }

  const pathname = usePathname();
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);

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

  return (
    <div
      className={`bg-[var(--background-alt-grey)] border-shadow flex items-start gap-6 px-4 py-6 rounded-lg w-fit ${className}`}
    >
      <Image
        alt={wording.components.quote_status_link.share.image_alt}
        className="shrink-0"
        height={32}
        src={wording.components.quote_status_link.share.image_src}
        width={32}
      />
      <div className="flex flex-col">
        <h5 className="fr-mb-2w">
          {wording.components.quote_status_link.share.title}
        </h5>
        <span className="flex flex-row gap-4">
          <button className="fr-btn fr-btn--sm fr-btn--icon-right fr-icon-align-left">
            {wording.components.quote_status_link.share.button_share_for_email}
          </button>
          <button
            className={`fr-btn ${
              isUrlCopied && "fr-btn--secondary"
            } fr-btn--sm shrink-0 self-start fr-btn--icon-right ${
              isUrlCopied ? "fr-icon-check-line" : "fr-icon-share-box-line"
            }`}
            onClick={copyUrlToClipboard}
          >
            {isUrlCopied
              ? wording.components.quote_status_link.share.button_copied_url
              : wording.components.quote_status_link.share.button_copy_url}
          </button>
        </span>
      </div>
    </div>
  );
};

export default QuoteErrorSharingCard;
