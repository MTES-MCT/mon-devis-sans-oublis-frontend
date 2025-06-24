import { Notice } from "@/components";
import { quoteService } from "@/lib/client/apiWrapper";
import { ResultGestesClient } from "@/page-sections";
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

  let currentDevis = null;
  try {
    currentDevis = await quoteService.getQuoteCheck(params.quoteCheckId);
  } catch (error) {
    console.error("Error fetching devis:", error);
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
        profile={params.profile}
        quoteCheckId={params.quoteCheckId}
        showDeletedErrors={false}
        enableCrispFeedback={true}
      />
    </>
  );
}
