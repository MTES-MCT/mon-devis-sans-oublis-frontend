import { Notice } from "@/components";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { quoteService } from "@/lib/client/apiWrapper";
import { UploadClient } from "@/page-sections";
import { Metadata } from "@/types";
import wording from "@/wording";

export default async function Upload({
  params: initialParams,
}: {
  params: Promise<{ profile: string }>;
}) {
  const params = await initialParams;

  let metadata: Metadata = { aides: [], gestes: [] };
  try {
    metadata = await quoteService.getQuoteMetadata();
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

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
                href: "#",
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
              <UploadClient metadata={metadata} profile={params.profile} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
