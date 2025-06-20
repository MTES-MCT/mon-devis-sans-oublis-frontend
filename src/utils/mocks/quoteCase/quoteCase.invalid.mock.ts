import { QuoteCase, Status, Profile, RenovationTypes, Category } from "@/types";
import { MOCK_QUOTE_CHECK_INVALID } from "../quoteCheck/quoteCheck.invalid.mock";

export const MOCK_QUOTE_CASE_INVALID: QuoteCase = {
  id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
  status: Status.INVALID,
  profile: Profile.PARTICULIER,
  renovation_type: RenovationTypes.AMPLEUR,

  // Dates basées sur vos vraies données
  started_at: "2025-06-17T15:36:23.673Z",
  finished_at: "2025-06-17T15:37:07.203Z",

  // Erreurs de cohérence entre devis (basées sur vos vraies données)
  errors: [
    "client_prenom_incoherent",
    "client_nom_incoherent",
    "client_adresse_incoherent",
  ],

  // Détails des erreurs de cohérence
  error_details: [
    {
      id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd-1",
      code: "client_prenom_incoherent",
      category: Category.INCOHERENCE_DEVIS,
      type: "error",
      title: "Le prénom du client est différent dans les documents",
      deleted: false,
      comment: null,
      geste_id: null,
      problem: 'Prénom "Jean" dans un devis et "John" dans l\'autre',
      solution: "Harmoniser le prénom du client dans tous les documents",
      provided_value: null,
    },
    {
      id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd-2",
      code: "client_nom_incoherent",
      category: Category.INCOHERENCE_DEVIS,
      type: "error",
      title: "Le nom du client est différent dans les documents",
      deleted: false,
      comment: null,
      geste_id: null,
      problem: 'Nom "Dupont" dans un devis et "Durand" dans l\'autre',
      solution: "Vérifier l'identité exacte du client et corriger",
      provided_value: null,
    },
    {
      id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd-3",
      code: "client_adresse_incoherent",
      category: Category.INCOHERENCE_DEVIS,
      type: "error",
      title: "L'adresse du client est différente dans les documents",
      deleted: false,
      comment: "Client a confirmé la bonne adresse par téléphone",
      geste_id: null,
      problem: 'Adresse "123 rue de la Paix" vs "456 avenue des Fleurs"',
      solution: "Utiliser l'adresse du lieu des travaux",
      provided_value: null,
    },
  ],

  // Messages d'erreur
  error_messages: {
    client_prenom_incoherent:
      "Le prénom du client est différent dans les documents",
    client_nom_incoherent: "Le nom du client est différent dans les documents",
    client_adresse_incoherent:
      "L'adresse du client est différente dans les documents",
  },

  // Codes de contrôle
  control_codes: [
    "client_prenom_incoherent",
    "client_nom_incoherent",
    "client_adresse_incoherent",
  ],
  controls_count: 3,

  // Métadonnées optionnelles
  metadata: {
    aides: ["MaPrimeRénov", "CEE"],
    gestes: [
      {
        group: "chauffage",
        values: ["pompe_a_chaleur_air_eau", "poele_bois"],
      },
    ],
  },

  // Mix de devis valides et invalides
  quote_checks: [
    // Premier devis invalide (pompe à chaleur avec erreurs admin)
    {
      ...MOCK_QUOTE_CHECK_INVALID,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "Devis test valide - Copie (2).pdf",
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Deuxième devis invalide (poêle à bois)
    {
      id: "70ae965b-8a0a-4cd9-86f3-24405523110f",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "Devis poele chaleureco prompt sans contenu.pdf",
      status: Status.INVALID,
      controls_count: 39,
      started_at: "2025-06-17T15:36:23.673Z",
      finished_at: "2025-06-17T15:37:06Z",
      comment: null,
      profile: Profile.PARTICULIER,

      metadata: {
        aides: ["MaPrimeRénov"],
        gestes: [
          {
            group: "chauffage",
            values: ["poele_bois"],
          },
        ],
      },

      // Geste invalide pour poêle
      gestes: [
        {
          id: "70ae965b-8a0a-4cd9-86f3-24405523110f-geste-1",
          intitule:
            " FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - Jøtul F 100 SE Finition : peint noir mat, avec porte sans arcades",
          valid: false,
        },
      ],

      // Erreurs spécifiques au poêle
      errors: [
        "date_chantier_manquant",
        "pro_assurance_manquant",
        "client_prenom_manquant",
        "client_nom_manquant",
        "rge_manquant",
        "chauffage_puissance_manquant",
        "poele_rendement_energetique_manquant",
        "poele_emission_CO_manquant",
      ],

      error_details: [
        {
          id: "70ae965b-8a0a-4cd9-86f3-24405523110f-1",
          code: "pro_assurance_manquant",
          type: "missing",
          title: "Assurance professionnelle souscrite manquante",
          category: Category.ADMIN,
          solution:
            "Assurance professionnelle souscrite avec le N° de la police d'assurance, le type (décennale, biennale ...), les coordonnées de l'assureur ou du garant et la couverture géographique du contrat ou de la garantie.",
          deleted: false,
          comment: null,
          geste_id: null,
          problem: null,
          provided_value: null,
        },
        {
          id: "70ae965b-8a0a-4cd9-86f3-24405523110f-2",
          code: "poele_rendement_energetique_manquant",
          type: "missing",
          title:
            "Le rendement énergétique du poêle ou de l'insert est manquant",
          category: Category.GESTES,
          geste_id: "70ae965b-8a0a-4cd9-86f3-24405523110f-geste-1",
          solution: "Le rendement est une valeur en pourcentage.",
          provided_value:
            "FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - Jøtul F 100 SE Finition : peint noir mat, avec porte sans arcades",
          deleted: false,
          comment: null,
          problem: null,
        },
      ],

      error_messages: {
        pro_assurance_manquant: "Assurance professionnelle souscrite manquante",
        poele_rendement_energetique_manquant:
          "Le rendement énergétique du poêle ou de l'insert est manquant",
      },

      control_codes: [
        "date_chantier_manquant",
        "pro_assurance_manquant",
        "client_prenom_manquant",
        "poele_rendement_energetique_manquant",
      ],

      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },
  ],
};
