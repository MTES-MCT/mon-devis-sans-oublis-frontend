"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Badge, { BadgeVariant } from "../Badge/Badge";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export interface HeaderProps {
  affiliatedMinistry: string;
  beta?: string;
  organizationDescription: string;
  organizationLink: string;
  organizationName: string;
}

const Header: React.FC<HeaderProps> = ({
  affiliatedMinistry,
  beta,
  organizationDescription,
  organizationLink,
  organizationName,
}) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fr-header" role="banner">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    {richTextParser(affiliatedMinistry)}
                  </p>
                </div>
                {isHome && (
                  <div className="fr-header__navbar">
                    <button
                      data-fr-opened="false"
                      aria-controls="header-menu-modal"
                      title="Menu"
                      type="button"
                      id="header-menu-btn"
                      className="fr-btn--menu fr-btn"
                    >
                      Menu
                    </button>
                  </div>
                )}
              </div>
              <div className="fr-header__service">
                <div className="hover:bg-[var(--background-raised-grey-hover)] active:bg-[var(--background-raised-grey-active)]">
                  <Link
                    className="items-center"
                    href={organizationLink}
                    title={`Accueil - ${organizationName} - ${affiliatedMinistry}`}
                  >
                    <span className="flex flex-row">
                      <p className="fr-header__service-title mr-4!">
                        {organizationName}
                      </p>
                      {beta && (
                        <Badge label={beta} variant={BadgeVariant.GREEN} />
                      )}
                    </span>
                    <p className="fr-header__service-tagline">
                      {organizationDescription}
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {isHome && (
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-btns-group">
                    <li>
                      <Link
                        href={wording.homepage.check_quote_button.href}
                        className="fr-btn fr-btn--account fr-icon-arrow-right-line fr-btn--icon-right"
                      >
                        {wording.homepage.check_quote_button.label}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isHome && (
        <div
          className="fr-header__menu fr-modal"
          id="header-menu-modal"
          aria-labelledby="header-menu-btn"
        >
          <div className="fr-container">
            <button
              aria-controls="header-menu-modal"
              title="Fermer"
              type="button"
              className="fr-btn--close fr-btn"
            >
              Fermer
            </button>
            <div className="fr-header__menu-links">
              <ul className="fr-btns-group">
                <li>
                  <Link
                    href={wording.homepage.check_quote_button.href}
                    className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right"
                  >
                    {wording.homepage.check_quote_button.label}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
