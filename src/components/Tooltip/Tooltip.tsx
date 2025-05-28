"use client";

import { useState } from "react";

export interface TooltipProps {
  className?: string;
  icon: string;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ className, icon, text }) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <div className="relative inline-block">
      <span
        aria-hidden="true"
        className="cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div
          className={`cursor-pointer ${icon}`}
          data-testid="tooltip-trigger"
          role="button"
        />
      </span>
      {showTooltip && (
        <div
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <p
            className={`relative font-normal! fr-text--xs bg-[var(--background-default-grey)] shadow-lg w-[383px] p-2 ${className}`}
          >
            {text}
            <span className="absolute left-1/2 bottom-full -translate-x-1/2 border-8 border-transparent border-b-[var(--background-default-grey)]" />
          </p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
