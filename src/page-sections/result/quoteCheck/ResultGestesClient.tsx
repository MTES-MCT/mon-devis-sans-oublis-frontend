"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCrisp } from "@/hooks/useCrisp";

import { FILE_ERROR } from "../../upload/UploadClient";
import {
  GlobalCommentModal,
  GlobalErrorFeedbacksModal,
  LoadingDots,
  Notice,
  Toast,
} from "@/components";
import { useIsConseiller, useScrollPosition } from "@/hooks";
import {
  Category,
  ErrorDetails,
  QuoteCase,
  QuoteCheck,
  Rating,
  Status,
} from "@/types";
import {
  formatDateToFrench,
  getRedirectUrl,
  getRedirectUrlWithParams,
} from "@/utils";
import wording from "@/wording";
import { quoteService } from "@/lib/client/apiWrapper";
import ValidQuoteCheck from "./ValidQuoteCheck";
import InvalidQuoteCheck from "./InvalidQuoteCheck";

const MAX_RETRIES = 20;
const POLLING_INTERVAL = 30000;
const CRISP_NPS_EVENT_DELAY = 20000;
const CRISP_NPS_EVENT_NAME = "nps";
const CRISP_NPS_LOCALSTORAGE_FLAG = "crispNpsEventTriggered";

interface ResultGestesClientProps {
  currentDevis: QuoteCheck | null;
  deleteErrorReasons?: { id: string; label: string }[];
  profile: string | null | undefined;
  quoteCheckId: string;
  showDeletedErrors: boolean;
  enableCrispFeedback?: boolean;
  dossier?: QuoteCase;
}

