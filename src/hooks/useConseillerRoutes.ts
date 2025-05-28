"use client";

import { usePathname } from "next/navigation";

import { Profile } from "@/types";

export const useConseillerRoutes = () => {
  const pathname = usePathname();

  const defaultResult = {
    isConseillerAndEdit: false,
    isConseillerAndNotEdit: false,
  };

  if (!pathname) {
    return defaultResult;
  }

  return {
    isConseillerAndEdit:
      pathname.includes(Profile.CONSEILLER) && pathname.includes("/modifier"),
    isConseillerAndNotEdit:
      pathname.includes(Profile.CONSEILLER) && !pathname.includes("/modifier"),
  };
};
