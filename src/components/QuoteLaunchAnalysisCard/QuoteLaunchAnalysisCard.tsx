"use client";

import Image from "next/image";

import Link, { LinkSize, LinkVariant } from "../Link/Link";
import wording from "@/wording";
import { useUserProfile } from "@/hooks";

export interface QuoteLaunchAnalysisCardProps {
  className?: string;
}

const QuoteLaunchAnalysisCard: React.FC<QuoteLaunchAnalysisCardProps> = ({
  className,
}) => {
  const profile = useUserProfile();
  return (
    <div
      className={`bg-[var(--background-alt-grey)] border-shadow flex items-start gap-6 px-4 py-6 rounded-lg w-fit ${className}`}
    >
      <Image
        alt={wording.components.quote_status_link.upload.image_alt}
        className="shrink-0"
        height={32}
        src={wording.components.quote_status_link.upload.image_src}
        width={32}
      />
      <div className="flex flex-col h-full justify-between min-h-[80px]">
        <h6 className="fr-mb-2w">
          {wording.components.quote_status_link.upload.title}
        </h6>
        <Link
          href={`/${profile}/type-renovation`}
          label={
            wording.components.quote_status_link.upload.button_run_analysis
          }
          icon="fr-icon-add-line"
          size={LinkSize.SMALL}
          variant={LinkVariant.SECONDARY}
          className="mt-auto"
        />
      </div>
    </div>
  );
};

export default QuoteLaunchAnalysisCard;
