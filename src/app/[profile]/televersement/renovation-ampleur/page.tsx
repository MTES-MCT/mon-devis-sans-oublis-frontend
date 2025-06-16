"use client";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import UploadQuotes from "@/components/UploadQuotes/UploadQuotes";
import { typeRenovationStorage } from "@/lib/utils/typeRenovationStorage.utils";

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  const params = useParams();
  const router = useRouter();
  const profile = params.profile as string;

  useEffect(() => {
    const savedData = typeRenovationStorage.load();
    setSelectedAides(savedData.aides);
    setSelectedGestes(savedData.gestes);
  }, []);

  const handleNext = async () => {
    if (uploadedFiles.length === 0) return;

    // TODO: Implémenter l'appel API pour multiple files
    // const results = await quoteService.uploadMultipleQuotes(
    //   uploadedFiles,
    //   { aides: selectedAides, gestes: selectedGestes },
    //   profile
    // );
    const resultId = "123";

    router.push(`/${profile}/televersement/renovation-ampleur/${resultId}`);
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
                href: "#",
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
              <UploadQuotes
                maxFileSize={50}
                onFileUpload={(files) => {
                  setUploadedFiles(files);
                }}
                setError={setFileError}
              />
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
