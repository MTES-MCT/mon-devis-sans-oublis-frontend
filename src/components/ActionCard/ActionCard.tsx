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
    <div className="rounded-lg border-2 border-[var(--border-action-high-blue-france)] bg-white p-6">
      <p className="fr-mb-2w">{description}</p>
      <Link
        href={buttonHref}
        className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right"
      >
        {buttonLabel}
      </Link>
    </div>
  );
};

export default ActionCard;
