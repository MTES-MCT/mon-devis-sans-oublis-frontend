import { LoadingDots } from "@/components";
// import { quoteService } from "@/lib/client/apiWrapper";
// import { ResultClient } from "@/page-sections";
// import wording from "@/wording";

export default async function Result({
  params: initialParams,
}: {
  params: Promise<{ profile: string; quoteCaseId: string }>;
}) {
  const params = await initialParams;

  if (!params.quoteCaseId) {
    console.error("Erreur : quoteCaseId est undefined !");
  }

  // let currentDossier = null;
  // try {
  //   currentDossier = await quoteService.getQuote(params.quoteCaseId);
  // } catch (error) {
  //   console.error("Error fetching dossier:", error);
  // }

  return (
    <>
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <LoadingDots title="Page en cours de développement" />
        <p>En cours de développement, merci de patientier</p>
      </section>
      {/* <ResultClient
        currentDevis={currentDevis}
        profile={params.profile}
        quoteCheckId={params.quoteCheckId}
        showDeletedErrors={false}
        enableCrispFeedback={true}
      /> */}
    </>
  );
}
