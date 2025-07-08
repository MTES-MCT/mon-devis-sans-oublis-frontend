"use client";

import { useState } from "react";
import { DataCheckRgeResult } from "@/types/dataChecks.types";
import RgeForm from "./RgeForm";
import RgeResults from "./RgeResult";

export default function RgePageClient() {
  const [results, setResults] = useState<DataCheckRgeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (newResults: DataCheckRgeResult) => {
    setResults(newResults);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h1 className="fr-mb-6w text-[var(--text-title-grey)]">
          Vérification du statut RGE
        </h1>

        {/* Texte informatif */}
        <div className="fr-callout fr-mb-6w">
          <h2 className="fr-callout__title">À propos de cette page</h2>
          <p className="fr-callout__text">
            Cette page vous permet de consulter le statut RGE (Reconnu Garant de
            l'Environnement) d'une entreprise.
          </p>
          <p className="fr-callout__text">
            Renseignez le SIRET de l'entreprise pour obtenir ses qualifications
            RGE en cours de validité.
          </p>
          <p className="fr-callout__text">
            Vous pouvez également préciser un numéro RGE spécifique à valider et
            une date de vérification.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="fr-mb-6w">
          <RgeForm onResults={handleResults} onLoading={handleLoading} />
        </div>

        {/* Affichage des résultats */}
        {(results !== null || isLoading) && (
          <div className="fr-mt-6w">
            <h2 className="fr-mb-4w text-[var(--text-title-grey)]">
              Résultats de la vérification
            </h2>
            <RgeResults results={results} isLoading={isLoading} />
          </div>
        )}
      </div>
    </section>
  );
}
