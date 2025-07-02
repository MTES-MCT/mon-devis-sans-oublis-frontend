"use client";

import { usePathname } from "next/navigation";

import { Profile } from "@/types";

export const useConseillerRoutes = () => {
  const pathname = usePathname();

  return !pathname
    ? { isConseillerAndEdit: false }
    : { isConseillerAndEdit: pathname.includes(Profile.CONSEILLER) };
};
