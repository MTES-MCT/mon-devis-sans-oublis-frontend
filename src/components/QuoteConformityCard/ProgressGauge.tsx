interface ProgressGaugeProps {
  percentage: number;
  className?: string;
}
export default function ProgressGauge({
  percentage,
  className = "",
}: ProgressGaugeProps) {
  // S'assurer que le pourcentage est entre 0 et 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className={`relative ${className}`}>
      <div className="w-32 h-12 bg-gray-200 rounded-lg overflow-hidden border border-transparent">
        {/* Barre de progression verte */}
        <div
          className="h-full bg-(--background-contrast-success)! transition-all duration-300 ease-in-out"
          style={{ width: `${clampedPercentage}%` }}
        />

        {/* Texte du pourcentage centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-baseline">
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
