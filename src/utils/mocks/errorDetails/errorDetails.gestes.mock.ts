import { ErrorDetails, Category, Type } from "@/types";

export const MOCK_ERROR_DETAILS_GESTES = {
  chauffagePuissanceManquant: {
    id: "error-geste-puissance-001",
    code: "chauffage_puissance_manquant",
    type: Type.MISSING,
    title: "La puissance du matériel est manquante",
    category: Category.GESTES,
    geste_id: "geste-chauffage-001",
    solution: "La puissance doit être indiquée en KW.",
    provided_value:
      "Pompe à chaleur AIR/EAU - moyenne température - de marque NOUVOVO modèle 8 R32",
    deleted: false,
    comment: null,
  } as ErrorDetails,

  chauffageEtasManquant: {
    id: "error-geste-etas-001",
    code: "chauffage_etas_manquant",
    type: Type.MISSING,
    title:
      "L'efficacité énergétique saisonnière (ETAS) du système de chauffage est manquante",
    category: Category.GESTES,
    geste_id: "geste-chauffage-001",
    solution: "L'efficacité énergétique saisonière (ETAS) est un pourcentage.",
    provided_value:
      "Pompe à chaleur AIR/EAU - moyenne température - de marque NOUVOVO modèle 8 R32",
    deleted: false,
    comment: null,
  } as ErrorDetails,

  poeleEmissionCOGManquant: {
    id: "error-geste-cog-001",
    code: "poele_emission_COG_manquant",
    type: Type.MISSING,
    title:
      "Il manque les émissions de composés organiques volatiles (COG) du poêle ou de l'insert",
    category: Category.GESTES,
    geste_id: "geste-chauffage-001",
    solution:
      "Lorsque le poêle ou l'insert n'a pas le label flamme verte, il faut indiquer les émissions de composés organiques volatiles (COG) rapportée à 10% d'O2 (en mg/Nm3).",
    provided_value:
      "Pompe à chaleur AIR/EAU - moyenne température - de marque NOUVOVO modèle 8 R32",
    deleted: false,
    comment: null,
  } as ErrorDetails,

  poeleEmissionNoxManquant: {
    id: "error-geste-nox-001",
    code: "poele_emission_nox_manquant",
    type: Type.MISSING,
    title:
      "Il manque les émissions d'oxydes d'azote (NOx) du poêle ou de l'insert",
    category: Category.GESTES,
    geste_id: "geste-chauffage-001",
    solution:
      "Lorsque le poêle ou l'insert n'a pas le label flamme verte, il faut indiquer les émissions d'oxydes d'azote (NOx) rapporté à 10% d'O2 (en mg/Nm3).",
    provided_value:
      "Pompe à chaleur AIR/EAU - moyenne température - de marque NOUVOVO modèle 8 R32",
    deleted: false,
    comment: null,
  } as ErrorDetails,

  chauffageRemplacementChaudiereManquant: {
    id: "error-geste-remplacement-001",
    code: "chauffage_remplacement_chaudiere_condensation_manquant",
    type: Type.MISSING,
    title:
      "Lors d'un remplacement de chaudière, il faut préciser si le système existant est (ou n'est pas) une chaudière à condensation",
    category: Category.GESTES,
    geste_id: "geste-chauffage-001",
    provided_value:
      "Pompe à chaleur AIR/EAU - moyenne température - de marque NOUVOVO modèle 8 R32",
    deleted: false,
    comment: null,
  } as ErrorDetails,
};
