"use client";

import { useEffect, useState } from "react";
import { DataCheckRgeResult } from "@/types/dataChecks.types";
import RgeForm from "./RgeForm";
import RgeResults from "./RgeResult";
import { quoteService } from "@/lib/client/apiWrapper";
import { Metadata } from "@/types";

export default function RgePageClient() {
  const [results, setResults] = useState<DataCheckRgeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<Metadata>({ aides: [], gestes: [] });
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  const handleResults = (newResults: DataCheckRgeResult, gestes: string[]) => {
    setResults(newResults);
    setSelectedGestes(gestes);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Chargement des métadonnées au montage du composant
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await quoteService.getQuoteCheckMetadata();
        setMetadata(data);
      } catch (error) {
        console.error("Error loading metadata:", error);
      }
    };
    loadMetadata();
  }, []);

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
            Renseignez le SIRET de l'entreprise ainsi qu'un ou plusieurs gestes
            de travaux pour obtenir ses qualifications RGE en cours de validité.
          </p>
          <p className="fr-callout__text">
            Vous pouvez également préciser un numéro RGE spécifique à valider et
            une date de vérification.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="fr-mb-6w">
          <RgeForm
            metadata={metadata}
            onResults={handleResults}
            onLoading={handleLoading}
          />
        </div>

        {/* Affichage des résultats */}
        {(results !== null || isLoading) && (
          <div className="fr-mt-6w">
            <h2 className="fr-mb-4w text-[var(--text-title-grey)]">
              Résultats de la vérification
            </h2>
            <RgeResults
              results={results}
              isLoading={isLoading}
              selectedGestes={selectedGestes}
              metadata={metadata}
            />
          </div>
        )}
      </div>
    </section>
  );
}
