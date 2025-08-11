"use client";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { typeRenovationStorage } from "@/lib/utils/typeRenovationStorage.utils";
import UploadMultiple from "@/components/Upload/UploadMultiple";
import { createQuoteCase } from "@/actions/quoteCase.actions";
import { uploadMultipleQuotesCheckToCase } from "@/actions/quoteCheck.actions";
import { Profile } from "@/types";
import { perfLogger } from "@/utils/performanceLogger";

export default function UploadRenovationAmpleurPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const params = useParams();
  const router = useRouter();
  const profile = params.profile as Profile;

  useEffect(() => {
    const savedData = typeRenovationStorage.load();
    setSelectedAides(savedData.aides);
    setSelectedGestes(savedData.gestes);
  }, []);

  const handleNext = async () => {
    if (uploadedFiles.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setFileError(null);

    try {
      // Démarrer le tracking global
      perfLogger.start("process_total");

      console.log("[PROCESS-START] Début du processus complet", {
        filesCount: uploadedFiles.length,
        totalSize: `${(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB`,
        profile,
        aides: selectedAides,
        gestes: selectedGestes,
      });

      // Étape 1: Création du dossier
      perfLogger.start("create_quote_case");
      console.log("[CASE-CREATE-START] Création du dossier");

      const quoteCase = await createQuoteCase(
        { aides: selectedAides, gestes: selectedGestes },
        profile
      );

      const caseTime = perfLogger.end("create_quote_case", {
        caseId: quoteCase.id,
        aidesCount: selectedAides.length,
        gestesCount: selectedGestes.length,
      });

      console.log("[CASE-CREATE-SUCCESS]", {
        caseId: quoteCase.id,
        time: `${caseTime?.toFixed(2)}ms`,
      });

      // Étape 2: Upload des fichiers
      perfLogger.start("upload_all_files");
      console.log("[UPLOAD-START] Début de l'upload des fichiers");

      const results = await uploadMultipleQuotesCheckToCase(
        uploadedFiles,
        quoteCase.id,
        profile
      );

      const uploadTime = perfLogger.end("upload_all_files", {
        successCount: results.successCount,
        failureCount: results.failureCount,
      });

      // Temps total du processus
      const totalTime = perfLogger.end("process_total", {
        caseId: quoteCase.id,
        filesUploaded: results.successCount,
        filesFailed: results.failureCount,
      });

      // Log final structuré
      console.log("[PROCESS-COMPLETE] ✓ Processus terminé", {
        caseId: quoteCase.id,
        résultats: {
          réussis: results.successCount,
          échecs: results.failureCount,
          total: results.totalCount,
        },
        temps: {
          créationDossier: `${caseTime?.toFixed(0)}ms`,
          uploadFichiers: `${uploadTime?.toFixed(0)}ms`,
          total: `${(totalTime ?? 0).toFixed(0)}ms (${((totalTime ?? 0) / 1000).toFixed(1)}s)`,
        },
        vitesseMoyenne: `${((totalTime ?? 0) / uploadedFiles.length).toFixed(0)}ms/fichier`,
      });

      // Afficher le résumé des performances
      if (results.failureCount === 0) {
        console.log("[SUCCESS] Tous les fichiers ont été uploadés avec succès");
      } else {
        console.warn(`[WARNING] ${results.failureCount} fichier(s) ont échoué`);
      }

      perfLogger.printSummary();

      // Redirection vers la page de récapitulatif
      router.push(`/${profile}/dossier/${quoteCase.id}`);
    } catch (error) {
      perfLogger.end("process_total", { error: true });
      perfLogger.end("create_quote_case", { error: true });
      perfLogger.end("upload_all_files", { error: true });

      console.error("[PROCESS-ERROR] Échec du processus:", {
        error: error instanceof Error ? error.message : error,
        étape: isProcessing ? "upload" : "création dossier",
      });

      perfLogger.printSummary();

      setFileError(
        "Une erreur est survenue lors du téléversement. Veuillez réessayer."
      );
      setIsProcessing(false);
    }
  };

  const handlePrevious = () => {
    if (isProcessing) return;
    router.back();
  };

  // Log quand des fichiers sont ajoutés/retirés
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      console.log("[FILES-SELECTED]", {
        count: uploadedFiles.length,
        files: uploadedFiles.map((f) => ({
          name: f.name,
          size: `${(f.size / 1024).toFixed(2)} KB`,
          type: f.type,
        })),
        totalSize: `${(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }, [uploadedFiles]);

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
                  disabled={isProcessing}
                >
                  Précédent
                </button>

                <button
                  className={`fr-btn ${
                    uploadedFiles.length === 0 || isProcessing
                      ? "fr-btn--secondary"
                      : ""
                  }`}
                  disabled={uploadedFiles.length === 0 || isProcessing}
                  onClick={handleNext}
                >
                  {isProcessing
                    ? "Traitement en cours..."
                    : "Vérifiez les devis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
