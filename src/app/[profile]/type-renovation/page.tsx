"use client";

import { useState, useEffect } from "react";
import { Tile } from "@/components";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { quoteService } from "@/lib/client/apiWrapper";
import RenovationTypeSelection from "@/page-sections/upload/RenovationTypeSelection";
import { Metadata } from "@/types";
import { useRouter } from "next/navigation";

export default function TypeRenovation({}: {
  params: Promise<{ profile: string }>;
}) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [metadata, setMetadata] = useState<Metadata>({ aides: [], gestes: [] });

  const router = useRouter();

  // Charger les métadonnées au montage du composant
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await quoteService.getQuoteMetadata();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    loadMetadata();
  }, []);

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      router.push(`/envoi-devis?type=${selectedType}`);
    }
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
                href: "#",
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
                    title="Rénovation par gestes"
                    horizontal={true}
                    isCheckbox={true}
                    isChecked={selectedType === "gestes"}
                    onCheck={() => handleTypeSelection("gestes")}
                    value="gestes"
                  />
                </div>
                <div className="fr-col-12 fr-col-md-6 flex">
                  <Tile
                    description="Plusieurs postes de travaux."
                    image="/images/who_are_you/card_individual.webp"
                    title="Rénovation d'ampleur"
                    horizontal={true}
                    isCheckbox={true}
                    isChecked={selectedType === "ampleur"}
                    onCheck={() => handleTypeSelection("ampleur")}
                    value="ampleur"
                  />
                </div>
              </div>

              {/* Zone de choix de précisions */}
              <div className="fr-mb-8v">
                <RenovationTypeSelection metadata={metadata} />
              </div>

              {/* Zone de navigation */}
              <div className="fr-grid-row fr-grid-row--center fr-mt-16v">
                <div className="fr-col-12 fr-col-lg-8">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      className="fr-btn fr-btn--secondary"
                      onClick={() => {
                        router.back();
                      }}
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
        </div>
      </section>
    </>
  );
}
