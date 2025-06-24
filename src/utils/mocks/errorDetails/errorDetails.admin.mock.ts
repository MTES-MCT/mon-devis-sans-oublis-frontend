import { ErrorDetails, Category, Type } from "@/types";

export const MOCK_ERROR_DETAILS_ADMIN = {
  rcsManquant: {
    id: "error-rcs-001",
    code: "rcs_manquant",
    type: Type.MISSING,
    title:
      "Le N° RCS et ville d'immatriculation (pour les sociétés) ou le N° RNE est manquant",
    category: Category.ADMIN,
    deleted: false,
    comment: null,
  } as ErrorDetails,

  assuranceManquante: {
    id: "error-assurance-001",
    code: "pro_assurance_manquant",
    type: Type.MISSING,
    title: "Assurance professionnelle souscrite manquante",
    category: Category.ADMIN,
    solution:
      "Assurance professionnelle souscrite avec le N° de la police d'assurance, le type (décennale, biennale ...), les coordonnées de l'assureur ou du garant et la couverture géographique du contrat ou de la garantie.",
    deleted: false,
    comment: null,
  } as ErrorDetails,

  civiliteManquante: {
    id: "error-civilite-001",
    code: "client_civilite_manquant",
    type: Type.MISSING,
    title: "La civilité du client est manquante",
    category: Category.ADMIN,
    deleted: false,
    comment: null,
  } as ErrorDetails,

  rgeNonCorrespondant: {
    id: "error-rge-001",
    code: "rge_non_correspondant",
    type: Type.WRONG,
    title:
      "Le numéro de certification RGE du professionnel ne correspond pas au SIRET de l'établissement",
    category: Category.ADMIN,
    deleted: false,
    comment: null,
  } as ErrorDetails,

  separationFourniturePose: {
    id: "error-separation-001",
    code: "separation_fourniture_pose_manquant",
    type: Type.MISSING,
    title: "La séparation fourniture et pose est manquante",
    category: Category.ADMIN,
    solution:
      "Il est obligatoire de bien séparer la fourniture et la pose du matériel en indiquant clairement les prix associés.",
    deleted: false,
    comment: null,
  } as ErrorDetails,
};
