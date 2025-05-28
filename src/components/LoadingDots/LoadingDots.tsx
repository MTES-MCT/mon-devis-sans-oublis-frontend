"use client";

import { useEffect, useState } from "react";

export interface LoadingDotsProps {
  title: string;
}

export default function LoadingDots({ title }: LoadingDotsProps) {
  const [dots, setDots] = useState<string>("");

  useEffect(() => {
    let dotsInterval: NodeJS.Timeout | null = null;

    const animateDots = () => {
      dotsInterval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : "")); // Add a dot or reset
      }, 500); // Change the dots every 500ms
    };

    animateDots();

    // Cleanup the interval
    return () => {
      if (dotsInterval) clearInterval(dotsInterval);
    };
  }, []);

  return (
    <h1 className="mb-4">
      <span>{title}</span>
      <span className="inline-block w-12 text-left">{dots}</span>
    </h1>
  );
}
