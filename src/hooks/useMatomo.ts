import { push } from "@socialgouv/matomo-next";
import { isProduction, isStaging } from "@/lib/config/env.config";
import { type MatomoEvent } from "@/lib/constants/matomoEvents";

interface UseMatomo {
  trackEvent: (eventName: MatomoEvent, additionalData?: string) => void;
  trackPageView: (customUrl?: string) => void;
  isEnabled: boolean;
}

export function useMatomo(): UseMatomo {
  const isEnabled = isProduction() || isStaging();

  const trackEvent = (eventName: MatomoEvent, additionalData?: string) => {
    if (!isEnabled) {
      console.log(
        `[Matomo Debug] Event: ${eventName}${additionalData ? ` - ${additionalData}` : ""}`
      );
      return;
    }

    try {
      push(["trackEvent", "User Action", eventName, additionalData]);
    } catch (error) {
      console.warn("Erreur Matomo tracking:", error);
    }
  };

  const trackPageView = (customUrl?: string) => {
    if (!isEnabled) {
      console.log(`[Matomo Debug] Page view: ${customUrl || "current page"}`);
      return;
    }

    try {
      if (customUrl) {
        push(["setCustomUrl", customUrl]);
      }
      push(["trackPageView"]);
    } catch (error) {
      console.warn("Erreur Matomo page view:", error);
    }
  };

  return {
    trackEvent,
    trackPageView,
    isEnabled,
  };
}
