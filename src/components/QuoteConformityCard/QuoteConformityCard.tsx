import ProgressGauge from "./ProgressGauge";
import { QUOTE_CONFORMITY_CARD } from "./QuoteConformityCard.wording";

interface QuoteConformityCardProps {
  title?: string;
  correctionsCount: number;
  controlsCount: number;
  className?: string;
  mode?: "compact" | "normal";
}

export default function QuoteConformityCard({
  title,
  correctionsCount,
  controlsCount,
  className = "",
  mode = "normal",
}: QuoteConformityCardProps) {
  const percentage =
    controlsCount > 0
      ? ((controlsCount - correctionsCount) / controlsCount) * 100
      : 0;

  const conformePointsCount = controlsCount - correctionsCount;

  const formatText = (template: string, count: number) => {
    return template
      .replace("{count}", count.toString())
      .replace(/\{plural\}/g, count !== 1 ? "s" : "");
  };

  const isCompact = mode === "compact";

  return (
    <>
      <div
        className={`border border-[var(--border-plain-info)] p-4 overflow-visible ${className}`}
      >
        <h6 className="text-black mb-4">
          {title ?? QUOTE_CONFORMITY_CARD.title}
        </h6>

        <div
          className={
            isCompact
              ? "flex flex-col gap-4"
              : "flex flex-col sm:flex-row gap-6 items-end"
          }
        >
          <div className="flex flex-col gap-2">
            <p className="fr-badge fr-badge--warning mb-2">
              {formatText(QUOTE_CONFORMITY_CARD.corrections, correctionsCount)}
            </p>

            <p className="fr-badge fr-badge--success">
              {formatText(
                QUOTE_CONFORMITY_CARD.conformPoints,
                conformePointsCount
              )}
            </p>
          </div>

          <div className="relative z-10" style={{ minWidth: "128px" }}>
            <ProgressGauge percentage={percentage} />
          </div>
        </div>
      </div>
    </>
  );
}
