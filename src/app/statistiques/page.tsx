export const dynamic = "force-dynamic";

import { Notice } from "@/components";
import { statService } from "@/lib/client/apiWrapper";
import wording from "@/wording";

export default async function Statistics() {
  let statistics = null;
  try {
    statistics = await statService.getStats();
  } catch (error) {
    console.error("Error fetching statistics:", error);
  }

  if (!statistics) {
    return (
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container">
          <h1 className="fr-mb-6w text-(--text-title-grey)!">
            {wording.statistics.title}
          </h1>
          <p>Une erreur est survenue lors du chargement des statistiques.</p>
        </div>
      </section>
    );
  }

  const usageStats = [
    {
      value: statistics.unique_visitors_count,
      label: wording.statistics.visitors_label,
    },
    {
      value: statistics.quote_checks_count,
      label: wording.statistics.quotes_label,
    },
    {
      value: statistics.average_quote_check_errors_count,
      label: wording.statistics.errors_label,
      tag: wording.statistics.errors_tag,
    },
  ];

  const processingStats = [
    {
      value: `${statistics.median_quote_check_processing_time} secondes`,
      label: wording.statistics.processing_time_label,
      tag: wording.statistics.processing_time_tag,
    },
    {
      value: `${statistics.average_quote_check_cost} €`,
      label: wording.statistics.cost_label,
      tag: wording.statistics.cost_tag,
    },
  ];

  const StatCard = ({
    value,
    label,
    tag,
  }: {
    value: string;
    label: string;
    tag?: string;
  }) => (
    <div className="border-top-grey border-left-grey border-right-grey border-bottom-grey-large p-8 w-full h-full flex flex-col items-center">
      <h3 className="text-center">{value}</h3>
      <p className="text-center">{label}</p>
      {tag && <p className="text-xs uppercase text-[#666666]">{tag}</p>}
    </div>
  );

  return (
    <>
      <Notice
        className="fr-notice--info"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />
      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container [&_h2]:text-[var(--text-title-grey)] [&_h2]:mt-10">
          <h1 className="fr-mb-6w text-(--text-title-grey)!">
            {wording.statistics.title}
          </h1>
          <h2 className="fr-mb-3w text-(--text-title-grey)!">
            {wording.statistics.title_usage}
          </h2>
          <div className="fr-grid-row fr-grid-row--gutters">
            {usageStats.map((stat, index) => (
              <div key={index} className="fr-col-12 fr-col-md-4">
                <StatCard {...stat} />
              </div>
            ))}
          </div>
          <h2 className="fr-mb-3w fr-mt-8w text-(--text-title-grey)!">
            {wording.statistics.title_processing}
          </h2>
          <div className="fr-grid-row fr-grid-row--gutters">
            {processingStats.map((stat, index) => (
              <div key={index} className="fr-col-12 fr-col-md-4">
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
