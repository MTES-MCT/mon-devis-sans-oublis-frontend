import { getQuoteCase } from "@/actions/quoteCase.actions";
import { quoteService } from "@/lib/client/apiWrapper";
import { ResultGestesClient } from "@/page-sections";

export default async function DevisDossierPage({
  params: initialParams,
}: {
  params: Promise<{
    profile: string;
    quoteCheckId: string;
    quoteCaseId: string;
  }>;
}) {
  const params = await initialParams;

  if (!params.quoteCheckId) {
    console.error("Erreur : quoteCheckId est undefined !");
  }

  if (!params.quoteCaseId) {
    console.error("Erreur : quoteCaseId est undefined !");
  }

  let currentDevis = null;
  let currentDossier = null;

  try {
    currentDevis = await quoteService.getQuoteCheck(params.quoteCheckId);
    currentDossier = await getQuoteCase(params.quoteCaseId);
  } catch (error) {
    console.error("Error fetching :", error);
  }

  return (
    <ResultGestesClient
      currentDevis={currentDevis}
      profile={params.profile}
      quoteCheckId={params.quoteCheckId}
      showDeletedErrors={false}
      enableCrispFeedback={true}
      dossier={currentDossier ?? undefined}
    />
  );
}
