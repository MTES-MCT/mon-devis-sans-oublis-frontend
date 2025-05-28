"use client";

import { usePathname } from "next/navigation";

export const useGoBackToUpload = (): string => {
  const pathname = usePathname();
  return pathname?.split("/").slice(0, 3).join("/") ?? "";
};
