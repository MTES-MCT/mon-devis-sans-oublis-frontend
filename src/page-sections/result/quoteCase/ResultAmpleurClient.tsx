"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCrisp } from "@/hooks/useCrisp";
import { LoadingDots, Notice } from "@/components";
import { FileErrorCodes, QuoteCase, Status } from "@/types";
import { getQuoteCase } from "@/actions/quoteCase.actions";
import { formatDateToFrench } from "@/utils";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Image from "next/image";
import InvalidQuoteCase from "./InvalidQuoteCase";
import ValidQuoteCase from "./ValidQuoteCase";
import { perfLogger } from "@/utils/performanceLogger";

const MAX_RETRIES = 20;
const POLLING_INTERVAL = 30000;
const CRISP_NPS_EVENT_DELAY = 20000;
const CRISP_NPS_EVENT_NAME = "nps";
const CRISP_NPS_LOCALSTORAGE_FLAG = "crispNpsEventTriggered";

interface ResultAmpleurClientProps {
  currentDossier: QuoteCase | null;
  profile: string;
  quoteCaseId: string;
  enableCrispFeedback?: boolean;
}

export default function ResultAmpleurClient({
  currentDossier: initialDossier,
  profile,
  quoteCaseId,
  enableCrispFeedback = false,
}: ResultAmpleurClientProps) {
  const router = useRouter();
  const { isLoaded, triggerEvent } = useCrisp();

  const [currentDossier, setCurrentDossier] = useState<QuoteCase | null>(
    initialDossier
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPollingError, setHasPollingError] = useState<boolean>(false);

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

  useEffect(() => {
    setCurrentDossier(initialDossier);
  }, [initialDossier]);

  // Fonction pour vérifier si tous les devis sont traités
  const areAllQuotesProcessed = (dossier: QuoteCase): boolean => {
    if (!dossier.quote_checks || dossier.quote_checks.length === 0) {
      return false; // Pas encore de devis, on continue le polling
    }

    return dossier.quote_checks.every(
      (quote) => quote.status !== Status.PENDING && quote.finished_at
    );
  };

  // Polling pour récupérer les mises à jour du dossier et ses devis
  useEffect(() => {
    let isPollingActive = true;
    let retryCount = 0;
    let pollCount = 0;

    const pollDossier = async () => {
      if (!isPollingActive) return;

      pollCount++;
      const pollLabel = `polling_${pollCount}`;

      try {
        perfLogger.start(pollLabel);
        perfLogger.start("api_getQuoteCase");

        const dossierData = await getQuoteCase(quoteCaseId);

        perfLogger.end("api_getQuoteCase", {
          quoteCaseId,
          quotesCount: dossierData.quote_checks?.length || 0,
          status: dossierData.status,
        });

        setCurrentDossier(dossierData);

        // Log l'état des devis
        const quoteStates = dossierData.quote_checks?.reduce(
          (acc, q) => {
            acc[q.status] = (acc[q.status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        console.log(`[POLL-${pollCount}] État des devis:`, quoteStates);

        // Vérifier si tous les devis sont traités
        const allProcessed = areAllQuotesProcessed(dossierData);

        perfLogger.end(pollLabel, {
          allProcessed,
          retryCount,
        });

        if (allProcessed) {
          // Afficher résumé des performances
          console.log(`[POLLING-COMPLETE] Terminé après ${pollCount} appels`);
          perfLogger.printSummary();

          // Si tous les devis sont traités, arrêter le polling
          setIsLoading(false);
          isPollingActive = false;
        } else {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(
              `[POLL-SCHEDULE] Prochain poll dans ${POLLING_INTERVAL}ms`
            );
            setTimeout(pollDossier, POLLING_INTERVAL);
          } else {
            console.error("[POLL-ERROR] Max retries atteint");
            perfLogger.printSummary();
            setHasPollingError(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        perfLogger.end(pollLabel, { error: true });
        console.error(`[POLL-ERROR-${pollCount}]`, error);

        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(pollDossier, POLLING_INTERVAL);
        } else {
          perfLogger.printSummary();
          setHasPollingError(true);
          setIsLoading(false);
        }
      }
    };

    // Log initial
    console.log("[POLLING-START] Début du polling pour dossier:", quoteCaseId);
    perfLogger.start("total_processing_time");

    // Démarrer le polling si nécessaire
    if (!currentDossier || !areAllQuotesProcessed(currentDossier)) {
      pollDossier();
    } else {
      setIsLoading(false);
    }

    return () => {
      isPollingActive = false;
      const totalTime = perfLogger.end("total_processing_time");
      if (totalTime) {
        console.log(
          `[TOTAL-TIME] Temps total de traitement: ${(totalTime / 1000).toFixed(2)}s`
        );
      }
    };
  }, [quoteCaseId, currentDossier]);

  // Calculer les statistiques des devis
  const getQuoteStats = () => {
    if (!currentDossier?.quote_checks) {
      return { total: 0, processed: 0, valid: 0, invalid: 0, pending: 0 };
    }

    const total = currentDossier.quote_checks.length;
    const processed = currentDossier.quote_checks.filter(
      (q) => q.status !== Status.PENDING
    ).length;
    const valid = currentDossier.quote_checks.filter(
      (q) => q.status === Status.VALID
    ).length;
    const invalid = currentDossier.quote_checks.filter(
      (q) => q.status === Status.INVALID
    ).length;
    const pending = currentDossier.quote_checks.filter(
      (q) => q.status === Status.PENDING
    ).length;

    return { total, processed, valid, invalid, pending };
  };

  const stats = getQuoteStats();

  // État d'erreur de polling
  if (hasPollingError) {
    return (
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <div className="fr-alert fr-alert--error fr-mb-4w">
            <h3>Erreur lors de l'analyse</h3>
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
                  router.push(`/${profile}/televersement/renovation-ampleur`)
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

  // État de chargement
  if (isLoading || !currentDossier) {
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
                label: "Analyse des devis",
                href: undefined,
              },
              {
                label: `Etape 4/4`,
              },
            ]}
          />
        </div>
        <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
          <LoadingDots title="Analyse en cours" />
          <p>
            Quelques secondes à tenir, nous vous ferons signe lorsque ce sera
            terminé.
          </p>

          {stats.total > 0 && (
            <div className="fr-mt-4v text-center">
              <p className="fr-text--sm">
                Progression: {stats.processed}/{stats.total} devis traités
              </p>
            </div>
          )}

          <Image
            alt="Image vérifier plusieurs devis"
            className="shrink-0"
            height={48}
            src="/svg/system/search.svg"
            width={48}
          />
        </section>
      </>
    );
  }

  const hasDossierFileTypeError = currentDossier.quote_checks?.some((quote) =>
    quote.errors?.some((error) =>
      Object.values(FileErrorCodes).includes(error as FileErrorCodes)
    )
  );

  return (
    <div className="fr-container-fluid">
      {currentDossier.status === Status.VALID ? (
        <ValidQuoteCase
          analysisDate={formatDateToFrench(currentDossier.finished_at ?? "")}
          dossier={currentDossier}
        />
      ) : (
        <>
          {/* Notice en cas d'erreur FILE ERROR */}
          {hasDossierFileTypeError && (
            <Notice
              buttonClose={true}
              className="fr-notice--alert"
              description="Retrouvez le detail des erreurs dans le tableau des erreurs ci-dessous (fichiers grisés)."
              title="Nous n'avons pas pu analyser tous vos devis."
            />
          )}
          <InvalidQuoteCase
            analysisDate={formatDateToFrench(currentDossier.finished_at ?? "")}
            dossier={currentDossier}
            stats={stats}
            profile={profile}
            quoteCaseId={quoteCaseId}
            onNavigateToQuote={(quoteId: string) =>
              router.push(`/${profile}/devis/${quoteId}`)
            }
          />
        </>
      )}
    </div>
  );
}
