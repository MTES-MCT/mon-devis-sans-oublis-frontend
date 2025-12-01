import { getQuoteCase } from "@/actions/quoteCase.actions";
import {
  QuoteSidemenuDesktop,
  QuoteSidemenuMobile,
} from "@/components/QuoteSideMenu";
import { quoteService } from "@/lib/client/apiWrapper";
import { ResultGestesClient } from "@/page-sections";
import { ErrorDetailDeleteReason, Profile, QuoteCheck } from "@/types";

export default async function DevisDossierPage({
  params: initialParams,
}: {
  params: Promise<{
    profile: string;
    quoteCheckId: string;
    quoteCaseId: string;
  }>;
}) {
  const { profile, quoteCaseId, quoteCheckId } = await initialParams;

  if (!quoteCheckId) {
    console.error("Erreur : quoteCheckId est undefined !");
  }

  if (!quoteCaseId) {
    console.error("Erreur : quoteCaseId est undefined !");
  }

  // Vérifier si on est en mode conseiller (édition)
  const isConseillerMode = profile === Profile.CONSEILLER;

  let currentDevis = null;
  let currentDossier = null;
  let allQuoteChecks: QuoteCheck[] = [];
  let deleteErrorReasons: ErrorDetailDeleteReason[] = [];

  try {
    currentDevis = await quoteService.getQuoteCheck(quoteCheckId);
    currentDossier = await getQuoteCase(quoteCaseId);

    // Récupérer tous les devis du dossier
    if (currentDossier?.quote_checks) {
      allQuoteChecks = currentDossier.quote_checks;
    }

    // Récupérer les raisons de suppression seulement si on est conseiller
    if (isConseillerMode) {
      deleteErrorReasons = await quoteService.getDeleteErrorDetailReasons();
    }
  } catch (error) {
    console.error("Error fetching :", error);
  }

  return (
    <>
      {/* Navigation mobile - visible UNIQUEMENT sur mobile */}
      <div className="fr-container fr-unhidden fr-hidden-md">
        <QuoteSidemenuMobile
          quoteChecks={allQuoteChecks}
          currentQuoteCheckId={quoteCheckId}
          profile={profile}
          quoteCaseId={quoteCaseId}
        />
      </div>

      <div className="fr-container">
        <div className="fr-grid-row">
          {/* Navigation latérale desktop - visible UNIQUEMENT sur desktop */}
          <div className="fr-col-md-3 fr-mt-8v fr-hidden fr-unhidden-md">
            <QuoteSidemenuDesktop
              quoteChecks={allQuoteChecks}
              currentQuoteCheckId={quoteCheckId}
              profile={profile}
              quoteCaseId={quoteCaseId}
            />
          </div>

          {/* Contenu principal */}
          <div className="fr-col-12 fr-col-md-9">
            <ResultGestesClient
              currentDevis={currentDevis}
              deleteErrorReasons={
                isConseillerMode ? deleteErrorReasons : undefined
              }
              profile={profile}
              quoteCheckId={quoteCheckId}
              showDeletedErrors={isConseillerMode}
              enableCrispFeedback={!isConseillerMode}
              dossier={currentDossier ?? undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
