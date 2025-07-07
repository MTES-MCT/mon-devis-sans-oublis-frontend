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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const router = useRouter();
  const profile = params.profile as Profile;

  useEffect(() => {
    const savedData = typeRenovationStorage.load();
    setSelectedAides(savedData.aides);
    setSelectedGestes(savedData.gestes);
  }, []);

  const handleNext = async () => {
    if (uploadedFiles.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setFileError(null);

    try {
      // Création du dossier
      const quoteCase = await createQuoteCase(
        { aides: selectedAides, gestes: selectedGestes },
        profile
      );

      // Sauvegarder le nombre de fichiers en localStorage
      localStorage.setItem(
        `upload_files_count_${quoteCase.id}`,
        uploadedFiles.length.toString()
      );

      // Navigation immédiate vers la page d'analyse
      router.push(`/${profile}/dossier/${quoteCase.id}`);

      // Upload en arrière-plan (non bloquant)
      uploadMultipleQuotesCheckToCase(
        uploadedFiles,
        quoteCase.id,
        profile
      ).catch((error) => {
        console.error("Erreur lors de l'upload en arrière-plan:", error);
      });
    } catch (error) {
      console.error("Erreur lors de la création du dossier:", error);
      setFileError(
        "Une erreur est survenue lors de la création du dossier. Veuillez réessayer."
      );
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (isSubmitting) return;
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
        </div>
      </section>

      {/* Zone de navigation - sticky */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-12 z-10">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-lg-8">
              <div className="flex justify-center items-center gap-4">
                <button
                  className="fr-btn fr-btn--secondary"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  Précédent
                </button>

                <button
                  className={`fr-btn ${
                    uploadedFiles.length === 0 || isSubmitting
                      ? "fr-btn--secondary"
                      : ""
                  }`}
                  disabled={uploadedFiles.length === 0 || isSubmitting}
                  onClick={handleNext}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="fr-icon-refresh-line fr-icon--sm mr-2 animate-spin"
                        aria-hidden="true"
                      ></span>
                      Envoi des devis...
                    </>
                  ) : (
                    "Vérifiez les devis"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
