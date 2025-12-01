"use client";

import { QuoteCheck, getFileErrors } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface QuoteSidemenuProps {
  quoteChecks: QuoteCheck[];
  currentQuoteCheckId: string;
  profile: string;
  quoteCaseId: string;
}

const getQuoteFilename = (quote?: QuoteCheck): string =>
  quote
    ? quote.filename.length > 27
      ? `${quote.filename.substring(0, 26)}...`
      : quote.filename || `Devis ${quote.id}`
    : "Devis inconnu";

// Helper pour trier les devis selon le même ordre que dans InvalidQuoteCase
const sortQuoteChecks = (quoteChecks: QuoteCheck[]): QuoteCheck[] => {
  return [
    ...quoteChecks.filter(
      (q) => q.status !== "valid" && getFileErrors(q).length === 0
    ), // Devis invalides sans erreur de fichier
    ...quoteChecks.filter((q) => q.status === "valid"), // Devis valides
    ...quoteChecks.filter((q) => getFileErrors(q).length > 0), // Devis avec erreur de fichier (en dernier)
  ];
};

export function QuoteSidemenuDesktop({
  quoteChecks,
  currentQuoteCheckId,
  profile,
  quoteCaseId,
}: QuoteSidemenuProps) {
  const sortedQuoteChecks = sortQuoteChecks(quoteChecks);

  const handleQuoteClick = (quoteId: string) => {
    window.location.href = `/${profile}/dossier/${quoteCaseId}/devis/${quoteId}`;
  };

  return (
    <nav className="fr-sidemenu fr-sidemenu--sticky-full-height">
      <div className="fr-sidemenu__inner">
        <div className="fr-sidemenu__list">
          <Link
            className="text-[14px] text-center fr-text-action-high--blue-france"
            style={{ fontWeight: 400 }}
            href={`/${profile}/dossier/${quoteCaseId}/`}
          >
            <span
              className="fr-icon--sm fr-icon-arrow-left-line fr-mr-2v"
              aria-hidden="true"
            ></span>
            Résultat de l'analyse
          </Link>
          {sortedQuoteChecks.map((quote) => {
            const isFileError = getFileErrors(quote).length > 0;
            const isCurrentQuote = quote.id === currentQuoteCheckId;

            return (
              <div
                key={quote.id}
                className={`fr-tag fr-tag--dismiss fr-mt-6v ${
                  isFileError
                    ? isCurrentQuote
                      ? "fr-background-contrast--grey--active"
                      : "fr-background-contrast--grey fr-text-mention--grey"
                    : isCurrentQuote
                      ? "fr-background-contrast--blue-france--active"
                      : "fr-text-action-high--blue-france fr-background-contrast--blue-france"
                }`}
                onClick={
                  isFileError ? undefined : () => handleQuoteClick(quote.id)
                }
                style={{
                  cursor: isFileError ? "default" : "pointer",
                  display: "block",
                  fontWeight: 400,
                }}
              >
                <span
                  className="fr-icon-file-text-fill fr-icon--sm mr-2"
                  aria-hidden="true"
                ></span>
                <span
                  className={`fr-tag__label ${
                    isCurrentQuote ? "fr-text--white" : ""
                  }`}
                >
                  {getQuoteFilename(quote)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function QuoteSidemenuMobile({
  quoteChecks,
  currentQuoteCheckId,
  profile,
  quoteCaseId,
}: QuoteSidemenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedQuoteChecks = sortQuoteChecks(quoteChecks);

  const handleQuoteClick = (quoteId: string) => {
    window.location.href = `/${profile}/dossier/${quoteCaseId}/devis/${quoteId}`;
    setIsExpanded(false);
  };

  const handleReturnClick = () => {
    window.location.href = `/${profile}/dossier/${quoteCaseId}`;
  };

  const currentQuote = quoteChecks.find((q) => q.id === currentQuoteCheckId);
  const isCurrentQuoteFileError = currentQuote
    ? getFileErrors(currentQuote).length > 0
    : false;

  return (
    <nav className="fr-sidemenu">
      <div className="fr-sidemenu__inner">
        {/* Bouton principal du sidemenu mobile */}
        <button
          className={`fr-sidemenu__btn ${
            isCurrentQuoteFileError ? "fr-text-mention--grey" : ""
          }`}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span
            className="fr-icon-file-text-fill fr-icon--sm"
            aria-hidden="true"
          ></span>
          {getQuoteFilename(currentQuote)}
        </button>

        {/* Contenu dépliable */}
        <div
          className={`fr-collapse ${isExpanded ? "fr-collapse--expanded" : ""}`}
        >
          <div className="fr-sidemenu__list">
            {/* Bouton retour */}
            <button className="fr-sidemenu__link" onClick={handleReturnClick}>
              <span
                className="fr-icon--sm fr-icon-arrow-left-line fr-mr-2v"
                aria-hidden="true"
              ></span>
              Résultats de l'analyse
            </button>

            {/* Titre de section */}
            <div className="fr-sidemenu__title">Devis du dossier</div>

            {/* Liste des devis */}
            {sortedQuoteChecks.map((quote) => {
              const isFileError = getFileErrors(quote).length > 0;
              const isCurrentQuote = quote.id === currentQuoteCheckId;

              return (
                <div key={quote.id} className="fr-sidemenu__item">
                  <button
                    className={`fr-sidemenu__link ${
                      isFileError ? "fr-text-mention--grey" : ""
                    }`}
                    aria-current={isCurrentQuote ? "page" : false}
                    onClick={
                      isFileError ? undefined : () => handleQuoteClick(quote.id)
                    }
                    disabled={isFileError}
                    style={isFileError ? { cursor: "default" } : undefined}
                  >
                    <span
                      className="fr-icon-file-text-fill fr-icon--sm fr-mr-2v"
                      aria-hidden="true"
                    ></span>
                    {getQuoteFilename(quote)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
