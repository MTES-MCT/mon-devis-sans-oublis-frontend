import Link from "next/link";

import { richTextParser } from "@/utils";
import wording from "@/wording";

export interface FooterProps {
  affiliatedMinistry: string;
  buttons: { href: string; label: string }[];
  organizationDescription: string;
  organizationLink: string;
  organizationName: string;
}

const Footer: React.FC<FooterProps> = ({
  affiliatedMinistry,
  buttons,
  organizationDescription,
  organizationLink,
  organizationName,
}) => {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer-7361">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <Link
              href={organizationLink}
              title={`Accueil - ${organizationName} - ${affiliatedMinistry}`}
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
            <p>{richTextParser(wording.components.footer.bottom_copy_line)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
