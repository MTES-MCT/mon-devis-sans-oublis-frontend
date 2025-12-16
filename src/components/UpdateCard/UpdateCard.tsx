import Image from "next/image";
import React from "react";

import { Badge, BadgeVariant } from "@/components";
import Link from "next/link";

interface UpdateCardProps {
  badges: { icon?: string; label: string; variant: string }[];
  buttons: { href: string; icon: string; label: string }[];
  description: React.ReactNode;
  image: string;
  title: string;
}

const UpdateCard: React.FC<UpdateCardProps> = ({
  badges,
  buttons,
  description,
  image,
  title,
}) => {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-[var(--border-default-grey)] bg-white p-10 md:flex-row fr-mb-6w">
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <ul className="fr-raw-list fr-badges-group fr-mb-2w flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <li key={index}>
                <p className={`fr-badge ${badge.variant}`}>{badge.label}</p>
              </li>
            ))}
          </ul>
          <h5 className="fr-mb-2w">{title}</h5>
          <div className="fr-mb-3w">{description}</div>
        </div>
        <ul className="fr-raw-list flex flex-wrap gap-4">
          {buttons.map((button, index) => (
            <li key={index}>
              <Link
                type="button"
                href={button.href}
                className={
                  `fr-btn fr-btn--secondary fr-btn--icon-right ` + button.icon
                }
              >
                {button.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Image
          alt={title}
          className="rounded-lg"
          height={500}
          src={image}
          width={500}
        />
      </div>
    </div>
  );
};

export default UpdateCard;
