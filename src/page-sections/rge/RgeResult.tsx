import { DataCheckRgeResult } from "@/types/dataChecks.types";
import { CheckRGEGesteTypes } from "@/types";
import {
  getGesteLabel,
  getRgeErrorMessage,
  groupGestesByCategory,
  isGesteQualified,
} from "@/utils";

interface RgeResultsProps {
  results: DataCheckRgeResult | null;
  isLoading: boolean;
  selectedGestes: string[];
  typeGestesMetadata: CheckRGEGesteTypes;
}

export default function RgeResults({
  results,
  isLoading,
  selectedGestes,
  typeGestesMetadata,
}: RgeResultsProps) {
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
    const errorInfo = getRgeErrorMessage(firstError.code);

    // Cas spécial pour rge_manquant : afficher les gestes non qualifiés
    if (firstError.code === "rge_manquant") {
      const gestesByGroup = groupGestesByCategory(
        selectedGestes,
        typeGestesMetadata
      );

      return (
        <div className="fr-alert fr-alert--error">
          <h3 className="fr-alert__title">{errorInfo.title}</h3>
          <p className="fr-mb-3w">{errorInfo.message}</p>

          {/* Affichage des gestes non qualifiés */}
          <div className="fr-mb-3w">
            <h4 className="fr-text--md fr-text--bold fr-mb-2w">
              Gestes vérifiés sans qualification RGE :
            </h4>

            {Object.entries(gestesByGroup).map(([group, gestes]) => (
              <div key={group} className="fr-mb-3w">
                <h5 className="fr-text--sm fr-text--bold fr-mb-1w fr-text--mention-grey">
                  {group}
                </h5>
                <div className="fr-tags-group">
                  {gestes.map((geste) => (
                    <p key={geste} className="fr-tag fr-tag--error fr-tag--sm">
                      {getGesteLabel(geste, typeGestesMetadata)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

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

    // Autres types d'erreurs
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

  // Succès - Analyse des résultats par geste
  if (results.valid === true) {
    const gestesByGroup = groupGestesByCategory(
      selectedGestes,
      typeGestesMetadata
    );

    return (
      <div className="fr-grid-row fr-grid-row--gutters">
        {/* Résumé par geste */}
        <div className="fr-col-12">
          <h3 className="fr-callout__title">
            Résumé des qualifications RGE par geste
          </h3>

          <div className="fr-mt-3w">
            {Object.entries(gestesByGroup).map(([group, gestes]) => (
              <div key={group} className="fr-mb-6w">
                {/* Titre du groupe */}
                <div className="fr-mb-3w">
                  <h4 className="fr-text--lg fr-text--bold fr-mb-1v">
                    {group}
                  </h4>
                  <div
                    className="fr-hr"
                    style={{
                      borderColor: "var(--border-default-grey)",
                      marginTop: "0.5rem",
                    }}
                  />
                </div>

                {/* Liste des gestes */}
                <div className="fr-grid-row fr-grid-row--gutters">
                  {gestes.map((geste) => {
                    const isQualified = results.results
                      ? isGesteQualified(geste, results.results)
                      : false;

                    return (
                      <div key={geste} className="fr-col-12 fr-col-md-6">
                        <div
                          className={`fr-card fr-card--sm fr-card--border ${
                            isQualified
                              ? "fr-card--border-success"
                              : "fr-card--border-error"
                          }`}
                          style={{
                            borderLeft: `4px solid ${
                              isQualified
                                ? "var(--background-default-success)"
                                : "var(--background-default-error)"
                            }`,
                          }}
                        >
                          <div className="fr-card__body">
                            <div className="fr-card__content">
                              <div className="fr-grid-row fr-grid-row--middle">
                                {/* Badge statut */}
                                <div className="fr-col-auto">
                                  <div
                                    className={`fr-badge fr-badge--lg ${
                                      isQualified
                                        ? "fr-badge--success"
                                        : "fr-badge--error"
                                    }`}
                                  >
                                    {isQualified ? "✓ OUI" : "✗ NON"}
                                  </div>
                                </div>

                                {/* Nom du geste */}
                                <div className="fr-col fr-ml-2w">
                                  <p className="fr-text--md fr-mb-0">
                                    {getGesteLabel(geste, typeGestesMetadata)}
                                  </p>
                                </div>
                              </div>

                              {/* Message d'explication */}
                              <div className="fr-mt-2w">
                                <p className="fr-text--xs fr-text--mention-grey fr-mb-0">
                                  {isQualified
                                    ? "Cette entreprise est qualifiée RGE pour ce geste"
                                    : "Cette entreprise n'a pas de qualification RGE pour ce geste"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aucun résultat trouvé */}
        {(!results.results || results.results.length === 0) && (
          <div className="fr-col-12 fr-mt-4w">
            <div className="fr-alert fr-alert--info">
              <h3 className="fr-alert__title">
                Aucune qualification détaillée trouvée
              </h3>
              <p>
                Bien que la vérification soit valide, aucune qualification RGE
                détaillée n'a été trouvée dans nos données pour cette
                entreprise.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
