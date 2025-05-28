"use client";

import { useState } from "react";

import wording from "@/wording";

export enum AlertType {
  INFO = "info",
  SUCCESS = "success",
}

export interface AlertProps {
  className?: string;
  description: string;
  moreDescription?: string;
  type: AlertType;
}

const Alert: React.FC<AlertProps> = ({
  className,
  description,
  moreDescription,
  type,
}) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleToggle = () => {
    setShowMore(!showMore);
  };

  return (
    <div
      className={`fr-alert ${
        type === AlertType.INFO ? "fr-alert--info" : "fr-alert--success"
      } ${className}`}
    >
      <p>
        {`${description} `}
        {moreDescription && (
          <>
            {showMore && <span>{`${moreDescription} `}</span>}
            <span
              className="text-[var(--text-default-grey)] cursor-pointer underline"
              onClick={handleToggle}
            >
              {showMore
                ? wording.components.alert.see_less
                : wording.components.alert.see_more}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default Alert;
