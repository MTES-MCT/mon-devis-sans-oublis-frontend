"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { init, push } from "@socialgouv/matomo-next";

const MatomoContent = () => {
  const [initialised, setInitialised] = useState<boolean>(false);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MATOMO_URL &&
      process.env.NEXT_PUBLIC_MATOMO_SITE_ID &&
      !initialised
    ) {
      init({
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
        url: process.env.NEXT_PUBLIC_MATOMO_URL,
      });

      setInitialised(true);
    }
  }, [initialised]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    if (!pathname) return;

    const url = decodeURIComponent(
      pathname + (searchParamsString ? "?" + searchParamsString : "")
    );

    push(["setCustomUrl", url]);
    push(["trackPageView"]);
  }, [pathname, searchParamsString]);

  // Matomo activé sur staging et production uniquement
  const allowedEnvs = ["staging", "production"];
  if (!allowedEnvs.includes(process.env.NODE_ENV || "")) {
    return null;
  }

  return null;
};

// MatomoContent is wrapped in Suspense because useSearchParams() may suspend while
// the route segment is loading on the server. This prevents client-side rendering bailout.
export default function Matomo() {
  return (
    <Suspense fallback={null}>
      <MatomoContent />
    </Suspense>
  );
}
