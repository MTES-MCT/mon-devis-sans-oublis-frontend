import { Notice } from "@/components";
import { quoteService } from "@/lib/client/apiWrapper";
import { ResultGestesClient } from "@/page-sections";
import { ErrorDetailDeleteReason, Profile } from "@/types";
import wording from "@/wording";

export default async function Result({
  params: initialParams,
}: {
  params: Promise<{ profile: string; quoteCheckId: string }>;
}) {
  const params = await initialParams;

  if (!params.quoteCheckId) {
    console.error("Erreur : quoteCheckId est undefined !");
  }

  // Vérifier si on est en mode conseiller (édition)
  const isConseillerMode = params.profile === Profile.CONSEILLER;

  let currentDevis = null;
  let deleteErrorReasons: ErrorDetailDeleteReason[] = [];

  try {
    // Récupérer le devis
    currentDevis = await quoteService.getQuoteCheck(params.quoteCheckId);

    // Récupérer les raisons de suppression seulement si on est conseiller
    if (isConseillerMode) {
      deleteErrorReasons = await quoteService.getDeleteErrorDetailReasons();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
      <Notice
        className="fr-notice--info"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />
      <ResultGestesClient
        currentDevis={currentDevis}
        deleteErrorReasons={isConseillerMode ? deleteErrorReasons : undefined}
        profile={params.profile}
        quoteCheckId={params.quoteCheckId}
        showDeletedErrors={isConseillerMode}
        enableCrispFeedback={!isConseillerMode}
      />
    </>
  );
}
