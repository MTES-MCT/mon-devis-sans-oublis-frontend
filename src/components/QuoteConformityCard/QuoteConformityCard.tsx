import ProgressGauge from "./ProgressGauge";
import { QUOTE_CONFORMITY_CARD } from "./QuoteConformityCard.wording";

interface QuoteConformityCardProps {
  correctionsCount: number;
  controlsCount: number;
  className?: string;
}

export default function QuoteConformityCard({
  correctionsCount,
  controlsCount,
  className = "",
}: QuoteConformityCardProps) {
  const percentage =
    controlsCount > 0 ? (correctionsCount / controlsCount) * 100 : 0;

  const conformePointsCount = controlsCount - correctionsCount;

  const formatText = (template: string, count: number) => {
    return template
      .replace("{count}", count.toString())
      .replace(/\{plural\}/g, count !== 1 ? "s" : "");
  };

  return (
    <div
      className={`border border-[var(--border-plain-info)] p-4 fr-mb-4w ${className}`}
    >
      <h6 className="text-black mb-4">{QUOTE_CONFORMITY_CARD.title}</h6>

      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="flex flex-col gap-2 flex-1">
          {/* Badge corrections */}
          <p className="fr-badge fr-badge--warning mb-2">
            {formatText(QUOTE_CONFORMITY_CARD.corrections, correctionsCount)}
          </p>

          {/* Badge points conformes */}
          <p className="fr-badge fr-badge--success">
            {formatText(
              QUOTE_CONFORMITY_CARD.conformPoints,
              conformePointsCount
            )}
          </p>
        </div>

        {/* Zone droite - Jauge */}
        <div className="flex-shrink-0">
          <ProgressGauge percentage={percentage} />
        </div>
      </div>
    </div>
  );
}
