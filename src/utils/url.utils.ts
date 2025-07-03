/**
 * Construit une URL en tenant compte de la présence optionnelle d'un profil
 * @param path - Le chemin de base (ex: "/televersement/renovation-par-gestes")
 * @param profile - Le profil utilisateur (optionnel)
 * @returns L'URL complète avec ou sans profil
 */
export const getRedirectUrl = (
  path: string,
  profile?: string | null
): string => {
  if (profile) {
    return `/${profile}${path}`;
  }
  return path;
};

/**
 * Construit une URL de redirection avec paramètres de query
 * @param basePath - Le chemin de base
 * @param profile - Le profil utilisateur (optionnel)
 * @param queryParams - Objet contenant les paramètres de query
 * @returns L'URL complète avec paramètres
 */
export const getRedirectUrlWithParams = (
  basePath: string,
  profile?: string | null,
  queryParams?: Record<string, string>
): string => {
  const baseUrl = getRedirectUrl(basePath, profile);

  if (!queryParams || Object.keys(queryParams).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams(queryParams);
  return `${baseUrl}?${searchParams.toString()}`;
};
