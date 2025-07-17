"use client";

import { useState, useEffect } from "react";
import { Tile } from "@/components";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { quoteService } from "@/lib/client/apiWrapper";
import { Metadata, RenovationTypes } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { typeRenovationStorage } from "@/lib/utils/typeRenovationStorage.utils";
import { RenovationTypeSelection } from "@/page-sections";

export default function TypeRenovation() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [metadata, setMetadata] = useState<Metadata>({ aides: [], gestes: [] });
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  const router = useRouter();
  const params = useParams();

  const userProfile = params.profile as string;

  // Chargement des métadonnées au montage du composant
  useEffect(() => {
    // Remise à zéro des données sauvegardées quand on arrive sur cette page
    typeRenovationStorage.clear();

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

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
  };

  const handleSelectionChange = (aides: string[], gestes: string[]) => {
    setSelectedAides(aides);
    setSelectedGestes(gestes);
  };

  const handleNext = () => {
    if (selectedType && userProfile) {
      // Sauvegarde en sessionStorage du type de reno & des metadata
      typeRenovationStorage.save({
        aides: selectedAides,
        gestes: selectedGestes,
        type: selectedType,
      });

      const routePath =
        selectedType === RenovationTypes.GESTES
          ? "renovation-par-gestes"
          : "renovation-ampleur";

      router.push(`/${userProfile}/televersement/${routePath}`);
    }
  };

  const handlePrevious = () => {
    router.back();
  };

  return (
    <>
      <div className="fr-container-fluid">
        <div className="fr-container">
          <Breadcrumb
            items={[
              {
                label: "Accueil",
                href: "/",
              },
              {
                label: "Analyse des devis",
                href: undefined,
              },
              {
                label: `Etape 2/4`,
              },
            ]}
          />
        </div>
      </div>

      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-lg-10">
              {/* Zone de choix de type de rénovation */}
              <h1 className="fr-h2 fr-mb-6v text-left">
                Quel est le type de rénovation ?
              </h1>
              <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center items-stretch fr-mb-8v">
                <div className="fr-col-12 fr-col-md-6 flex">
                  <Tile
                    description="1 seul poste de travaux."
                    image="/images/who_are_you/card_artisan.webp"
                    title="Rénovation par geste"
                    horizontal={true}
                    isCheckbox={true}
                    isChecked={selectedType === RenovationTypes.GESTES}
                    onCheck={() => handleTypeSelection(RenovationTypes.GESTES)}
                    value={RenovationTypes.GESTES}
                  />
                </div>
                <div className="fr-col-12 fr-col-md-6 flex">
                  <Tile
                    description="Plusieurs postes de travaux."
                    image="/images/who_are_you/card_individual.webp"
                    title="Rénovation d'ampleur"
                    horizontal={true}
                    isCheckbox={true}
                    isChecked={selectedType === RenovationTypes.AMPLEUR}
                    onCheck={() => handleTypeSelection(RenovationTypes.AMPLEUR)}
                    value={RenovationTypes.AMPLEUR}
                  />
                </div>
              </div>

              {/* Zone de choix de précisions */}
              <div className="fr-mb-8v">
                <RenovationTypeSelection
                  metadata={metadata}
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zone de navigation - sticky - sortie de la section */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-12 z-10">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-lg-8">
              <div className="flex justify-center items-center gap-4">
                <button
                  className="fr-btn fr-btn--secondary"
                  onClick={handlePrevious}
                >
                  Précédent
                </button>

                <button
                  className={`fr-btn ${
                    !selectedType ? "fr-btn--secondary" : ""
                  }`}
                  disabled={!selectedType}
                  onClick={handleNext}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
