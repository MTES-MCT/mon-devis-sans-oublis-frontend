"use client";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { typeRenovationStorage } from "@/lib/utils/typeRenovationStorage.utils";
import UploadMultiple from "@/components/Upload/UploadMultiple";
import { createQuoteCase } from "@/actions/quoteCase.actions";
import { uploadMultipleQuotesCheckToCase } from "@/actions/quoteCheck.actions";
import { Profile } from "@/types";

export default function UploadRenovationAmpleurPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  const params = useParams();
  const router = useRouter();
  const profile = params.profile as Profile;

  useEffect(() => {
    const savedData = typeRenovationStorage.load();
    setSelectedAides(savedData.aides);
    setSelectedGestes(savedData.gestes);
  }, []);

  const handleNext = async () => {
    if (uploadedFiles.length === 0) return;

    try {
      // Création du dossier
      const quoteCase = await createQuoteCase(
        { aides: selectedAides, gestes: selectedGestes },
        profile
      );

      // Upload de tous les fichiers
      await uploadMultipleQuotesCheckToCase(
        uploadedFiles,
        quoteCase.id,
        profile
      );

      // Redirection vers page résultat
      router.push(`/${profile}/dossier/${quoteCase.id}`);
    } catch (error) {
      console.error("Erreur lors du processus d'upload:", error);
      setFileError(
        "Une erreur est survenue lors du téléversement. Veuillez réessayer."
      );
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
                label: `Etape 3/4`,
              },
            ]}
          />
        </div>
      </div>

      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
              <h1>Ajoutez vos devis</h1>
              <UploadMultiple
                maxFileSize={50}
                onFileUpload={(files) => {
                  setUploadedFiles(files);
                  setFileError(null);
                }}
                setError={setFileError}
              />

              {/* Affichage des erreurs d'upload */}
              {fileError && (
                <div className="fr-alert fr-alert--error fr-mt-4v">
                  <p>{fileError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Zone de navigation */}
          <div className="fr-grid-row fr-grid-row--center fr-mt-16v">
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
                    uploadedFiles.length === 0 ? "fr-btn--secondary" : ""
                  }`}
                  disabled={uploadedFiles.length === 0}
                  onClick={handleNext}
                >
                  Vérifiez les devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
