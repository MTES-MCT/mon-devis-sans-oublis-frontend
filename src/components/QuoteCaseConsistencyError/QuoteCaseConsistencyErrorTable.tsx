"use client";

import Badge, { BadgeSize, BadgeVariant } from "../Badge/Badge";
import QuoteCaseConsistencyErrorRow from "./QuoteCaseConsistencyErrorRow";
import { useDeleteErrorReasons } from "@/hooks/useDeleteErrorReasons";
import {
  deleteErrorDetail,
  updateErrorDetail,
  undoDeleteErrorDetail,
} from "@/actions/quoteCase.errorDetails.actions";
import { ErrorDetails, Category } from "@/types";
import wording from "@/wording";

interface QuoteCaseConsistencyErrorTableProps {
  errorDetails: ErrorDetails[];
  quoteCaseId: string;
  showHeader?: boolean;
}

const QuoteCaseConsistencyErrorTable: React.FC<
  QuoteCaseConsistencyErrorTableProps
> = ({ errorDetails, quoteCaseId, showHeader = true }) => {
  const { reasons: deleteErrorReasons } = useDeleteErrorReasons("quotes_cases");

  // Filter uniquement les erreurs de cohérence entre devis
  const consistencyErrors = errorDetails.filter(
    (error) => error.category === Category.INCOHERENCE_DEVIS
  );

  const activeErrorsCount = consistencyErrors.filter(
    (error) => !error.deleted
  ).length;

  const getBadgeLabel = () => {
    if (activeErrorsCount === 0) {
      return "Tout est bon";
    }
    const template =
      activeErrorsCount > 1
        ? wording.page_upload_id.badge_correction_plural
        : wording.page_upload_id.badge_correction;
    return template.replace("{number}", activeErrorsCount.toString());
  };

  // Handlers pour les actions
  const handleAddErrorComment = async (
    quoteCaseId: string,
    errorDetailsId: string,
    comment: string
  ) => {
    try {
      await updateErrorDetail(quoteCaseId, errorDetailsId, comment);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  const handleDeleteError = async (
    quoteCaseId: string,
    errorDetailsId: string,
    reason: string
  ) => {
    try {
      await deleteErrorDetail(quoteCaseId, errorDetailsId, reason);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleDeleteErrorComment = async (
    quoteCaseId: string,
    errorDetailsId: string
  ) => {
    try {
      await updateErrorDetail(quoteCaseId, errorDetailsId, null);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  };

  const handleUndoDeleteError = async (
    quoteCaseId: string,
    errorDetailsId: string
  ) => {
    try {
      await undoDeleteErrorDetail(quoteCaseId, errorDetailsId);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border-shadow">
      <table className="w-full">
        {showHeader && (
          <caption className="bg-[var(--background-action-low-blue-france)] font-bold text-left p-4 flex items-center justify-between">
            <span className="flex gap-2 items-center">
              <p className="fr-mb-0 text-[var(--text-default-grey)]">
                Erreurs de cohérence entre devis
              </p>
            </span>
            <Badge
              className="self-center inline-block"
              icon={
                activeErrorsCount === 0 ? "fr-icon-success-fill" : undefined
              }
              label={getBadgeLabel()}
              size={BadgeSize.X_SMALL}
              variant={
                activeErrorsCount === 0
                  ? BadgeVariant.GREEN_LIGHT
                  : BadgeVariant.GREY
              }
            />
          </caption>
        )}
        <tbody>
          {consistencyErrors.map((error, index) => (
            <QuoteCaseConsistencyErrorRow
              key={error.id}
              error={error}
              quoteCaseId={quoteCaseId}
              isLastError={index === consistencyErrors.length - 1}
              deleteErrorReasons={deleteErrorReasons}
              onAddErrorComment={handleAddErrorComment}
              onDeleteError={handleDeleteError}
              onDeleteErrorComment={handleDeleteErrorComment}
              onUndoDeleteError={handleUndoDeleteError}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteCaseConsistencyErrorTable;
