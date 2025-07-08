import { DataCheckRgeResult } from "@/types/dataChecks.types";

interface RgeResultsProps {
  results: DataCheckRgeResult | null;
  isLoading: boolean;
}

// Mapping des codes d'erreur vers des messages utilisateur
const getErrorMessage = (code: string) => {
  const errorMessages: Record<string, { title: string; message: string }> = {
    siret_not_found: {
      title: "SIRET non trouvé",
      message:
        "Aucune entreprise RGE n'a été trouvée avec ce numéro SIRET. Vérifiez que le SIRET est correct.",
    },
    rge_manquant: {
      title: "Qualification RGE manquante",
      message:
        "Cette entreprise n'a pas de qualification RGE active pour les critères demandés.",
    },
    invalid_parameters: {
      title: "Paramètres invalides",
      message:
        "Les paramètres fournis ne sont pas valides. Vérifiez le format du SIRET, du numéro RGE ou de la date.",
    },
    endpoint_not_found: {
      title: "Service temporairement indisponible",
      message:
        "Le service de vérification RGE est temporairement indisponible. Veuillez réessayer plus tard.",
    },
  };

  return (
    errorMessages[code] || {
      title: "Erreur de vérification",
      message: "Une erreur inattendue s'est produite lors de la vérification.",
    }
  );
};

export default function RgeResults({ results, isLoading }: RgeResultsProps) {
  if (isLoading) {
    return (
      <div className="fr-callout">
        <h3 className="fr-callout__title">Vérification en cours...</h3>
        <p className="fr-callout__text">
          Nous vérifions le statut RGE de l'entreprise.
        </p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  // Résultat invalide avec erreurs
  if (results.valid === false && results.error_details?.length) {
    const firstError = results.error_details[0];
    const errorInfo = getErrorMessage(firstError.code);

    return (
      <div className="fr-alert fr-alert--error">
        <h3 className="fr-alert__title">{errorInfo.title}</h3>
        <p>{errorInfo.message}</p>
        <div className="fr-mt-2w">
          <details className="fr-details">
            <summary className="fr-text--sm">Détails techniques</summary>
            <div className="fr-mt-1w">
              {results.error_details.map((error, index) => (
                <p key={index} className="fr-text--xs fr-mb-1v">
                  Code d'erreur : {error.code}
                </p>
              ))}
            </div>
          </details>
        </div>
      </div>
    );
  }

  // Succès avec résultats
  if (results.valid === true && results.results && results.results.length > 0) {
    return (
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12">
          <div className="fr-callout fr-callout--green-emeraude">
            <h3 className="fr-callout__title">
              {results.results.length === 1
                ? "Qualification RGE trouvée"
                : `${results.results.length} qualifications RGE trouvées`}
            </h3>
            <p className="fr-callout__text">
              L'entreprise dispose des qualifications RGE suivantes :
            </p>
          </div>
        </div>

        {results.results.map((result, index) => (
          <div key={index} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <div className="fr-card fr-card--sm">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <h4 className="fr-card__title">{result.nom_entreprise}</h4>
                  <p className="fr-card__desc">
                    {result.adresse}, {result.code_postal} {result.commune}
                  </p>

                  <div className="fr-card__start">
                    <div className="fr-badges-group">
                      <p className="fr-badge fr-badge--green-emeraude">
                        {result.organisme.toUpperCase()}
                      </p>
                      {result.particulier && (
                        <p className="fr-badge fr-badge--blue-france">
                          Particuliers
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="fr-card__end">
                    <div className="fr-mt-2w">
                      <p className="fr-text--sm fr-mb-1v">
                        <strong>SIRET :</strong> {result.siret}
                      </p>

                      {result.nom_certificat && (
                        <p className="fr-text--sm fr-mb-1v">
                          <strong>Certificat :</strong> {result.nom_certificat}
                        </p>
                      )}

                      {result.nom_qualification && (
                        <p className="fr-text--sm fr-mb-1v">
                          <strong>Qualification :</strong>{" "}
                          {result.nom_qualification}
                        </p>
                      )}

                      {result.domaine && (
                        <p className="fr-text--sm fr-mb-1v">
                          <strong>Domaine :</strong> {result.domaine}
                        </p>
                      )}

                      {result.meta_domaine && (
                        <p className="fr-text--sm fr-mb-1v">
                          <strong>Méta-domaine :</strong> {result.meta_domaine}
                        </p>
                      )}

                      <div className="fr-mt-2w">
                        <p className="fr-text--xs">
                          <strong>Validité :</strong>
                          {result.lien_date_debut && result.lien_date_fin ? (
                            <span>
                              {" "}
                              du{" "}
                              {new Date(
                                result.lien_date_debut
                              ).toLocaleDateString("fr-FR")}{" "}
                              au{" "}
                              {new Date(
                                result.lien_date_fin
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          ) : (
                            " Non renseignée"
                          )}
                        </p>
                      </div>

                      {(result.telephone ||
                        result.email ||
                        result.site_internet) && (
                        <div
                          className="fr-mt-2w fr-pt-2w"
                          style={{
                            borderTop: "1px solid var(--border-default-grey)",
                          }}
                        >
                          {result.telephone && (
                            <p className="fr-text--xs fr-mb-1v">
                              📞 {result.telephone}
                            </p>
                          )}
                          {result.email && (
                            <p className="fr-text--xs fr-mb-1v">
                              ✉️ {result.email}
                            </p>
                          )}
                          {result.site_internet && (
                            <p className="fr-text--xs">
                              🌐 {result.site_internet}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Succès mais aucun résultat
  if (
    results.valid === true &&
    (!results.results || results.results.length === 0)
  ) {
    return (
      <div className="fr-alert fr-alert--error">
        <h3 className="fr-alert__title">Aucun résultat trouvé</h3>
        <p>
          Aucune qualification RGE n'a été trouvée pour les critères de
          recherche spécifiés.
        </p>
      </div>
    );
  }
}
