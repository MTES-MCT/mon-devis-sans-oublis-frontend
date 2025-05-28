import Link from "next/link";

import Badge, { BadgeVariant } from "../Badge/Badge";
import { richTextParser } from "@/utils";

export interface HeaderProps {
  affiliatedMinistry: string;
  beta?: string;
  buttons?: { href: string; icon: string; label: string }[];
  organizationDescription: string;
  organizationLink: string;
  organizationName: string;
}

const Header: React.FC<HeaderProps> = ({
  affiliatedMinistry,
  beta,
  buttons,
  organizationDescription,
  organizationLink,
  organizationName,
}) => {
  return (
    <header className="fr-header" role="banner">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand cursor-default">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    {richTextParser(affiliatedMinistry)}
                  </p>
                </div>
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
            {buttons && (
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-btns-group">
                    {buttons.map((button, index) => (
                      <li key={index}>
                        <Link
                          className={`fr-btn ${button.icon}`}
                          href={button.href}
                        >
                          {button.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
