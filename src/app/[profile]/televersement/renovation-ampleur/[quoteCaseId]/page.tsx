import { getQuoteCase } from "@/actions/quoteCase.actions";
import ResultAmpleurClient from "@/page-sections/result/quoteCase/ResultAmpleurClient";

export default async function ResultAmpleurPage({
  params: initialParams,
}: {
  params: Promise<{ profile: string; quoteCaseId: string }>;
}) {
  const params = await initialParams;

  if (!params.quoteCaseId) {
    console.error("Erreur : quoteCaseId est undefined !");
  }

  let currentDossier = null;
  try {
    currentDossier = await getQuoteCase(params.quoteCaseId);
  } catch (error) {
    console.error("Error fetching dossier:", error);
  }

  return (
    <ResultAmpleurClient
      currentDossier={currentDossier}
      profile={params.profile}
      quoteCaseId={params.quoteCaseId}
      enableCrispFeedback={true}
    />
  );
}
