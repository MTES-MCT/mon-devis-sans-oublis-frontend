import { Badge, BadgeSize, BadgeVariant } from "@/components";
import QuoteCaseConsistencyErrorTable from "@/components/QuoteCaseConsistencyError/QuoteCaseConsistencyErrorTable";
import QuoteConformityCard from "@/components/QuoteConformityCard/QuoteConformityCard";
import QuoteErrorSharingCard from "@/components/QuoteErrorSharingCard/QuoteErrorSharingCard";
import QuoteLaunchAnalysisCard from "@/components/QuoteLaunchAnalysisCard/QuoteLaunchAnalysisCard";
import { useUserProfile } from "@/hooks";
import { QuoteCase, Status } from "@/types";
import { removeFileExtension } from "@/utils/fileUtils";
import wording from "@/wording";
import Link from "next/link";

interface QuoteStats {
  total: number;
  processed: number;
  valid: number;
  invalid: number;
  pending: number;
}

interface InvalidQuoteCaseProps {
  analysisDate: string;
  dossier: QuoteCase;
  stats: QuoteStats;
  profile: string;
  quoteCaseId: string;
  onNavigateToQuote: (quoteId: string) => void;
}

export default function InvalidQuoteCase({
  analysisDate,
  dossier,
  quoteCaseId,
}: InvalidQuoteCaseProps) {
  const quoteChecks = dossier.quote_checks ?? [];
  const quoteCaseErrors = dossier.error_details ?? [];

  const invalidQuotes = quoteChecks.filter((q) => q.status === Status.INVALID);
  const validQuotes = quoteChecks.filter((q) => q.status === Status.VALID);

  const totalErrors = invalidQuotes.reduce(
    (total, quote) => total + (quote.error_details?.length ?? 0),
    0
  );

  const totalControls = quoteChecks.reduce(
    (sum, qc) => sum + (qc.controls_count ?? 0),
    0
  );

  const profile = useUserProfile();

  const shouldShowConformityCard = () => totalControls > 0;

  return (
    <section className="fr-container fr-gap-8">
      <h1 className="text-left md:text-left fr-mb-4w">Résultat de l'analyse</h1>

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

      {/* Ligne Info & Conformité */}
      <div className="flex flex-col lg:flex-row gap-4 w-full fr-mb-4w lg:items-start">
        <div
          className={`fr-alert fr-alert--info !py-4 ${
            shouldShowConformityCard() ? "lg:w-3/5" : "lg:w-full"
          }`}
        >
          <h3 className="fr-alert__title !mb-2">
            {wording.page_upload_id.quoteCheck_alert_ko_title}
          </h3>
          <p className="!mb-0">
            {wording.page_upload_id.quotation_alert_ko_description}
          </p>
        </div>

        {shouldShowConformityCard() && (
          <div className="lg:w-2/5">
            <QuoteConformityCard
              title="Conformité globale"
              controlsCount={totalControls}
              correctionsCount={totalErrors}
            />
          </div>
        )}
      </div>

      {/* Tableau des incohérences entre devis */}
      {quoteCaseErrors.length > 0 && (
        <div className="fr-mb-6w">
          <h3>Incohérence entre les devis ⬇️</h3>
          <div className="fr-mt-4v">
            <QuoteCaseConsistencyErrorTable
              errorDetails={quoteCaseErrors}
              quoteCaseId={quoteCaseId}
            />
          </div>
        </div>
      )}

      {/* Tableau des corrections devis */}
      {(invalidQuotes.length > 0 || validQuotes.length > 0) && (
        <div className="fr-mb-6w">
          <h3>Corrections par devis ⬇️</h3>
          <div className="fr-mt-4v">
            <div className="overflow-hidden rounded-lg border-shadow">
              <table className="w-full">
                <tbody>
                  {[...invalidQuotes, ...validQuotes].map(
                    (devis, index, allQuotes) => {
                      const errorCount =
                        devis.error_details?.filter((error) => !error.deleted)
                          .length || 0;
                      const isValid = devis.status === "valid";
                      const isLastItem = index === allQuotes.length - 1;

                      return (
                        <tr
                          key={devis.id}
                          className={`${!isLastItem ? "border-bottom-grey" : ""}`}
                        >
                          <td className="flex items-center justify-between p-4">
                            {/* Zone gauche - Tag fichier */}
                            <div
                              className={`fr-tag fr-tag--dismiss fr-background-contrast--blue-france fr-text-action-high--blue-france`}
                            >
                              <span
                                className={`fr-icon-file-text-fill fr-icon--sm mr-2`}
                                aria-hidden="true"
                              ></span>
                              <span className="fr-tag__label">
                                {removeFileExtension(devis.filename)}
                              </span>
                            </div>

                            {/* Zone droite - Badge + Bouton */}
                            <div className="flex items-center gap-3">
                              {/* Badge statut */}
                              {isValid ? (
                                <p className="fr-badge fr-badge--success mb-0">
                                  Devis conforme
                                </p>
                              ) : (
                                <p className="fr-badge fr-badge--warning mb-0">
                                  {errorCount} correction
                                  {errorCount > 1 ? "s" : ""}
                                </p>
                              )}

                              {/* Bouton action ou espace réservé */}
                              {!isValid ? (
                                <Link
                                  className="fr-btn fr-btn--tertiary fr-btn--sm shrink-0"
                                  href={`/${profile}/dossier/${dossier.id}/devis/${devis.id}`}
                                >
                                  Voir les corrections
                                </Link>
                              ) : (
                                <div className="w-[140px]"></div> // Espace réservé invisible avec la même largeur approximative qu'un bouton
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section partage & nouvelle analyse */}
      <section className="fr-container fr-my-6w">
        <h3>Et aprés ?</h3>
        <div className="flex md:flex-row flex-col gap-6">
          <QuoteErrorSharingCard className="md:flex-1" quoteCase={dossier} />
          <QuoteLaunchAnalysisCard className="md:flex-1" />
        </div>
      </section>
    </section>
  );
}
