"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { UploadClient } from "@/page-sections";
import { Link, LinkVariant } from "@/components";
import wording from "@/wording";

interface PageProps {
  params: Promise<{ profile: string }>;
}

export default function UploadRenovationParGestesPage({
  params: initialParams,
}: PageProps) {
  const [profile, setProfile] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initialParams.then((p) => setProfile(p.profile));
  }, [initialParams]);

  const handleStateChange = (canSubmitValue: boolean, submitting: boolean) => {
    setCanSubmit(canSubmitValue);
    setIsSubmitting(submitting);
  };

  const handleSubmit = () => {
    if (window.uploadClientSubmit) {
      window.uploadClientSubmit();
    }
  };

  if (!profile) return null;

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
              <h1>{wording.upload.title}</h1>
              <UploadClient
                profile={profile}
                onStateChange={handleStateChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Zone sticky full width  */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 py-12 z-10">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-lg-8">
              <div className="flex justify-center">
                <ul className="fr-btns-group fr-btns-group--inline-sm">
                  <li>
                    <Link
                      href={`/${profile}/type-renovation`}
                      label={wording.upload.link_back.label}
                      variant={LinkVariant.SECONDARY}
                    />
                  </li>
                  <li>
                    <button
                      className="fr-btn fr-text--lg"
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                    >
                      {isSubmitting
                        ? wording.upload.button_send_quote
                        : wording.upload.button_check_quote}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
