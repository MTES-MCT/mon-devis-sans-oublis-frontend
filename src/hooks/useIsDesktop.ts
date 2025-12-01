"use client";

import { useState, useEffect } from "react";

export const useIsDesktop = (breakpoint = 768) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsDesktop(false);
      return;
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  // Return false by default for SSR
  if (typeof window === "undefined") {
    return false;
  }

  return isDesktop;
};
