"use client";

import { Badge, BadgeSize, BadgeVariant, QuoteErrorTable } from "@/components";
import { useIsConseiller } from "@/hooks";
import { Category, ErrorDetails, Gestes, QuoteCase } from "@/types";
import wording from "@/wording";
import QuoteErrorSharingCard from "@/components/QuoteErrorSharingCard/QuoteErrorSharingCard";
import QuoteLaunchAnalysisCard from "@/components/QuoteLaunchAnalysisCard/QuoteLaunchAnalysisCard";
import QuoteConformityCard from "@/components/QuoteConformityCard/QuoteConformityCard";
import GlobalComment from "@/components/GlobalComment/GlobalComment";
import QuoteCaseConsistencyErrorTable from "@/components/QuoteCaseConsistencyError";

interface InvalidQuoteCheckProps {
  analysisDate: string | null;
  comment: string;
  deleteErrorReasons?: { id: string; label: string }[];
  gestes: Gestes[];
  id: string;
  list: ErrorDetails[];
  onAddErrorComment?: (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onAddGlobalComment?: (quoteCheckId: string, comment: string) => void;
  onDeleteError?: (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment?: (quoteCheckId: string, errorDetailsId: string) => void;
  onDeleteGlobalComment?: (quoteCheckId: string) => void;
  onHelpClick: (comment: string, errorDetailsId: string) => void;
  onOpenGlobalCommentModal: () => void;
  onUndoDeleteError?: (quoteCheckId: string, errorDetailsId: string) => void;
  uploadedFileName: string;
  controlsCount?: number;
  dossier?: QuoteCase;
}

export default function InvalidQuoteCheck({
  analysisDate,
  comment,
  deleteErrorReasons,
  gestes,
  id,
  list,
  onAddErrorComment,
  onAddGlobalComment,
  onDeleteError,
  onDeleteErrorComment,
  onDeleteGlobalComment,
  onHelpClick,
  onOpenGlobalCommentModal,
  onUndoDeleteError,
  uploadedFileName,
  controlsCount = 0,
  dossier,
}: InvalidQuoteCheckProps) {
  const isConseillerAndEdit = useIsConseiller();
  const shouldShowConformityCard = () => controlsCount > 0;

  const adminErrors = list.filter((error) => error.category === Category.ADMIN);
  const gestesErrors = list.filter(
    (error) => error.category === Category.GESTES
  );
  const quoteCaseErrors = dossier?.error_details ?? [];

  const devisFromDossierWithErrors = quoteCaseErrors.length > 0 && !!dossier;

  const correctionsCount = devisFromDossierWithErrors
    ? quoteCaseErrors.length + gestesErrors.length + adminErrors.length
    : gestesErrors.length + adminErrors.length;

  return (
    <>
      <section className="fr-container fr-gap-8">
        <h1 className="text-left md:text-left fr-mb-4w">
          {wording.page_upload_id.title}
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

            {uploadedFileName && (
              <Badge
                label={
                  uploadedFileName.length > 40
                    ? `${uploadedFileName.substring(0, 37)}...`
                    : uploadedFileName
                }
                size={BadgeSize.SMALL}
                variant={BadgeVariant.BLUE_DARK}
              />
            )}
          </div>

          {/* Bouton de commentaire global */}
          <div className="flex justify-center md:justify-start">
            <GlobalComment
              comment={comment}
              isEditable={isConseillerAndEdit}
              quoteCheckId={id}
              onAddComment={onAddGlobalComment}
              onDeleteComment={onDeleteGlobalComment}
              onOpenModal={onOpenGlobalCommentModal}
              placement="button"
            />
          </div>
        </div>

        {/* Zone de commentaire */}
        <GlobalComment
          comment={comment}
          isEditable={isConseillerAndEdit}
          quoteCheckId={id}
          onAddComment={onAddGlobalComment}
          onDeleteComment={onDeleteGlobalComment}
          onOpenModal={onOpenGlobalCommentModal}
          placement="zone"
          className="fr-mb-4w"
        />

        {/* Ligne Info & Conformité */}
        <div className="flex flex-col lg:flex-row gap-4 w-full fr-mb-4w lg:items-stretch">
          {/* Zone Info */}
          <div
            className={`fr-alert fr-alert--info !py-4 ${
              shouldShowConformityCard() ? "lg:w-3/5" : "lg:w-full"
            }`}
          >
            <h3 className="fr-alert__title !mb-2">
              {wording.page_upload_id.quotation_alert_ko_title}
            </h3>
            <p className="!mb-0">
              {wording.page_upload_id.quotation_alert_ko_description}
            </p>
          </div>

          {/* Zone Conformité devis */}
          {shouldShowConformityCard() && (
            <QuoteConformityCard
              controlsCount={controlsCount}
              correctionsCount={correctionsCount}
              className="lg:w-2/5"
              mode={dossier ? "compact" : "normal"}
            />
          )}
        </div>
      </section>

      <section className="fr-container">
        <h3 className="fr-mt-5w text-left md:text-left">
          {wording.page_upload_id.subtitle}
        </h3>
        <div className="flex flex-col gap-8">
          {/*  Erreurs de cohérence de dossier si applicable */}
          {devisFromDossierWithErrors && (
            <div className="fr-mb-6w">
              <div className="fr-mt-4v">
                <QuoteCaseConsistencyErrorTable
                  errorDetails={quoteCaseErrors}
                  quoteCaseId={dossier.id}
                />
              </div>
            </div>
          )}

          {/*  Erreurs administratives */}
          <QuoteErrorTable
            category={Category.ADMIN}
            deleteErrorReasons={deleteErrorReasons}
            errorDetails={list}
            onAddErrorComment={(quoteCheckId, errorDetailsId, comment) =>
              onAddErrorComment?.(quoteCheckId, errorDetailsId, comment)
            }
            onDeleteError={(quoteCheckId, errorDetailsId, reason) =>
              onDeleteError?.(quoteCheckId, errorDetailsId, reason)
            }
            onDeleteErrorComment={(quoteCheckId, errorDetailsId) =>
              onDeleteErrorComment?.(quoteCheckId, errorDetailsId)
            }
            onHelpClick={onHelpClick}
            onUndoDeleteError={onUndoDeleteError}
            quoteCheckId={id}
          />

          {/*  Erreurs des gestes */}
          <QuoteErrorTable
            category={Category.GESTES}
            deleteErrorReasons={deleteErrorReasons}
            errorDetails={list}
            gestes={gestes}
            onAddErrorComment={(quoteCheckId, errorDetailsId, comment) =>
              onAddErrorComment?.(quoteCheckId, errorDetailsId, comment)
            }
            onDeleteError={(quoteCheckId, errorDetailsId, reason) =>
              onDeleteError?.(quoteCheckId, errorDetailsId, reason)
            }
            onDeleteErrorComment={(quoteCheckId, errorDetailsId) =>
              onDeleteErrorComment?.(quoteCheckId, errorDetailsId)
            }
            onHelpClick={onHelpClick}
            onUndoDeleteError={onUndoDeleteError}
            quoteCheckId={id}
          />
        </div>
      </section>

      <section className="fr-container fr-my-6w">
        <h3>Et après ?</h3>
        <div className="flex md:flex-row flex-col gap-6">
          <QuoteErrorSharingCard
            className="md:flex-1"
            fileName={uploadedFileName}
            adminErrorList={adminErrors}
            gestesErrorList={gestesErrors}
            gestes={gestes}
          />
          <QuoteLaunchAnalysisCard className="md:flex-1" />
        </div>
      </section>
    </>
  );
}
