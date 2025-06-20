import { Category, ErrorDetails, Type } from "@/types";

export const MOCK_ERROR_DETAILS_GESTES = {
  poeleRendementManquant: {
    id: "error-poele-rendement-001",
    code: "poele_rendement_energetique_manquant",
    type: Type.MISSING,
    title: "Le rendement énergétique du poêle ou de l'insert est manquant",
    category: Category.GESTES,
    geste_id: "geste-poele-001",
    solution: "Le rendement est une valeur en pourcentage.",
    provided_value:
      "FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - Jøtul F 100 SE",
    deleted: false,
    comment: null,
  } as ErrorDetails,

  chauffagePuissanceManquant: {
    id: "error-chauffage-puissance-001",
    code: "chauffage_puissance_manquant",
    type: Type.MISSING,
    title: "La puissance de l'équipement de chauffage est manquante",
    category: Category.GESTES,
    geste_id: "geste-chauffage-001",
    deleted: false,
    comment: null,
  } as ErrorDetails,
};
