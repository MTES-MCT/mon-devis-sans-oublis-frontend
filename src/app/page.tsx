import Image from "next/image";
import Link from "next/link";

const resources = [
  {
    title: "Lire le post-mortem",
    description:
      "Retrouvez l'analyse détaillée de ce qui a fonctionné, des obstacles rencontrés et des pistes d'amélioration pour la filière de la rénovation énergétique.",
    href: "https://beta.gouv.fr/startups/mon-devis-sans-oublis.html",
    tags: ["beta.gouv.fr"],
    icon: "/images/betagouv.png",
  },
  {
    title: "Référentiel Numérique des Travaux",
    description:
      "Retrouvez le socle commun de conformité pour harmoniser les pratiques de la filière.",
    href: "https://gitlab.com/rnt-public",
    tags: ["Open Source", "Gitlab"],
    icon: "/images/rnt.png",
  },
  {
    title: "Code source backend",
    description:
      "L'intégralité du code Mon Devis Sans Oublis est publié en open source. Backend, frontend et OCR sont disponibles librement.",
    href: "https://github.com/betagouv/mon-devis-sans-oublis-backend",
    tags: ["Open Source", "Github"],
    icon: "/images/code.png",
  },
  {
    title: "Code source OCR",
    description:
      "L'intégralité du code Mon Devis Sans Oublis est publié en open source. Backend, frontend et OCR sont disponibles librement.",
    href: "https://github.com/MTES-MCT/mon-devis-sans-oublis-backend-ocr",
    tags: ["Open Source", "Github"],
    icon: "/images/ocr.png",
  },
  {
    title: "Code source frontend",
    description:
      "L'intégralité du code Mon Devis Sans Oublis est publié en open source. Backend, frontend et OCR sont disponibles librement.",
    href: "https://github.com/betagouv/mon-devis-sans-oublis-frontend",
    tags: ["Open Source", "Github"],
    icon: "/images/frontend.png",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="fr-py-8w">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
            <div className="fr-col-12 fr-col-md-6">
              <p className="fr-badge fr-badge--warning fr-badge--no-icon fr-mb-3w inline-flex items-center">
                <span
                  className="fr-icon-warning-fill fr-icon--sm mr-1"
                  aria-hidden="true"
                />
                SERVICE FERMÉ LE 01 MAI 2026
              </p>
              <h1 className="fr-mb-3w">
                Mon Devis Sans Oublis
                <br />a cessé son activité
              </h1>
              <p className="fr-text--lg fr-mb-2w">
                Malgré des résultats prometteurs et plus de 11 000 devis
                analysés, les conditions nécessaires à un impact significatif
                auprès des particuliers et de la filière n&apos;étaient pas
                réunies.
              </p>
              <p className="fr-text--lg fr-mb-2w">
                En toute transparence et sans garanties d&apos;utilité réelle
                pour les usagers, la DGALN et la DINUM ont convenu de suspendre
                le service le 1er mai 2026.
              </p>
              <p className="fr-text--lg">
                Retrouvez les ressources liées ci-dessous 👇
              </p>
            </div>
            <div className="fr-col-12 fr-col-md-6 flex justify-center">
              <Image
                src="/images/hero.png"
                alt="Capture d'écran de l'outil Mon Devis Sans Oublis"
                width={500}
                height={400}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="fr-py-8w">
        <div className="fr-container">
          <h2 className="text-center fr-mb-6w">MDSO en quelques chiffres</h2>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-4">
              <span
                className="fr-icon-file-text-fill fr-icon--lg inline-block p-3 rounded-lg bg-[var(--background-contrast-grey)] fr-mb-3w"
                aria-hidden="true"
              />
              <p className="fr-text--lg">
                <strong>11 000+</strong> devis analysés
                <br />
                depuis janvier 2025
              </p>
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <span
                className="fr-icon-home-4-fill fr-icon--lg inline-block p-3 rounded-lg fr-mb-3w"
                style={{ backgroundColor: "#FEF3FD", color: "#6E445A" }}
                aria-hidden="true"
              />
              <p className="fr-text--lg">
                <strong>60%</strong> rénovation d&apos;ampleur
                <br />
                <strong>40%</strong> par geste
              </p>
            </div>
            <div className="fr-col-12 fr-col-md-4">
              <span
                className="fr-icon-account-circle-fill fr-icon--lg inline-block p-3 rounded-lg fr-mb-3w"
                style={{ backgroundColor: "#E3FDEB", color: "#4B9F6C" }}
                aria-hidden="true"
              />
              <p className="fr-text--lg">
                <strong>60%</strong> des utilisateurs
                <br />
                étaient des conseillers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ressources */}
      <section className="fr-py-8w bg-[var(--background-alt-grey)]">
        <div className="fr-container">
          <h2 className="fr-mb-6w">Ressources</h2>
          <div className="fr-grid-row fr-grid-row--gutters">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="fr-col-12 fr-col-sm-6 fr-col-lg-3"
              >
                <div className="fr-card fr-enlarge-link h-full bg-white border border-[var(--border-default-grey)]">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={resource.icon}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <div className="flex gap-2 fr-mb-2w flex-wrap">
                        {resource.tags.map((tag) => (
                          <span key={tag} className="fr-badge fr-badge--sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="fr-card__title">
                        <Link
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resource.title}
                        </Link>
                      </h3>
                      <p className="fr-card__desc">{resource.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
