// src/lib/utils/rge.utils.ts

import { Metadata } from "@/types";
import { AdemeResult } from "@/types/dataChecks.types";

/**
 * Mapping direct entre les gestes utilisateur et les domaines API RGE
 * Permet de vérifier si une entreprise a une qualification pour un geste donné
 */
export const GESTE_TO_API_DOMAIN_MAPPING: Record<string, string[]> = {
  // Chauffage
  "Chaudière biomasse": ["Chaudière bois"],
  "Chauffage solaire combiné": ["Chauffage et/ou eau chaude solaire"],
  "Poêle/insert à bois/granulés": ["Poêle ou insert bois"],
  "Pompe à chaleur air / air": ["Pompe à chaleur : chauffage"],
  "Pompe à chaleur air / eau": ["Pompe à chaleur : chauffage"],
  "Pompe à chaleur géothermique": ["Pompe à chaleur : chauffage"],

  // Eau chaude sanitaire
  "Chauffe-eau solaire individuel": ["Chauffage et/ou eau chaude solaire"],
  "Chauffe-eau thermodynamique (CET)": ["Chauffe-Eau Thermodynamique"],

  // Isolation
  "Isolation des murs par l'extérieur (ITE)": [
    "Isolation des murs par l'extérieur",
  ],
  "Isolation des murs par l'intérieur (ITI)": [
    "Isolation par l'intérieur des murs ou rampants de toitures  ou plafonds",
  ],
  "Isolation des planchers de combles perdus": ["Isolation des combles perdus"],
  "Isolation de la toiture en pente - plafond de combles": [
    "Isolation par l'intérieur des murs ou rampants de toitures  ou plafonds",
  ],
  "Isolation de la toiture-terrasse": [
    "Isolation des toitures terrasses ou des toitures par l'extérieur",
  ],
  "Isolation des planchers bas": ["Isolation des planchers bas"],

  // Menuiserie
  "Remplacement des fenêtres ou porte-fenêtres": [
    "Fenêtres, volets, portes donnant sur l'extérieur",
  ],
  "Volet isolant": ["Fenêtres, volets, portes donnant sur l'extérieur"],

  // Ventilation
  "Ventilation Mécanique Double-Flux": ["Ventilation mécanique"],
  "Ventilation Mécanique Simple-Flux": ["Ventilation mécanique"],
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
    title: "Qualification RGE manquante",
    message:
      "Cette entreprise n'a pas de qualification RGE active pour les critères demandés.",
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
export const getGesteGroup = (geste: string, metadata: Metadata): string => {
  for (const group of metadata.gestes) {
    if (group.values.includes(geste)) {
      return group.group;
    }
  }
  return "Inconnu";
};

/**
 * Vérifie si un geste est qualifié selon les résultats RGE
 */
export const isGesteQualified = (
  geste: string,
  rgeResults: AdemeResult[]
): boolean => {
  const apiDomains = GESTE_TO_API_DOMAIN_MAPPING[geste];

  if (!apiDomains) {
    console.warn(`Geste non mappé dans le système RGE: ${geste}`);
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
  gestes: string[],
  metadata: Metadata
): Record<string, string[]> => {
  return gestes.reduce(
    (acc, geste) => {
      const group = getGesteGroup(geste, metadata);
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(geste);
      return acc;
    },
    {} as Record<string, string[]>
  );
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
