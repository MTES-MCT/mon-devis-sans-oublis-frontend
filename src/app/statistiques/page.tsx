export const dynamic = "force-dynamic";

import { Notice } from "@/components";
import wording from "@/wording";

export default async function Statistics() {
  const metabasePublicUrl =
    "https://stats.mon-devis-sans-oublis.beta.gouv.fr/public/dashboard/09cc4737-0787-4f38-ad64-bee424965869";

  return (
    <>
      <Notice
        className="fr-notice--info"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <h1 className="fr-mb-6w text-(--text-title-grey)!">
            {wording.statistics.title}
          </h1>

          {/* Message d'information */}
          <div className="fr-alert fr-alert--info fr-mt-4w fr-mb-4w">
            <h3 className="fr-alert__title">
              Tableau de bord analytique public
            </h3>
            <p className="fr-alert__description">
              Dans un esprit de transparence du service public, ce tableau de
              bord présente les statistiques d'usage et de qualité de la
              plateforme Mon devis sans oublis. Les données sont anonymisées et
              mises à jour quotidiennement.
            </p>
          </div>

          {/* Dashboard Metabase public */}
          <div className="fr-mb-8w">
            <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <iframe
                src={metabasePublicUrl}
                className="w-full h-[800px] border-0"
                title="Dashboard Mon devis sans oublis - Analytics"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
