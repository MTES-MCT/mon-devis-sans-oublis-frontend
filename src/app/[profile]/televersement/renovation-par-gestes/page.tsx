import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { UploadClient } from "@/page-sections";
import wording from "@/wording";

export default async function UploadRenovationParGestesPage({
  params: initialParams,
}: {
  params: Promise<{ profile: string }>;
}) {
  const params = await initialParams;

  return (
    <>
      <div className="fr-container-fluid">
        <div className="fr-container">
          <Breadcrumb
            items={[
              {
                label: "Accueil",
                href: "/",
              },
              {
                label: "Analyse des devis",
                href: undefined,
              },
              {
                label: `Etape 3/4`,
              },
            ]}
          />
        </div>
      </div>
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
              <h1>{wording.upload.title}</h1>
              <UploadClient profile={params.profile} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
