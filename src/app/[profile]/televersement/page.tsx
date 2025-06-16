"use client";

import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { RenovationType } from "@/types";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import UploadQuotes from "@/components/UploadQuotes/UploadQuotes";
import Link from "next/link";

export default function UploadPage() {
  const [oneDocumentUploaded, setOneDocumentUploaded] =
    useState<boolean>(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const profile = params.profile as string;
  const typeRenovation = searchParams.get("typeRenovation") as RenovationType;

  const multipleDocumentUploadMode = typeRenovation === RenovationType.AMPLEUR;

  const handleNext = () => {
    router.push(`/test`);
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
              <h1>
                {multipleDocumentUploadMode
                  ? "Ajoutez vos devis"
                  : "Ajoutez votre devis"}
              </h1>
              <UploadQuotes
                maxFileSize={50}
                onFileUpload={() => {}}
                setError={() => {}}
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
                    !oneDocumentUploaded ? "fr-btn--secondary" : ""
                  }`}
                  disabled={!oneDocumentUploaded}
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
