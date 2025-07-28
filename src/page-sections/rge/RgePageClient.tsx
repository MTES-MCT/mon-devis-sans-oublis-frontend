"use client";

import { useEffect, useState, useRef } from "react";
import { DataCheckRgeResult } from "@/types/dataChecks.types";
import RgeForm from "./RgeForm";
import RgeResults from "./RgeResult";
import { CheckRGEGesteTypes } from "@/types";
import { getDataChecksGestesTypes } from "@/actions/dataChecks.actions";

export default function RgePageClient() {
  const [results, setResults] = useState<DataCheckRgeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typeGesteMetadata, setTypeGesteMetadata] =
    useState<CheckRGEGesteTypes>({ options: [] });
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  // Référence pour la zone des résultats
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleResults = (newResults: DataCheckRgeResult, gestes: string[]) => {
    setResults(newResults);
    setSelectedGestes(gestes);

    // Scroll vers les résultats quand ils sont mis à jour
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);

    // Scroll vers les résultats quand le loading commence
    if (loading) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  // Chargement des gestes types au montage du composant
  useEffect(() => {
    const loadGestesTypesMetadata = async () => {
      try {
        const gesteTypesData = await getDataChecksGestesTypes();
        setTypeGesteMetadata(gesteTypesData);
      } catch (error) {
        console.error("Error loading metadata:", error);
      }
    };
    loadGestesTypesMetadata();
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
            typeGesteMetadata={typeGesteMetadata}
            onResults={handleResults}
            onLoading={handleLoading}
          />
        </div>

        {/* Affichage des résultats */}
        {(results !== null || isLoading) && (
          <div className="fr-mt-6w" ref={resultsRef}>
            <h2 className="fr-mb-4w text-[var(--text-title-grey)]">
              Résultats de la vérification
            </h2>
            <RgeResults
              results={results}
              isLoading={isLoading}
              selectedGestes={selectedGestes}
              typeGestesMetadata={typeGesteMetadata}
            />
          </div>
        )}
      </div>
    </section>
  );
}
