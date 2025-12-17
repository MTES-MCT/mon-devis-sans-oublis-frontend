import type { Metadata } from "next";

import {
  DsfrProvider,
  Footer,
  FooterProps,
  Header,
  HeaderProps,
  Matomo,
} from "@/components";
import "@/utils/dsfr";
import wording from "@/wording";
import { marianne, spectral } from "../styles/fonts";
import "../styles/globals.css";
import CrispWrapper from "@/components/Crisp/Crisp";

export const metadata: Metadata = {
  title:
    "Mon Devis Sans Oublis: vérifier un devis MaPrimeRénov’, Eco PTZ ou Aides CEE",
  description:
    "Plateforme publique et gratuite de pré-instruction automatique des devis de rénovation énergétique pour MaPrimeRenov, Eco PTZ et les CEE.",
  metadataBase: new URL("https://mon-devis-sans-oublis.beta.gouv.fr"),
  openGraph: {
    title:
      "Devis Sans Oublis: vérifier un devis MaPrimeRénov’, Eco PTZ ou Aides CEE",
    description:
      "Plateforme publique et gratuite de pré-instruction automatique des devis de rénovation énergétique pour MaPrimeRenov, Eco PTZ et les CEE.",
    url: "https://mon-devis-sans-oublis.beta.gouv.fr",
    siteName: "Mon Devis Sans Oublis",
    images: [
      {
        url: "/images/steps_analyze_quote/quote_control.webp",
        width: 1200,
        height: 630,
        alt: "Mon Devis Sans Oublis - Plateforme de pré-instruction automatique des devis de rénovation énergétique",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Devis Sans Oublis",
    description:
      "Plateforme publique et gratuite de pré-instruction automatique des devis de rénovation énergétique pour MaPrimeRenov' et les CEE.",
    images: ["/images/steps_analyze_quote/quote_control.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData: FooterProps = wording.layout.footer;
  const headerData: HeaderProps = wording.layout.header;

  return (
    <html
      className={`${marianne.variable} ${spectral.variable}`}
      data-fr-scheme="system"
      lang="fr"
    >
      <head>{/* ... inchangé */}</head>
      <body className="flex flex-col min-h-screen">
        <DsfrProvider>
          <Matomo />
          <CrispWrapper />
          <Header {...headerData} />
          <main className="flex-1">{children}</main>
          <Footer {...footerData} />
        </DsfrProvider>
      </body>
    </html>
  );
}
