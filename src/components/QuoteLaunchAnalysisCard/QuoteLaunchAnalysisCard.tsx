"use client";

import Image from "next/image";

import Link, { LinkSize, LinkVariant } from "../Link/Link";
import { useGoBackToUpload } from "@/hooks";
import wording from "@/wording";

export interface QuoteLaunchAnalysisCardProps {
  baseUrl?: string;
  className?: string;
}

const QuoteLaunchAnalysisCard: React.FC<QuoteLaunchAnalysisCardProps> = ({
  className,
}) => {
  const goBackToUpload = useGoBackToUpload();

  return (
    <div
      className={`bg-[var(--background-alt-grey)] border-shadow flex items-center gap-6 px-4 py-6 rounded-lg w-fit ${className}`}
    >
      <Image
        alt={wording.components.quote_status_link.upload.image_alt}
        className="shrink-0"
        height={80}
        src={wording.components.quote_status_link.upload.image_src}
        width={80}
      />
      <div className="flex flex-col">
        <h6 className="fr-mb-2w">
          {wording.components.quote_status_link.upload.title}
        </h6>
        <Link
          href={goBackToUpload}
          label={
            wording.components.quote_status_link.upload.button_run_analysis
          }
          icon="fr-icon-add-line"
          legacyBehavior
          size={LinkSize.SMALL}
          variant={LinkVariant.SECONDARY}
        />
      </div>
    </div>
  );
};

export default QuoteLaunchAnalysisCard;
