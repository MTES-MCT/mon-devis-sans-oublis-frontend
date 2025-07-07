interface ProgressGaugeProps {
  percentage: number;
  className?: string;
}

export default function ProgressGauge({
  percentage,
  className = "",
}: ProgressGaugeProps) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div
      className={`relative ${className}`}
      style={{ width: "128px", height: "48px" }}
    >
      {/* Barre de progression verte */}
      <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden border border-transparent">
        <div
          className="h-full bg-(--background-contrast-success)! transition-all duration-300 ease-in-out"
          style={{ width: `${clampedPercentage}%` }}
        />

        {/* Texte du pourcentage centré */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ overflow: "visible" }}
        >
          <div className="flex items-baseline" style={{ whiteSpace: "nowrap" }}>
            <span className="text-[40px] font-bold text-green-800 leading-none">
              {Math.round(clampedPercentage)}
            </span>
            <span className="text-lg text-green-800 leading-none">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
