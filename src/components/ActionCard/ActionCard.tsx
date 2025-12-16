import Link from "next/link";
import React from "react";

interface ActionCardProps {
  description: React.ReactNode;
  buttonLabel: string;
  buttonHref: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  description,
  buttonLabel,
  buttonHref,
}) => {
  return (
    <div className="flex h-full w-full flex-col justify-center rounded-lg border-2 border-[var(--border-action-high-blue-france)] bg-[var(--background-alt-blue-france)] p-6">
      <div className="fr-mb-6w">{description}</div>
      <Link
        href={buttonHref}
        className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right self-start"
      >
        {buttonLabel}
      </Link>
    </div>
  );
};

export default ActionCard;
