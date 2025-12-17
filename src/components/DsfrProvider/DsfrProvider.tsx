"use client";

import { useEffect } from "react";

export default function DsfrProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initDsfr = async () => {
      if (typeof window === "undefined") return;

      try {
        window.dsfr = {
          verbose: false,
          mode: "react",
        } as typeof window.dsfr;

        // @ts-expect-error - Le module DSFR n'a pas de déclarations TypeScript
        await import("@gouvfr/dsfr/dist/dsfr.module.min.js");

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (window.dsfr?.start) {
          window.dsfr.start();
        }
      } catch (error) {
        console.error("[DSFR] Échec de l'initialisation :", error);
      }
    };

    initDsfr();
  }, []);

  return <>{children}</>;
}
