import Link from "next/link";

import { richTextParser } from "@/utils";

export interface FooterProps {
  affiliatedMinistry: string;
  buttons: { href: string; label: string }[];
  organizationDescription: string;
  organizationLink: string;
  organizationName: string;
  bottomCopy: string;
}

const Footer: React.FC<FooterProps> = ({
  affiliatedMinistry,
  buttons,
  organizationDescription,
  organizationLink,
  organizationName,
  bottomCopy,
}) => {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <Link
              href={organizationLink}
              title={`Accueil - ${organizationName} - ${affiliatedMinistry.replace(/<br\s*\/?>/gi, " ")}`}
            >
              <p className="fr-logo">{richTextParser(affiliatedMinistry)}</p>
            </Link>
          </div>
          <div className="fr-footer__content">
            <div className="fr-footer__content-desc [&_a]:after:content-none!">
              {richTextParser(organizationDescription)}
            </div>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            {buttons.map((button, index) => (
              <li className="fr-footer__bottom-item" key={index}>
                <Link className="fr-footer__bottom-link" href={button.href}>
                  {button.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>{richTextParser(bottomCopy)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
