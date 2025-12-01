"use client";

import Link from "next/link";
import { useState } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
  className?: string;
}

export default function Breadcrumb({
  items,
  ariaLabel = "vous êtes ici :",
  className = "",
}: BreadcrumbProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const breadcrumbId = "breadcrumb-collapse";

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      role="navigation"
      className={`fr-breadcrumb ${className}`}
      aria-label={ariaLabel}
    >
      <button
        className="fr-breadcrumb__button"
        aria-expanded={isExpanded}
        aria-controls={breadcrumbId}
        onClick={toggleExpanded}
      >
        Voir le fil d'Ariane
      </button>

      <div
        className={`fr-collapse ${isExpanded ? "fr-collapse--expanded" : ""}`}
        id={breadcrumbId}
      >
        <ol className="fr-breadcrumb__list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index}>
                {isLast ? (
                  <span className="fr-breadcrumb__link" aria-current="page">
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link className="fr-breadcrumb__link" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="fr-breadcrumb__link" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
