"use client";

import { useState, useEffect } from "react";

// scroll 90%
export const useScrollPosition = (threshold = 0.9) => {
  const [isButtonSticky, setIsButtonSticky] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsButtonSticky(true);
      return;
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.innerHeight + window.scrollY;
      const stickyThreshold = scrollHeight * threshold;

      setIsButtonSticky(scrollPosition < stickyThreshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  // Return true by default for SSR
  if (typeof window === "undefined") {
    return true;
  }

  return isButtonSticky;
};
