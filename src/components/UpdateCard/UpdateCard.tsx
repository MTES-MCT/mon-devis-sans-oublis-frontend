"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface UpdateCardProps {
  badges: { icon?: string; label: string; variant: string }[];
  buttons: {
    href: string;
    icon: string;
    label: string;
    copyText?: string;
    external?: boolean;
  }[];
  description: React.ReactNode;
  image: string;
  title: string;
  id: string;
}

const UpdateCard: React.FC<UpdateCardProps> = ({
  badges,
  buttons,
  description,
  image,
  title,
  id,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-[var(--border-default-grey)] bg-white p-10 md:flex-row fr-mb-6w">
      <div className="flex flex-1 flex-col justify-between" id={id}>
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
              {button.copyText ? (
                <button
                  type="button"
                  onClick={() => handleCopy(button.copyText!, index)}
                  className={`fr-btn fr-btn--secondary fr-btn--icon-right ${button.icon}`}
                >
                  {copiedIndex === index ? "Copié !" : button.label}
                </button>
              ) : (
                <Link
                  href={button.href}
                  className={`fr-btn fr-btn--secondary fr-btn--icon-right ${button.icon}`}
                  {...(button.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                >
                  {button.label}
                </Link>
              )}
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