export default function ResultGestesClient({
  currentDevis: initialDevis,
  deleteErrorReasons,
  profile,
  quoteCheckId,
  showDeletedErrors,
  enableCrispFeedback = false,
  dossier,
}: ResultGestesClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isButtonSticky = useScrollPosition();
  const { isLoaded, triggerEvent } = useCrisp();

  const [currentDevis, setCurrentDevis] = useState<QuoteCheck | null>(
    initialDevis
  );
  const [hasFeedbackBeenSubmitted, setHasFeedbackBeenSubmitted] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(
    !initialDevis || initialDevis.status === Status.PENDING
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGlobalCommentModalOpen, setIsGlobalCommentModalOpen] =
    useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [shouldRedirectToUpload, setShouldRedirectToUpload] =
    useState<boolean>(false);
  const [hasPollingError, setHasPollingError] = useState<boolean>(false);

  const isConseillerAndEdit = useIsConseiller();

  // Gestion de l'événement Crisp automatique
  useEffect(() => {
    if (!enableCrispFeedback || !isLoaded || isLoading) return;
    const hasEventTriggered = localStorage.getItem(CRISP_NPS_LOCALSTORAGE_FLAG);
    if (hasEventTriggered) return;

    const timer = setTimeout(() => {
      triggerEvent(CRISP_NPS_EVENT_NAME);
      localStorage.setItem(CRISP_NPS_LOCALSTORAGE_FLAG, "true");
      console.log(`Événement ${CRISP_NPS_EVENT_NAME} déclenché`);
    }, CRISP_NPS_EVENT_DELAY);

    return () => clearTimeout(timer);
  }, [isLoaded, enableCrispFeedback, isLoading, triggerEvent]);

  const isDataValid = (devis: QuoteCheck | null): boolean => {
    if (!devis) return false;

    return !!(
      devis.finished_at &&
      devis.filename &&
      devis.status &&
      devis.status !== Status.PENDING
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    setCurrentDevis(initialDevis);
  }, [initialDevis]);

  useEffect(() => {
    if (shouldRedirectToUpload) {
      setIsLoading(false);
      return;
    }

    let isPollingActive = true;
    let retryCount = 0;

    const pollQuote = async () => {
      if (!isPollingActive) return;

      try {
        const data = await quoteService.getQuoteCheck(quoteCheckId);

        if (!data || !data.status) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(pollQuote, POLLING_INTERVAL);
          } else {
            setIsLoading(false);
          }
          return;
        }

        const isInvalidStatus = data.status === Status.INVALID;
        const fileErrors =
          data.error_details?.filter(
            (error: ErrorDetails) => error.category === Category.FILE
          ) || [];
        if (isInvalidStatus && fileErrors.length > 0) {
          const fileErrorMessage = encodeURIComponent(
            fileErrors[0]?.title || wording.upload.error.notice.description
          );
          sessionStorage.setItem("fileErrorMessage", fileErrorMessage);
          setShouldRedirectToUpload(true);
          setIsLoading(false);
          return;
        }

        setCurrentDevis(data);

        if (
          (data.status === Status.VALID || data.status === Status.INVALID) &&
          isDataValid(data)
        ) {
          setIsLoading(false);
          isPollingActive = false;
        } else if (data.status === Status.PENDING || !isDataValid(data)) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(pollQuote, POLLING_INTERVAL);
          } else {
            console.error("Max retries reached - data still incomplete");
            setHasPollingError(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error polling quote:", error);
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(pollQuote, POLLING_INTERVAL);
        } else {
          console.error("Max retries reached - polling failed");
          setHasPollingError(true);
          setIsLoading(false);
        }
      }
    };

    pollQuote();

    return () => {
      isPollingActive = false;
    };
  }, [quoteCheckId, shouldRedirectToUpload]);

  useEffect(() => {
    if (shouldRedirectToUpload) {
      const fileErrorMessage =
        sessionStorage.getItem("fileErrorMessage") ||
        wording.upload.error.notice.description;

      // Utiliser la fonction utilitaire pour construire l'URL
      const queryParams: Record<string, string> = { error: FILE_ERROR };
      if (fileErrorMessage) {
        queryParams.message = fileErrorMessage;
      }

      const url = getRedirectUrlWithParams(
        "/televersement/renovation-par-gestes",
        profile,
        queryParams
      );

      router.push(url);
      sessionStorage.removeItem("fileErrorMessage");
    }
  }, [shouldRedirectToUpload, profile, router]);

  const handleAddErrorComment = async (
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) => {
    if (!currentDevis) return;

    try {
      await quoteService.addErrorComment(quoteCheckId, errorDetailsId, comment);

      setCurrentDevis((prevDevis) => {
        if (!prevDevis) return null;
        return {
          ...prevDevis,
          error_details: prevDevis.error_details.map((error) =>
            error.id === errorDetailsId ? { ...error, comment } : error
          ),
        };
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  const handleDeleteErrorDetail = async (
    quoteCheckId: string,
    errorDetailId: string,
    reason: string
  ) => {
    if (!currentDevis) return;

    const updatedDevis = {
      ...currentDevis,
      error_details: (currentDevis.error_details || []).map((error) => ({
        ...error,
        deleted: error.id === errorDetailId ? true : error.deleted,
      })),
    };

    setCurrentDevis(updatedDevis);

    try {
      await quoteService.deleteErrorDetail(quoteCheckId, errorDetailId, reason);
      const refreshedDevis = await quoteService.getQuoteCheck(quoteCheckId);
      setCurrentDevis(refreshedDevis);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'erreur:", error);
      setCurrentDevis(currentDevis);
    }
  };

  const handleDeleteError = async (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => {
    if (!reason) {
      console.error("Erreur: reason est vide dans ResultClient !");
      return;
    }

    if (!currentDevis) {
      console.error("Erreur: currentDevis est null dans ResultClient !");
      return;
    }

    const foundReason = deleteErrorReasons?.find((r) => r.id === reason);
    const finalReason = foundReason ? foundReason.label : reason;

    setCurrentDevis((prevDevis) => {
      if (!prevDevis) return null;
      return {
        ...prevDevis,
        error_details: prevDevis.error_details.map((error) =>
          error.id === errorDetailsId ? { ...error, deleted: true } : error
        ),
      };
    });

    // Utiliser handleDeleteErrorDetail pour l'édition conseiller
    if (isConseillerAndEdit) {
      await handleDeleteErrorDetail(quoteCheckId, errorDetailsId, finalReason);
    }
  };

  const handleUndoDeleteError = async (
    quoteCheckId: string,
    errorDetailsId: string
  ) => {
    if (!currentDevis) return;

    setCurrentDevis((prevDevis) => {
      if (!prevDevis) return null;
      return {
        ...prevDevis,
        error_details: prevDevis.error_details.map((error) =>
          error.id === errorDetailsId ? { ...error, deleted: false } : error
        ),
      };
    });

    try {
      const response = await quoteService.undoDeleteErrorDetail(
        quoteCheckId,
        errorDetailsId
      );

      if (response === null) {
        return;
      }

      const updatedDevis = await quoteService.getQuoteCheck(quoteCheckId);
      setCurrentDevis(updatedDevis);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la suppression:", error);

      setCurrentDevis((prevDevis) => {
        if (!prevDevis) return null;
        return {
          ...prevDevis,
          error_details: prevDevis.error_details.map((error) =>
            error.id === errorDetailsId ? { ...error, deleted: true } : error
          ),
        };
      });
    }
  };

  const handleHelpClick = async (comment: string, errorDetailsId: string) => {
    try {
      await quoteService.sendErrorFeedback(
        comment,
        errorDetailsId,
        quoteCheckId
      );
    } catch (error) {
      console.error("Error sending feedbacks:", error);
    }
  };

  const handleSubmitFeedback = async (
    comment: string,
    email: string | null,
    rating: Rating
  ) => {
    try {
      await quoteService.sendGlobalFeedback(quoteCheckId, {
        comment,
        email,
        rating,
      });
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset";
      }
      setIsModalOpen(false);
      setShowToast(true);
      setHasFeedbackBeenSubmitted(true);
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const handleDeleteErrorComment = async (
    quoteCheckId: string,
    errorDetailsId: string
  ) => {
    if (!currentDevis) return;

    try {
      await quoteService.removeErrorDetailComment(quoteCheckId, errorDetailsId);

      const updatedDevis = await quoteService.getQuoteCheck(quoteCheckId);
      setCurrentDevis(updatedDevis);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);

      try {
        const refreshedDevis = await quoteService.getQuoteCheck(quoteCheckId);
        setCurrentDevis(refreshedDevis);
      } catch (refreshError) {
        console.error(
          "Erreur lors du rafraîchissement des données:",
          refreshError
        );
      }
    }
  };

  const handleSubmitGlobalComment = async (
    quoteCheckId: string,
    comment: string
  ) => {
    try {
      await quoteService.addQuoteCheckComment(quoteCheckId, comment);
      const updatedDevis = await quoteService.getQuoteCheck(quoteCheckId);
      setCurrentDevis(updatedDevis);
      setIsGlobalCommentModalOpen(false);
    } catch (error) {
      console.error("Error adding global comment:", error);
    }
  };

  const handleDeleteGlobalComment = async (quoteCheckId: string) => {
    try {
      await quoteService.removeQuoteCheckComment(quoteCheckId);
      setCurrentDevis((prev) =>
        prev
          ? {
              ...prev,
              comment: "",
            }
          : null
      );

      const updatedDevis = await quoteService.getQuoteCheck(quoteCheckId);
      setCurrentDevis(updatedDevis);
    } catch (error) {
      console.error("Error deleting global comment:", error);
    }
  };

  if (hasPollingError) {
    return (
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <div className="fr-alert fr-alert--error fr-mb-4w">
            <h3>{wording.page_upload_id.analysis_error}</h3>
            <p>
              L'analyse a pris plus de temps que prévu. Veuillez réessayer ou
              contactez le support si le problème persiste.
            </p>
            <div className="fr-btns-group fr-mt-3w">
              <button
                className="fr-btn fr-btn--secondary"
                onClick={() => {
                  setHasPollingError(false);
                  setIsLoading(true);
                  window.location.reload();
                }}
              >
                Réessayer
              </button>
              <button
                className="fr-btn fr-btn--tertiary"
                onClick={() =>
                  router.push(
                    getRedirectUrl(
                      "/televersement/renovation-par-gestes",
                      profile
                    )
                  )
                }
              >
                Nouvelle analyse
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading || !isDataValid(currentDevis)) {
    return (
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <LoadingDots
          title={wording.page_upload_id.analysis_in_progress_title}
        />
        <p>{wording.page_upload_id.analysis_in_progress}</p>
      </section>
    );
  }

  if (shouldRedirectToUpload) {
    return (
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <LoadingDots title={wording.page_upload_id.analysis_redirect_title} />
        <p>{wording.page_upload_id.analysis_redirect}</p>
      </section>
    );
  }

  return (
    <>
      {showDeletedErrors && currentDevis && isConseillerAndEdit && (
        <Notice
          className="fr-notice--warning"
          description="Vous pouvez ajouter des commentaires et/ou supprimer des corrections."
          title="Mode personnalisation activé"
        />
      )}
      {showToast && (
        <div className="fixed top-10 right-20 z-50">
          <Toast
            duration={3000}
            message="Votre avis a bien été pris en compte. Merci pour votre aide précieuse !"
            onClose={() => setShowToast(false)}
          />
        </div>
      )}

      <div className="fr-container-fluid fr-mt-8v">
        {currentDevis?.status === Status.VALID ? (
          <ValidQuoteCheck
            analysisDate={formatDateToFrench(currentDevis.finished_at)}
            uploadedFileName={currentDevis.filename}
          />
        ) : currentDevis ? (
          <InvalidQuoteCheck
            analysisDate={formatDateToFrench(currentDevis.finished_at)}
            comment={currentDevis.comment || ""}
            deleteErrorReasons={deleteErrorReasons}
            gestes={currentDevis.gestes}
            id={currentDevis.id}
            key={`${currentDevis.id}-${JSON.stringify(
              currentDevis.error_details
            )}`}
            list={(currentDevis.error_details || [])
              .filter((error) => showDeletedErrors || !error.deleted)
              .map((error) => ({
                ...error,
                className: error.deleted
                  ? "line-through text-gray-500 opacity-50"
                  : "",
              }))}
            onAddErrorComment={handleAddErrorComment}
            onAddGlobalComment={handleSubmitGlobalComment}
            onDeleteError={handleDeleteError}
            onDeleteErrorComment={handleDeleteErrorComment}
            onDeleteGlobalComment={handleDeleteGlobalComment}
            onHelpClick={handleHelpClick}
            onOpenGlobalCommentModal={() => setIsGlobalCommentModalOpen(true)}
            onUndoDeleteError={handleUndoDeleteError}
            uploadedFileName={currentDevis.filename || ""}
            controlsCount={currentDevis.controls_count || 0}
            dossier={dossier}
          />
        ) : null}
        <GlobalCommentModal
          isOpen={isGlobalCommentModalOpen}
          onClose={() => setIsGlobalCommentModalOpen(false)}
          onSubmitComment={(comment) =>
            handleSubmitGlobalComment(quoteCheckId, comment)
          }
          quoteCheckId={quoteCheckId}
        />
        <div className="fr-container flex flex-col relative">
          {!hasFeedbackBeenSubmitted && enableCrispFeedback && (
            <div
              className={`${
                currentDevis?.status === Status.VALID
                  ? "fixed bottom-14 md:right-37 right-4"
                  : isButtonSticky
                    ? "fixed bottom-14 md:right-37 right-4"
                    : "absolute bottom-[-40px] md:right-6 right-4"
              } self-end z-20`}
            >
              <button
                className="fr-btn fr-btn--icon-right fr-icon-star-fill rounded-full"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                Donner mon avis
              </button>
            </div>
          )}
          {isModalOpen && (
            <GlobalErrorFeedbacksModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmitFeedback={handleSubmitFeedback}
            />
          )}
        </div>
      </div>
    </>
  );
}
