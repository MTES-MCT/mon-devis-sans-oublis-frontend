import Image from "next/image";

import wording from "@/wording";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="fr-container-fluid fr-py-10w bg-[var(--background-default-grey-hover)]">
      <div className="fr-container">
        <div className="flex flex-col md:flex-row md:justify-between justify-center md:items-start items-center">
          <div className="fr-col-12 fr-col-md-5">
            <h1>{wording.homepage.hero_section.title}</h1>
            <p className=" fr-mb-2w fr-mt-1w md:fr-mb-0 md:fr-mt-0">
              {wording.homepage.hero_section.subtitle}
            </p>
            <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
              {wording.homepage.hero_section.badges.map((badge, index) => (
                <li key={index}>
                  <p className="fr-badge fr-badge--green-menthe">
                    {badge.label}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              type="button"
              href={wording.homepage.check_quote_button.href}
              className="fr-btn fr-btn--lg fr-icon-arrow-right-line fr-btn--icon-right"
            >
              {wording.homepage.check_quote_button.label}
            </Link>
            <p className="fr-mb-1w fr-mt-1w md:fr-mb-0 md:fr-mt-0">
              {wording.homepage.hero_section.or}
            </p>
            <strong>
              <Link
                id="link-16"
                href={wording.homepage.hero_section.email_button.href}
                target="_self"
                className="fr-link fr-icon-mail-fill fr-link--icon-left fr-mb-1w fr-mt-1w md:fr-mb-0 md:fr-mt-0"
              >
                {wording.homepage.hero_section.email_button.label}
              </Link>
            </strong>
            <p className="fr-text--sm fr-mb-1w fr-mt-1w md:fr-mb-0 md:fr-mt-0">
              {wording.homepage.hero_section.email_explanation}
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              alt={wording.homepage.hero_section.image.alt}
              priority
              quality={95}
              width={550}
              height={550}
              src={wording.homepage.hero_section.image.src}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
