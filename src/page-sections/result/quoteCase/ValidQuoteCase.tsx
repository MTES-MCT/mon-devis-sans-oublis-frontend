import { Badge, BadgeSize, BadgeVariant } from "@/components";
import { Breadcrumb } from "@/components";

import QuoteConformityCard from "@/components/QuoteConformityCard/QuoteConformityCard";
import QuoteLaunchAnalysisCard from "@/components/QuoteLaunchAnalysisCard/QuoteLaunchAnalysisCard";
import { QuoteCase, Status } from "@/types";
import { removeFileExtension } from "@/utils/fileUtils";
import wording from "@/wording";

interface ValidQuoteCaseProps {
  analysisDate: string;
  dossier: QuoteCase;
}

export default function ValidQuoteCase({
  analysisDate,
  dossier,
}: ValidQuoteCaseProps) {
  const quoteChecks = dossier.quote_checks ?? [];

  const invalidQuotes = quoteChecks.filter((q) => q.status === Status.INVALID);

  const totalErrors = invalidQuotes.reduce(
    (total, quote) => total + (quote.error_details?.length ?? 0),
    0
  );

  const totalControls = quoteChecks.reduce(
    (sum, qc) => sum + (qc.controls_count ?? 0),
    0
  );

  return (
    <>
      <div className="fr-container">
        <Breadcrumb
          items={[
            {
              label: "Accueil",
              href: "/",
            },
            {
              label: `Résultats de l'analyse - dossier ${dossier.id}`,
            },
          ]}
        />
      </div>
      <section className="fr-container fr-gap-8">
        <h1 className="text-left md:text-left fr-mb-4w">
          Résultat de l'analyse
        </h1>

        {/* Zone des badges */}
        <div className="fr-mb-4w">
          <div className="flex flex-wrap gap-2 justify-left md:justify-start fr-mb-3w">
            {analysisDate && (
              <Badge
                label={wording.page_upload_id.analysis_date.replace(
                  "{date}",
                  analysisDate
                )}
                size={BadgeSize.SMALL}
                variant={BadgeVariant.GREY}
              />
            )}

            <Badge
              label={`Dossier ${dossier.id}`}
              size={BadgeSize.SMALL}
              variant={BadgeVariant.BLUE_DARK}
            />
          </div>
        </div>

        {/* Ligne  Conformité */}
        <div className="flex flex-col lg:flex-row gap-4 w-full fr-mb-4w lg:items-start">
          <div className="lg:w-2/5">
            <QuoteConformityCard
              title="Conformité globale"
              controlsCount={totalControls}
              correctionsCount={totalErrors}
            />
          </div>
        </div>

        {/* Tableau des devis conformes */}
        <div className="fr-mb-6w">
          <h3>Devis analysés ⬇️</h3>
          <div className="fr-mt-4v">
            <div className="overflow-hidden rounded-lg border-shadow">
              <table className="w-full">
                <tbody>
                  {quoteChecks.map((devis, index) => (
                    <tr
                      key={devis.id}
                      className={
                        index !== quoteChecks.length - 1
                          ? "border-bottom-grey"
                          : ""
                      }
                    >
                      <td className="flex items-center justify-between p-4">
                        {/* Tag fichier */}
                        <div className="fr-tag fr-tag--dismiss fr-background-contrast--blue-france fr-text-action-high--blue-france">
                          <span
                            className="fr-icon-file-text-fill fr-icon--sm mr-2"
                            aria-hidden="true"
                          />
                          <span className="fr-tag__label">
                            {removeFileExtension(devis.filename)}
                          </span>
                        </div>

                        {/* Badge succès */}
                        <p className="fr-badge fr-badge--success mb-0">
                          Devis conforme
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section partage & nouvelle analyse avec espace réservé */}
        <section className="fr-container fr-my-6w">
          <h3>Et après ?</h3>
          <div className="flex md:flex-row flex-col gap-6">
            <QuoteLaunchAnalysisCard className="md:flex-1" />
          </div>
        </section>
      </section>
    </>
  );
}
