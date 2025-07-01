"use client";

import { useState } from "react";
import wording from "@/wording";

export interface NoticeProps {
  buttonClose?: boolean;
  className: string;
  description: string;
  title?: string;
  noticeKey?: string;
}

export default function Notice({
  buttonClose = false,
  className,
  description,
  title,
  noticeKey,
}: NoticeProps) {
  const [isCloseButtonVisible, setIsCloseButtonVisible] =
    useState<boolean>(true);

  if (!isCloseButtonVisible) return null;

  const isWarning = className.includes("fr-notice--warning");

  return (
    <div className={`fr-notice ${className}`} key={noticeKey}>
      <div className="fr-container">
        <div className="fr-notice__body">
          <span>
            <span
              className={`fr-notice__title ${
                isWarning ? "fr-icon-edit-box-fill" : ""
              }`}
              data-testid="warning-icon"
            >
              {title}
            </span>
            <span className="ml-0 md:ml-2 text-sm md:text-base">
              {description}
            </span>
          </span>
          {buttonClose && (
            <button
              className="fr-btn--close fr-btn"
              onClick={() => setIsCloseButtonVisible(false)}
              title={wording.components.notice.button_close}
              type="button"
            >
              {wording.components.notice.button_close}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
