"use client";

import { useParams } from "next/navigation";
import { Profile } from "@/types";

export const useUserProfile = (): Profile | null => {
  const params = useParams();

  // Récupérer le profil depuis l'URL
  const profile = params?.profile as string | undefined;

  // Si pas de profil dans l'URL, retourner null
  if (!profile) {
    return null;
  }

  // Validation et conversion vers le type Profile
  if (
    profile === Profile.ARTISAN ||
    profile === Profile.CONSEILLER ||
    profile === Profile.PARTICULIER
  ) {
    return profile as Profile;
  }

  return null;
};

// Fonction utilitaire pour vérifier si on est conseiller
export const useIsConseiller = (): boolean => {
  const profile = useUserProfile();
  return profile === Profile.CONSEILLER;
};
