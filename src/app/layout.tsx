import type { Metadata } from "next";

import { Footer, FooterProps, Header, HeaderProps, Matomo } from "@/components";
import { initDsfr } from "@/utils";
import wording from "@/wording";
import { marianne, spectral } from "../styles/fonts";
import "../styles/globals.css";

// DSFR initialization
initDsfr();

export const metadata: Metadata = {
  title: "Mon Devis Sans Oublis",
  description: "Vérifiez vos devis de rénovation énergétique",
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
      <head>
        <meta
          content="telephone=no,date=no,address=no,email=no,url=no"
          name="format-detection"
        />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />
        <meta content="#000091" name="theme-color" />
        <link
          href="/dsfr/favicon/apple-touch-icon.png"
          rel="apple-touch-icon"
        />
        <link
          href="/dsfr/favicon/favicon.svg"
          rel="icon"
          type="image/svg+xml"
        />
        <link
          href="/dsfr/favicon/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          crossOrigin="use-credentials"
          href="/dsfr/favicon/manifest.webmanifest"
          rel="manifest"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Matomo />
        <Header {...headerData} />
        <main className="flex-1">{children}</main>
        <Footer {...footerData} />
      </body>
    </html>
  );
}
