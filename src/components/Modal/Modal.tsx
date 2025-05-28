"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

import { useIsDesktop } from "@/hooks";

export enum ModalPosition {
  CENTER = "center",
  RIGHT = "right",
}

export interface ModalProps {
  backButtonLabel: string;
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
  position: ModalPosition;
}

const Modal: React.FC<ModalProps> = ({
  backButtonLabel,
  children,
  className,
  isOpen,
  onClose,
  position,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [visibleClass, setVisibleClass] = useState<boolean>(false);

  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (typeof window === "undefined") return;

    setMounted(true);
    const element = document.createElement("div");
    element.setAttribute("id", "modal-root");
    document.body.appendChild(element);
    setPortalElement(element);

    return () => {
      if (element && document.body.contains(element)) {
        document.body.removeChild(element);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => {
        setVisibleClass(true);
      }, 10);
      document.body.style.overflow = "hidden";
    } else {
      setVisibleClass(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;

    const closeButton = modalRef.current?.querySelector(
      '[data-testid="modal-close-button"]'
    ) as HTMLElement;
    if (closeButton) {
      closeButton.focus();
    }

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements?.[0] as HTMLElement;
    const lastFocusableElement = focusableElements?.[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      /* istanbul ignore if */
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        /* istanbul ignore if */
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;

    const rootElements = document.querySelectorAll("body > *:not(#modal-root)");

    const originalValues = new Map();
    rootElements.forEach((element) => {
      originalValues.set(element, element.getAttribute("aria-hidden"));
      element.setAttribute("aria-hidden", "true");
    });

    return () => {
      rootElements.forEach((element) => {
        const originalValue = originalValues.get(element);

        if (originalValue === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", originalValue);
        }
      });
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen || !portalElement) return;

    const siblingElements = Array.from(document.body.children).filter(
      (child) => child !== portalElement
    );

    siblingElements.forEach((element) => {
      element.setAttribute("inert", "");
    });

    return () => {
      siblingElements.forEach((element) => {
        element.removeAttribute("inert");
      });
    };
  }, [isOpen, portalElement]);

  const modalContent = shouldRender && (
    <div
      className={`fixed inset-0 bg-black/50 ${
        position === ModalPosition.CENTER
          ? "flex items-center justify-center"
          : "flex items-center justify-end"
      } ${className}`}
      data-testid="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div
        aria-modal="true"
        data-testid="modal-content"
        className={`flex flex-col px-6 md:px-8 py-4 bg-[var(--background-default-grey)] transform transition-transform duration-300 ease-in-out ${
          position === ModalPosition.CENTER
            ? "w-[792px] h-fit"
            : `${isDesktop ? "w-[480px]" : "w-full"}`
        } 
            ${
              position === ModalPosition.CENTER
                ? `rounded-lg ${
                    visibleClass
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }`
                : `h-full ${
                    visibleClass ? "translate-x-0" : "translate-x-full"
                  }`
            }`}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <div
          className={
            position === ModalPosition.CENTER
              ? "flex justify-end fr-mb-4w"
              : "flex justify-start"
          }
        >
          <button
            className={`fr-link ${
              position === ModalPosition.RIGHT
                ? "fr-link--lg fr-icon-arrow-left-line fr-link--icon-left mt-6! text-[var(--border-plain-grey)]"
                : "fr-link--sm fr-link--icon-right fr-icon-close-line mt-2!"
            }`}
            data-testid="modal-close-button"
            onClick={onClose}
          >
            <span
              className={`${
                position === ModalPosition.RIGHT
                  ? "text-[20px] ml-2.5! font-bold text-[var(--text-disabled-grey)]"
                  : "font-[500]"
              }`}
            >
              {backButtonLabel}
            </span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  if (!mounted || !portalElement) return null;

  return createPortal(modalContent, portalElement);
};

export default Modal;
