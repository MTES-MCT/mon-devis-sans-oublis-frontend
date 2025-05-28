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

export type QuoteErrorTableProps =
  | QuoteErrorTablePropsAdmin
  | QuoteErrorTablePropsGestes;

const QuoteErrorTable: React.FC<QuoteErrorTableProps> = (props) => {
  const isCategoryAdmin = props.category === Category.ADMIN;
  const isCategoryGestes = props.category === Category.GESTES;

  const filteredAdminErrors = isCategoryAdmin
    ? props.errorDetails.filter((error) => error.category === Category.ADMIN)
    : [];

  const filteredGestesErrors = isCategoryGestes
    ? props.errorDetails.filter((error) => error.category === Category.GESTES)
    : [];

  const gestes =
    isCategoryGestes && "gestes" in props ? (props.gestes ?? []) : [];

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
    return 0;
  };

  return (
    <div className="overflow-hidden rounded-lg border-shadow">
      <table className="w-full">
        <caption className="bg-[var(--background-action-low-blue-france)] font-bold text-left p-4 flex items-center justify-between">
          <span className="flex gap-2 items-center">
            <p className="fr-mb-0 text-[var(--text-default-grey)]!">
              {isCategoryGestes &&
                wording.components.quote_error_card.title_gestes}
              {isCategoryAdmin &&
                wording.components.quote_error_card.title_admin}
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
              text={
                isCategoryGestes
                  ? wording.components.quote_error_card.tooltip.gestes
                  : isCategoryAdmin
                    ? wording.components.quote_error_card.tooltip.admin
                    : ""
              }
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
        {isCategoryGestes && gestes.length > 0
          ? gestes.map((geste, gIndex) => {
              const errorsForGeste = filteredGestesErrors.filter(
                (error) => error.geste_id === geste.id
              );
              const isLastGeste = gIndex === gestes.length - 1;

              return (
                <tbody key={geste.id}>
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
                  {errorsForGeste.map((error, index) => (
                    <QuoteErrorLine
                      deleteErrorReasons={props.deleteErrorReasons}
                      error={error}
                      isLastErrorInTable={
                        isLastGeste && index === errorsForGeste.length - 1
                      }
                      key={error.id}
                      onAddErrorComment={props.onAddErrorComment}
                      onDeleteError={props.onDeleteError}
                      onDeleteErrorComment={props.onDeleteErrorComment}
                      onUndoDeleteError={props.onUndoDeleteError}
                      quoteCheckId={props.quoteCheckId}
                    />
                  ))}
                </tbody>
              );
            })
          : null}
        {isCategoryAdmin ? (
          <tbody>
            {filteredAdminErrors.map((error) => (
              <QuoteErrorLine
                deleteErrorReasons={props.deleteErrorReasons}
                error={error}
                key={error.id}
                onAddErrorComment={props.onAddErrorComment}
                onDeleteError={props.onDeleteError}
                onDeleteErrorComment={props.onDeleteErrorComment}
                onUndoDeleteError={props.onUndoDeleteError}
                quoteCheckId={props.quoteCheckId}
              />
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default QuoteErrorTable;
