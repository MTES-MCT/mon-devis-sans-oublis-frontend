import { QuoteCase, Status } from "@/types";

interface QuoteStats {
  total: number;
  processed: number;
  valid: number;
  invalid: number;
  pending: number;
}

interface InvalidQuoteCaseProps {
  analysisDate: string;
  dossier: QuoteCase;
  stats: QuoteStats;
  profile: string;
  quoteCaseId: string;
  onNavigateToQuote: (quoteId: string) => void;
}

export default function InvalidQuoteCase({
  analysisDate,
  dossier,
  stats,
  profile,
  onNavigateToQuote,
}: InvalidQuoteCaseProps) {
  // Séparer les devis par statut
  const invalidQuotes =
    dossier.quote_checks?.filter((q) => q.status === Status.INVALID) || [];
  const validQuotes =
    dossier.quote_checks?.filter((q) => q.status === Status.VALID) || [];

  // Calculer le total d'erreurs
  const totalErrors = invalidQuotes.reduce(
    (total, quote) => total + (quote.error_details?.length || 0),
    0
  );

  return (
    <section className="fr-container fr-py-10w">
      {/* Message d'alerte principal */}
      <div className="fr-alert fr-alert--error fr-mb-6w">
        <h2 className="fr-h4">⚠️ Votre dossier nécessite des corrections</h2>
        <p>
          {stats.invalid} devis sur {stats.total} contiennent des erreurs qui
          doivent être corrigées pour que votre dossier soit conforme aux
          exigences de la rénovation d'ampleur.
        </p>
        <p>
          <strong>Total d'erreurs détectées :</strong> {totalErrors}
        </p>
      </div>

      {/* Informations du dossier */}
      <div className="fr-card fr-mb-6w">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">Résumé du dossier {dossier.id}</h3>
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
                <p>
                  <strong>Profile :</strong> {dossier.profile}
                  <br />
                  <strong>Type de rénovation :</strong>{" "}
                  {dossier.renovation_type}
                  <br />
                  <strong>Analysé le :</strong> {analysisDate}
                  <br />
                  {dossier.reference && (
                    <>
                      <strong>Référence :</strong> {dossier.reference}
                      <br />
                    </>
                  )}
                </p>
              </div>
              <div className="fr-col-12 fr-col-md-6">
                {dossier.metadata && (
                  <>
                    <p>
                      <strong>Aides :</strong>
                      <br />
                      {dossier.metadata.aides.join(", ")}
                    </p>
                    <p>
                      <strong>Gestes :</strong>
                      <br />
                      {dossier.metadata.gestes
                        .flatMap((group) => group.values)
                        .join(", ")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="fr-grid-row fr-grid-row--gutters fr-mb-6w">
        <div className="fr-col-12 fr-col-md-3">
          <div className="fr-card fr-card--sm">
            <div className="fr-card__body">
              <div className="fr-card__content text-center">
                <h4 className="fr-card__title">Total devis</h4>
                <p className="fr-display--sm">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-3">
          <div className="fr-card fr-card--sm">
            <div className="fr-card__body">
              <div className="fr-card__content text-center">
                <h4 className="fr-card__title">À corriger</h4>
                <p className="fr-display--sm fr-text--error">{stats.invalid}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-3">
          <div className="fr-card fr-card--sm">
            <div className="fr-card__body">
              <div className="fr-card__content text-center">
                <h4 className="fr-card__title">Conformes</h4>
                <p className="fr-display--sm fr-text--success">{stats.valid}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-col-12 fr-col-md-3">
          <div className="fr-card fr-card--sm">
            <div className="fr-card__body">
              <div className="fr-card__content text-center">
                <h4 className="fr-card__title">Total erreurs</h4>
                <p className="fr-display--sm fr-text--error">{totalErrors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Devis avec erreurs - priorité */}
      {invalidQuotes.length > 0 && (
        <div className="fr-mb-6w">
          <h3>🔴 Devis à corriger en priorité</h3>
          <div className="fr-mt-4v">
            {invalidQuotes.map((devis) => (
              <div key={devis.id} className="fr-card fr-mb-3v">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <div className="fr-grid-row fr-grid-row--gutters">
                      <div className="fr-col-12 fr-col-md-8">
                        <h4 className="fr-card__title">❌ {devis.filename}</h4>
                        <p className="fr-card__desc">
                          <strong>Statut :</strong>{" "}
                          <span className="fr-badge fr-badge--error">
                            Non conforme
                          </span>
                        </p>

                        <p>
                          <strong>Erreurs détectées :</strong>{" "}
                          {devis.error_details?.length || 0}
                        </p>

                        {devis.error_details &&
                          devis.error_details.length > 0 && (
                            <div className="fr-mt-2v">
                              <p className="fr-text--sm fr-text--bold">
                                Principales erreurs :
                              </p>
                              <ul className="fr-text--sm">
                                {devis.error_details
                                  .slice(0, 3)
                                  .map((error) => (
                                    <li
                                      key={error.id}
                                      className="fr-text--error"
                                    >
                                      {error.title}
                                    </li>
                                  ))}
                                {devis.error_details.length > 3 && (
                                  <li className="fr-text--mention">
                                    ... et {devis.error_details.length - 3}{" "}
                                    autre(s) erreur(s)
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                        {devis.gestes && devis.gestes.length > 0 && (
                          <p className="fr-text--sm">
                            <strong>Gestes :</strong> {devis.gestes.length}
                          </p>
                        )}
                      </div>

                      <div className="fr-col-12 fr-col-md-4">
                        <div className="fr-btns-group fr-btns-group--right">
                          <button
                            className="fr-btn fr-btn--sm"
                            onClick={() => onNavigateToQuote(devis.id)}
                          >
                            Corriger les erreurs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Devis conformes */}
      {validQuotes.length > 0 && (
        <div className="fr-mb-6w">
          <h3>✅ Devis déjà conformes</h3>
          <div className="fr-mt-4v">
            {validQuotes.map((devis) => (
              <div key={devis.id} className="fr-card fr-mb-3v">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <div className="fr-grid-row fr-grid-row--gutters">
                      <div className="fr-col-12 fr-col-md-8">
                        <h4 className="fr-card__title">✅ {devis.filename}</h4>
                        <p className="fr-card__desc">
                          <strong>Statut :</strong>{" "}
                          <span className="fr-badge fr-badge--success">
                            Conforme
                          </span>
                        </p>

                        {devis.gestes && devis.gestes.length > 0 && (
                          <p>
                            <strong>Gestes :</strong> {devis.gestes.length}{" "}
                            validé(s)
                          </p>
                        )}

                        {devis.controls_count && (
                          <p>
                            <strong>Points de contrôle :</strong>{" "}
                            {devis.controls_count} vérifiés
                          </p>
                        )}
                      </div>

                      <div className="fr-col-12 fr-col-md-4">
                        <div className="fr-btns-group fr-btns-group--right">
                          <a
                            href={`/${profile}/devis/${devis.id}`}
                            className="fr-btn fr-btn--sm fr-btn--secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Voir le détail
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions de correction */}
      <div className="fr-card fr-card--no-border">
        <div className="fr-card__body">
          <div className="fr-card__content">
            <h3 className="fr-card__title">Actions recommandées</h3>
            <p className="fr-card__desc">
              Pour que votre dossier soit conforme :
            </p>
            <ol>
              <li>
                <strong>Corrigez les erreurs</strong> dans les {stats.invalid}{" "}
                devis non conformes en cliquant sur "Corriger les erreurs"
              </li>
              <li>
                <strong>Demandez de nouveaux devis</strong> aux artisans si
                nécessaire
              </li>
              <li>
                <strong>Re-téléversez</strong> les devis corrigés
              </li>
            </ol>

            <div className="fr-btns-group fr-mt-4w">
              <a
                href={`/${profile}/televersement/renovation-ampleur`}
                className="fr-btn"
              >
                Ajouter des devis corrigés
              </a>
              <button
                className="fr-btn fr-btn--secondary"
                onClick={() => window.print()}
              >
                Imprimer le rapport
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
