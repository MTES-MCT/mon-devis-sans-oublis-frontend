import { CheckRGEGesteTypes } from "@/types";
import { AdemeResult } from "@/types/dataChecks.types";

/**
 * Mapping entre les valeurs des gestes et les domaines API RGE
 */
export const GESTE_TO_API_DOMAIN_MAPPING: Record<string, string[]> = {
  // Chauffage
  chaudiere_biomasse: ["Chaudière bois"],
  systeme_solaire_combine: ["Chauffage et/ou eau chaude solaire"],
  poele_insert: ["Poêle ou insert bois"],
  pac_air_air: ["Pompe à chaleur : chauffage"],
  pac_air_eau: ["Pompe à chaleur : chauffage"],
  pac_hybride: ["Pompe à chaleur : chauffage"],
  pac_eau_eau: ["Pompe à chaleur : chauffage"],

  // Eau chaude sanitaire
  chauffe_eau_solaire_individuel: ["Chauffage et/ou eau chaude solaire"],
  chauffe_eau_thermo: ["Chauffe-Eau Thermodynamique"],

  // Isolation
  isolation_thermique_par_exterieur_ITE: ["Isolation des murs par l'extérieur"],
  isolation_thermique_par_interieur_ITI: [
    "Isolation par l'intérieur des murs ou rampants de toitures  ou plafonds",
  ],
  isolation_comble_perdu: ["Isolation des combles perdus"],
  isolation_rampants_toiture: [
    "Isolation par l'intérieur des murs ou rampants de toitures  ou plafonds",
  ],
  isolation_toiture_terrasse: [
    "Isolation des toitures terrasses ou des toitures par l'extérieur",
  ],
  isolation_plancher_bas: ["Isolation des planchers bas"],

  // Menuiserie
  menuiserie_fenetre: ["Fenêtres, volets, portes donnant sur l'extérieur"],
  menuiserie_volet_isolant: [
    "Fenêtres, volets, portes donnant sur l'extérieur",
  ],
  menuiserie_fenetre_toit: ["Fenêtres, volets, portes donnant sur l'extérieur"],
  menuiserie_porte: ["Fenêtres, volets, portes donnant sur l'extérieur"],

  // Ventilation
  vmc_double_flux: ["Ventilation mécanique"],
  vmc_simple_flux: ["Ventilation mécanique"],
};

/**
 * Messages d'erreur pour les codes d'erreur RGE
 */
export const RGE_ERROR_MESSAGES: Record<
  string,
  { title: string; message: string }
> = {
  siret_not_found: {
    title: "SIRET non trouvé",
    message:
      "Aucune entreprise RGE n'a été trouvée avec ce numéro SIRET. Vérifiez que le SIRET est correct.",
  },
  rge_manquant: {
    title: "Aucune qualification RGE trouvée",
    message:
      "Cette entreprise n'a pas de qualification RGE active pour les gestes sélectionnés. Vérifiez que l'entreprise est bien certifiée RGE pour ces types de travaux ou contactez-la directement.",
  },
  rge_hors_date: {
    title: "Qualification RGE expirée",
    message:
      "Cette entreprise avait une qualification RGE mais celle-ci n'est plus valide à la date demandée. Vérifiez la date de vérification ou contactez l'entreprise pour connaître le statut actuel de sa certification.",
  },
  invalid_parameters: {
    title: "Paramètres invalides",
    message:
      "Les paramètres fournis ne sont pas valides. Vérifiez le format du SIRET, du numéro RGE ou de la date.",
  },
  endpoint_not_found: {
    title: "Service temporairement indisponible",
    message:
      "Le service de vérification RGE est temporairement indisponible. Veuillez réessayer plus tard.",
  },
};

/**
 * Trouve le groupe d'un geste dans les métadonnées
 */
export const getGesteGroup = (
  gesteValue: string,
  metadata: CheckRGEGesteTypes
): string => {
  const option = metadata.options.find((opt) => opt.value === gesteValue);
  return option?.group || "Inconnu";
};

/**
 * Vérifie si un geste est qualifié selon les résultats RGE
 */
export const isGesteQualified = (
  gesteValue: string,
  rgeResults: AdemeResult[]
): boolean => {
  const apiDomains = GESTE_TO_API_DOMAIN_MAPPING[gesteValue];

  if (!apiDomains) {
    console.warn(`Geste non mappé dans le système RGE: ${gesteValue}`);
    return false;
  }

  return rgeResults.some((result) =>
    apiDomains.some((domain) => result.domaine?.includes(domain))
  );
};

/**
 * Regroupe les gestes sélectionnés par groupe de métadonnées
 */
export const groupGestesByCategory = (
  gestesValues: string[],
  gesteTypesMetadata: CheckRGEGesteTypes
): Record<string, string[]> => {
  return gestesValues.reduce(
    (acc, gesteValue) => {
      const group = getGesteGroup(gesteValue, gesteTypesMetadata);
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(gesteValue);
      return acc;
    },
    {} as Record<string, string[]>
  );
};

/**
 * Obtient le label lisible d'un geste à partir de sa valeur
 */
export const getGesteLabel = (
  gesteValue: string,
  metadata: CheckRGEGesteTypes
): string => {
  const option = metadata.options.find((opt) => opt.value === gesteValue);
  return option?.label || gesteValue;
};

/**
 * Obtient le message d'erreur formaté pour un code d'erreur
 */
export const getRgeErrorMessage = (code: string) => {
  return (
    RGE_ERROR_MESSAGES[code] || {
      title: "Erreur de vérification",
      message: "Une erreur inattendue s'est produite lors de la vérification.",
    }
  );
};

/**
 * Formate un SIRET pour l'affichage
 * @param value
 * @returns
 */
export const formatSiretDisplay = (value: string): string => {
  // Supprimer tous les caractères non numériques
  const cleanValue = value.replace(/\D/g, "");

  // Limiter à 14 chiffres
  const truncated = cleanValue.slice(0, 14);

  // Appliquer le format : XXX XXX XXX XXXXX
  if (truncated.length <= 3) {
    return truncated;
  } else if (truncated.length <= 6) {
    return `${truncated.slice(0, 3)} ${truncated.slice(3)}`;
  } else if (truncated.length <= 9) {
    return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
  } else {
    return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6, 9)} ${truncated.slice(9)}`;
  }
};
