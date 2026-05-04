import Link from "next/link";

import { richTextParser } from "@/utils";

export interface HeaderProps {
  affiliatedMinistry: string;
  organizationDescription: string;
  organizationLink: string;
  organizationName: string;
}

const Header: React.FC<HeaderProps> = ({
  affiliatedMinistry,
  organizationDescription,
  organizationLink,
  organizationName,
}) => {
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
              </div>
              <div className="fr-header__service">
                <div className="hover:bg-[var(--background-raised-grey-hover)] active:bg-[var(--background-raised-grey-active)]">
                  <Link
                    className="items-center"
                    href={organizationLink}
                    title={`Accueil - ${organizationName} - ${affiliatedMinistry.replace(/<br\s*\/?>/gi, " ")}`}
                  >
                    <p className="fr-header__service-title">
                      {organizationName}
                    </p>
                    <p className="fr-header__service-tagline">
                      {organizationDescription}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
