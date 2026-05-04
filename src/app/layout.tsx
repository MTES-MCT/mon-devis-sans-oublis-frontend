import type { Metadata } from "next";

import { DsfrProvider, Footer, FooterProps, Header, HeaderProps } from "@/components";
import "@/utils/dsfr";
import { marianne, spectral } from "../styles/fonts";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mon Devis Sans Oublis — Service fermé",
  description:
    "Mon Devis Sans Oublis a cessé son activité le 1er mai 2026. Retrouvez les ressources liées au projet.",
  metadataBase: new URL("https://mon-devis-sans-oublis.beta.gouv.fr"),
  openGraph: {
    title: "Mon Devis Sans Oublis — Service fermé",
    description:
      "Mon Devis Sans Oublis a cessé son activité le 1er mai 2026. Retrouvez les ressources liées au projet.",
    url: "https://mon-devis-sans-oublis.beta.gouv.fr",
    siteName: "Mon Devis Sans Oublis",
    locale: "fr_FR",
    type: "website",
  },
};

const headerData: HeaderProps = {
  affiliatedMinistry:
    "Ministère<br>de la transition<br>écologique",
  organizationDescription: "Vérifiez vos devis de rénovation énergétique",
  organizationLink: "/",
  organizationName: "Mon Devis Sans Oublis",
};

const footerData: FooterProps = {
  affiliatedMinistry:
    "Ministère<br>de la transition<br>écologique",
  buttons: [
    { href: "/accessibilite", label: "Accessibilité : partiellement conforme" },
    { href: "/mentions-legales", label: "Mentions légales" },
  ],
  organizationDescription:
    "Mon Devis Sans Oublis est un service public conçu par la <a href='https://www.ecologie.gouv.fr/direction-generale-lamenagement-du-logement-et-nature-dgaln' target='_blank' rel='noopener noreferrer'>Direction générale de l'aménagement, du logement et de la nature (DGALN)</a> en partenariat avec le programme <a href='https://beta.gouv.fr' target='_blank' rel='noopener noreferrer'>beta.gouv</a>.",
  organizationLink: "/",
  organizationName: "Mon Devis Sans Oublis",
  bottomCopy:
    "Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont proposés sous <a href='https://github.com/etalab/licence-ouverte/blob/master/LO.md' rel='noopener noreferrer' target='_blank'>licence etalab-2.0</a>",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${marianne.variable} ${spectral.variable}`}
      data-fr-scheme="system"
      lang="fr"
    >
      <head />
      <body className="flex flex-col min-h-screen">
        <DsfrProvider>
          <Header {...headerData} />
          <main className="flex-1">{children}</main>
          <Footer {...footerData} />
        </DsfrProvider>
      </body>
    </html>
  );
}
