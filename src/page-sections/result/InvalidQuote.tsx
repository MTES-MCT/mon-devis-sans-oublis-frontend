"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { Badge, BadgeSize, BadgeVariant, QuoteErrorTable } from "@/components";
import { useConseillerRoutes } from "@/hooks";
import { Category, ErrorDetails, Gestes } from "@/types";
import wording from "@/wording";
import QuoteErrorSharingCard from "@/components/QuoteErrorSharingCard/QuoteErrorSharingCard";
import QuoteLaunchAnalysisCard from "@/components/QuoteLaunchAnalysisCard/QuoteLaunchAnalysisCard";
import QuoteConformityCard from "@/components/QuoteConformityCard/QuoteConformityCard";
import GlobalComment from "@/components/GlobalComment/GlobalComment";

interface InvalidQuoteProps {
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
}

export default function InvalidQuote({
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
}: InvalidQuoteProps) {
  const [editedComment, setEditedComment] = useState(comment || "");

  const { isConseillerAndEdit } = useConseillerRoutes();

  useEffect(() => {
    setEditedComment(comment || "");
  }, [comment]);

  return (
    <>
      <section className="fr-container fr-gap-8">
        <span className="flex flex-col md:flex-row items-center justify-between fr-mb-2w">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center">
              <h1 className="mb-0! text-center md:text-left">
                {wording.page_upload_id.title}
              </h1>
            </div>
          </div>
        </span>
        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-wrap gap-4 fr-mb-4w justify-center md:justify-between w-full">
            {/* Conteneur pour les badges */}
            <div className="flex flex-wrap gap-4">
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
                  label={uploadedFileName}
                  size={BadgeSize.SMALL}
                  variant={BadgeVariant.BLUE_DARK}
                />
              )}
            </div>

            {/* Bouton d'ajout de commentaire - uniquement si éditable et pas de commentaire */}
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

          {/* Zone de commentaire - uniquement si commentaire existe */}
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
          <div className="flex flex-col lg:flex-row gap-4 w-full fr-mb-4w lg:items-start">
            <div className="fr-alert fr-alert--info lg:w-3/5 !py-4">
              <h3 className="fr-alert__title !mb-2">
                {wording.page_upload_id.quotation_alert_ko_title}
              </h3>
              <p className="!mb-0">
                {wording.page_upload_id.quotation_alert_ko_description}
              </p>
            </div>
            <div className="lg:w-2/5">
              <QuoteConformityCard
                controlsCount={controlsCount}
                correctionsCount={list.length}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="fr-container">
        <h3 className="fr-mt-5w text-center md:text-left">
          {wording.page_upload_id.subtitle}
        </h3>
        <div className="flex flex-col gap-8">
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
        <div className="flex md:flex-row flex-col gap-6">
          <QuoteErrorSharingCard
            className="md:flex-1"
            fileName={uploadedFileName}
            adminErrorList={list}
            gestes={gestes}
          />
          <QuoteLaunchAnalysisCard className="md:flex-1" />
        </div>
      </section>
    </>
  );
}
