"use client";

import Badge, { BadgeSize, BadgeVariant } from "../Badge/Badge";
import QuoteErrorLine from "../QuoteErrorLine/QuoteErrorLine";
import Tooltip from "../Tooltip/Tooltip";
import { Category, ErrorDetails, Gestes } from "@/types";
import wording from "@/wording";

export interface QuoteErrorTablePropsAdmin {
  category: Category.ADMIN;
  deleteErrorReasons?: { id: string; label: string }[];
  errorDetails: ErrorDetails[];
  onAddErrorComment?: (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onDeleteError: (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment?: (quoteCheckId: string, errorDetailsId: string) => void;
  onHelpClick: (comment: string, errorDetailsId: string) => void;
  onUndoDeleteError?: (quoteCheckId: string, errorDetailsId: string) => void;
  quoteCheckId: string;
}

export interface QuoteErrorTablePropsGestes {
  category: Category.GESTES;
  deleteErrorReasons?: { id: string; label: string }[];
  errorDetails: ErrorDetails[];
  gestes: Gestes[];
  onAddErrorComment?: (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onDeleteError: (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment?: (quoteCheckId: string, errorDetailsId: string) => void;
  onHelpClick: (comment: string, errorDetailsId: string) => void;
  onUndoDeleteError?: (quoteCheckId: string, errorDetailsId: string) => void;
  quoteCheckId: string;
}

export interface QuoteErrorTablePropsIncoherence {
  category: Category.INCOHERENCE_DEVIS;
  deleteErrorReasons?: { id: string; label: string }[];
  errorDetails: ErrorDetails[];
  onAddErrorComment?: (
    quoteCaseId: string,
    errorDetailsId: string,
    comment: string
  ) => void;
  onDeleteError: (
    quoteCaseId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  onDeleteErrorComment?: (quoteCaseId: string, errorDetailsId: string) => void;
  onHelpClick: (comment: string, errorDetailsId: string) => void;
  onUndoDeleteError?: (quoteCaseId: string, errorDetailsId: string) => void;
  quoteCaseId: string;
}

export type QuoteErrorTableProps =
  | QuoteErrorTablePropsAdmin
  | QuoteErrorTablePropsGestes
  | QuoteErrorTablePropsIncoherence;

const QuoteErrorTable: React.FC<QuoteErrorTableProps> = (props) => {
  const isCategoryAdmin = props.category === Category.ADMIN;
  const isCategoryGestes = props.category === Category.GESTES;
  const isCategoryIncoherence = props.category === Category.INCOHERENCE_DEVIS;

  const filteredAdminErrors = isCategoryAdmin
    ? props.errorDetails.filter((error) => error.category === Category.ADMIN)
    : [];

  const filteredGestesErrors = isCategoryGestes
    ? props.errorDetails.filter((error) => error.category === Category.GESTES)
    : [];

  const filteredIncoherenceErrors = isCategoryIncoherence
    ? props.errorDetails.filter(
        (error) => error.category === Category.INCOHERENCE_DEVIS
      )
    : [];

  const gestes =
    isCategoryGestes && "gestes" in props ? (props.gestes ?? []) : [];

  // Fonction pour obtenir l'ID approprié selon le type
  const getEntityId = () => {
    if (isCategoryIncoherence && "quoteCaseId" in props) {
      return props.quoteCaseId;
    }
    if ("quoteCheckId" in props) {
      return props.quoteCheckId;
    }
    return "";
  };

  const getErrorBadgeLabel = () => {
    const count = getErrorCount();

    if (count === 0) {
      return "Tout est bon";
    }

    const template =
      count > 1
        ? wording.page_upload_id.badge_correction_plural
        : wording.page_upload_id.badge_correction;

    return template.replace("{number}", count.toString());
  };

  const getErrorCount = () => {
    if (isCategoryGestes) {
      return filteredGestesErrors.filter((error) => !error.deleted).length;
    }
    if (isCategoryAdmin) {
      return filteredAdminErrors.filter((error) => !error.deleted).length;
    }
    if (isCategoryIncoherence) {
      return filteredIncoherenceErrors.filter((error) => !error.deleted).length;
    }
    return 0;
  };

  const getTableTitle = () => {
    if (isCategoryGestes) {
      return wording.components.quote_error_card.title_gestes;
    }
    if (isCategoryAdmin) {
      return wording.components.quote_error_card.title_admin;
    }
    if (isCategoryIncoherence) {
      return "Incohérences entre devis";
    }
    return "";
  };

  const getTooltipText = () => {
    if (isCategoryGestes) {
      return wording.components.quote_error_card.tooltip.gestes;
    }
    if (isCategoryAdmin) {
      return wording.components.quote_error_card.tooltip.admin;
    }
    if (isCategoryIncoherence) {
      return "Ces erreurs concernent des incohérences détectées entre les différents devis du dossier";
    }
    return "";
  };

  return (
    <div className="overflow-hidden rounded-lg border-shadow">
      <table className="w-full">
        {isCategoryGestes || isCategoryAdmin ? (
          <caption className="bg-[var(--background-action-low-blue-france)] font-bold text-left p-4 flex items-center justify-between">
            <span className="flex gap-2 items-center">
              <p className="fr-mb-0 text-[var(--text-default-grey)]!">
                {getTableTitle()}
              </p>
              {isCategoryGestes && gestes.length > 0 && (
                <p className="fr-mb-0 font-normal! text-sm!">
                  {`${(gestes.length > 1
                    ? wording.components.quote_error_card
                        .title_gestes_number_plural
                    : wording.components.quote_error_card.title_gestes_number
                  ).replace("{number}", gestes.length.toString())}`}
                </p>
              )}
              <Tooltip
                icon={wording.components.quote_error_card.tooltip.icon}
                text={getTooltipText()}
              />
            </span>
            <Badge
              className="self-center inline-block"
              icon={getErrorCount() === 0 ? "fr-icon-success-fill" : undefined}
              label={getErrorBadgeLabel()}
              size={BadgeSize.X_SMALL}
              variant={
                getErrorCount() === 0
                  ? BadgeVariant.GREEN_LIGHT
                  : BadgeVariant.GREY
              }
            />
          </caption>
        ) : null}

        {/* Gestion des erreurs GESTES */}
        {isCategoryGestes && gestes.length > 0
          ? gestes.map((geste, gIndex) => {
              const errorsForGeste = filteredGestesErrors.filter(
                (error) => error.geste_id === geste.id
              );
              const isLastGeste = gIndex === gestes.length - 1;

              return (
                <tbody key={`geste-tbody-${geste.id}-${gIndex}`}>
                  <tr
                    className={`bg-[var(--background-default-grey-hover)] ${
                      isLastGeste && errorsForGeste.length === 0
                        ? "border-b-0"
                        : `border-bottom-grey ${
                            gIndex === 0 ? "" : "border-top-grey"
                          }`
                    }`}
                  >
                    <th
                      className="flex gap-4 justify-between items-center p-4 text-[var(--text-action-high-blue-france)] text-left"
                      scope="row"
                      style={{ fontWeight: 500 }}
                    >
                      {geste.intitule}
                      {geste.valid ||
                      errorsForGeste.every((error) => error.deleted) ? (
                        <Badge
                          icon="fr-icon-success-fill"
                          label={"OK"}
                          size={BadgeSize.X_SMALL}
                          variant={BadgeVariant.GREEN}
                        />
                      ) : (
                        <Badge
                          icon="fr-icon-alert-fill"
                          label={`${
                            errorsForGeste.filter((error) => !error.deleted)
                              .length
                          }`}
                          size={BadgeSize.X_SMALL}
                          variant={BadgeVariant.ORANGE_LIGHT}
                        />
                      )}
                    </th>
                  </tr>
                  {errorsForGeste.map((error, errorIndex) => (
                    <QuoteErrorLine
                      deleteErrorReasons={props.deleteErrorReasons}
                      error={error}
                      isLastErrorInTable={
                        isLastGeste && errorIndex === errorsForGeste.length - 1
                      }
                      key={`error-${error.id}-geste-${geste.id}-${errorIndex}`}
                      onAddErrorComment={props.onAddErrorComment}
                      onDeleteError={props.onDeleteError}
                      onDeleteErrorComment={props.onDeleteErrorComment}
                      onUndoDeleteError={props.onUndoDeleteError}
                      quoteCheckId={getEntityId()}
                    />
                  ))}
                </tbody>
              );
            })
          : null}

        {/* Gestion des erreurs ADMIN */}
        {isCategoryAdmin ? (
          <tbody key="admin-tbody">
            {filteredAdminErrors.map((error, index) => (
              <QuoteErrorLine
                deleteErrorReasons={props.deleteErrorReasons}
                error={error}
                key={`admin-error-${error.id}-${index}`}
                onAddErrorComment={props.onAddErrorComment}
                onDeleteError={props.onDeleteError}
                onDeleteErrorComment={props.onDeleteErrorComment}
                onUndoDeleteError={props.onUndoDeleteError}
                quoteCheckId={getEntityId()}
              />
            ))}
          </tbody>
        ) : null}

        {/* Gestion des erreurs INCOHERENCE_DEVIS */}
        {isCategoryIncoherence ? (
          <tbody key="incoherence-tbody">
            {filteredIncoherenceErrors.map((error, index) => (
              <QuoteErrorLine
                deleteErrorReasons={props.deleteErrorReasons}
                error={error}
                key={`incoherence-error-${error.id}-${index}`}
                onAddErrorComment={props.onAddErrorComment}
                onDeleteError={props.onDeleteError}
                onDeleteErrorComment={props.onDeleteErrorComment}
                onUndoDeleteError={props.onUndoDeleteError}
                quoteCheckId={getEntityId()}
              />
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default QuoteErrorTable;
