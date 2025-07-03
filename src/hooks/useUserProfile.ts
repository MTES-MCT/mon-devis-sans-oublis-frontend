"use client";

import { useParams } from "next/navigation";
import { Profile } from "@/types";

export const useUserProfile = (): Profile | null => {
  const params = useParams();

  // Récupérer le profil depuis l'URL
  const profile = params?.profile as string;

  // Validation et conversion vers le type Profile
  if (
    profile === Profile.ARTISAN ||
    profile === Profile.CONSEILLER ||
    profile === Profile.PARTICULIER
  ) {
    return profile as Profile;
  }

  // Retourner null si le profil n'est pas valide
  return null;
};

export const useIsConseiller = (): boolean => {
  const profile = useUserProfile();
  return profile === Profile.CONSEILLER;
};
