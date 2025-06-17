import { LoadingDots } from "@/components";
import { getQuoteCase } from "@/actions/quoteCase.actions";

export default async function Result({
  params: initialParams,
}: {
  params: Promise<{ profile: string; quoteCaseId: string }>;
}) {
  const params = await initialParams;

  if (!params.quoteCaseId) {
    console.error("Erreur : quoteCaseId est undefined !");
    return (
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <div className="fr-alert fr-alert--error">
          <p>Erreur : Identifiant du dossier manquant</p>
        </div>
      </section>
    );
  }

  let currentDossier = null;
  let error = null;

  try {
    currentDossier = await getQuoteCase(params.quoteCaseId);
  } catch (e) {
    console.error("Error fetching dossier:", e);
    error = e;
  }

  if (error) {
    return (
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <div className="fr-alert fr-alert--error">
          <p>Erreur lors de la récupération du dossier</p>
        </div>
      </section>
    );
  }

  if (!currentDossier) {
    return (
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <LoadingDots title="Chargement du dossier..." />
      </section>
    );
  }

  return (
    <>
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <h1>Résultats de l'analyse du dossier</h1>

          {/* Informations du dossier */}
          <div className="fr-card fr-mt-4v">
            <div className="fr-card__body">
              <div className="fr-card__content">
                <h3 className="fr-card__title">Dossier {currentDossier.id}</h3>
                <p className="fr-card__desc">
                  <strong>Statut :</strong> {currentDossier.status}
                  <br />
                  <strong>Profile :</strong> {currentDossier.profile}
                  <br />
                  <strong>Type de rénovation :</strong>{" "}
                  {currentDossier.renovation_type}
                  <br />
                  {currentDossier.reference && (
                    <>
                      <strong>Référence :</strong> {currentDossier.reference}
                      <br />
                    </>
                  )}
                </p>

                {currentDossier.metadata && (
                  <div className="fr-mt-4v">
                    <h4>Métadonnées</h4>
                    <p>
                      <strong>Aides :</strong>{" "}
                      {currentDossier.metadata.aides.join(", ")}
                      <br />
                      <strong>Gestes :</strong>{" "}
                      {currentDossier.metadata.gestes
                        .flatMap((group) => group.values)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zone de debug - Affichage JSON complet */}
          <div className="fr-mt-8v">
            <details className="fr-mb-4v">
              <summary className="fr-btn fr-btn--tertiary fr-btn--sm">
                Voir les données complètes (Debug)
              </summary>
              <div className="fr-mt-4v">
                <pre
                  className="fr-code fr-code--block"
                  style={{
                    backgroundColor: "#f6f6f6",
                    padding: "1rem",
                    borderRadius: "4px",
                    overflow: "auto",
                    maxHeight: "400px",
                    fontSize: "12px",
                  }}
                >
                  {JSON.stringify(currentDossier, null, 2)}
                </pre>
              </div>
            </details>

            <p className="fr-text--sm">
              <em>Interface complète en cours de développement...</em>
            </p>
          </div>
        </div>
      </section>

      {/* 
      <ResultClient
        currentDossier={currentDossier}
        profile={params.profile}
        quoteCaseId={params.quoteCaseId}
        showDeletedErrors={false}
        enableCrispFeedback={true}
      /> 
      */}
    </>
  );
}
