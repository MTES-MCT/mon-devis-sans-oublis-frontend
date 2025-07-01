import {
  QuoteCase,
  Status,
  Profile,
  RenovationTypes,
  Category,
  FileErrorCodes,
} from "@/types";
import { MOCK_QUOTE_CHECK_INVALID } from "../quoteCheck";

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

  // Mix de devis valides et invalides avec tous les types d'erreurs de fichier
  quote_checks: [
    // Premier devis invalide (pompe à chaleur avec erreurs admin)
    {
      ...MOCK_QUOTE_CHECK_INVALID,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "Devis test valide - Copie (2).pdf",
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Devis avec FILE_TYPE_ERROR
    {
      id: "file-type-error-quote",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "document-non-devis.pdf",
      status: Status.INVALID,
      controls_count: 1,
      started_at: "2025-06-17T15:36:23.673Z",
      finished_at: "2025-06-17T15:37:06Z",
      comment: null,
      profile: Profile.PARTICULIER,
      metadata: { aides: [], gestes: [] },
      gestes: [],
      errors: [FileErrorCodes.FILE_TYPE_ERROR],
      error_details: [],
      error_messages: {
        [FileErrorCodes.FILE_TYPE_ERROR]:
          "Le fichier ne semble pas être un devis, veuillez nous transférer uniquement des devis de rénovation énergétique.",
      },
      control_codes: [FileErrorCodes.FILE_TYPE_ERROR],
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Devis avec EMPTY_FILE_ERROR
    {
      id: "empty-file-error-quote",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "fichier-vide.pdf",
      status: Status.INVALID,
      controls_count: 1,
      started_at: "2025-06-17T15:36:23.673Z",
      finished_at: "2025-06-17T15:37:06Z",
      comment: null,
      profile: Profile.PARTICULIER,
      metadata: { aides: [], gestes: [] },
      gestes: [],
      errors: [FileErrorCodes.EMPTY_FILE_ERROR],
      error_details: [],
      error_messages: {
        [FileErrorCodes.EMPTY_FILE_ERROR]:
          "Le fichier fourni semble vide, nous n'avons pas pu lire son contenu.",
      },
      control_codes: [FileErrorCodes.EMPTY_FILE_ERROR],
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Devis avec FILE_READING_ERROR
    {
      id: "file-reading-error-quote",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "document-corrompu.pdf",
      status: Status.INVALID,
      controls_count: 1,
      started_at: "2025-06-17T15:36:23.673Z",
      finished_at: "2025-06-17T15:37:06Z",
      comment: null,
      profile: Profile.PARTICULIER,
      metadata: { aides: [], gestes: [] },
      gestes: [],
      errors: [FileErrorCodes.FILE_READING_ERROR],
      error_details: [],
      error_messages: {
        [FileErrorCodes.FILE_READING_ERROR]:
          "Malheureusement, nous n'avons pas réussi à lire le fichier... (nous ne supportons pas encore les scans ou images pour le moment).",
      },
      control_codes: [FileErrorCodes.FILE_READING_ERROR],
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Devis avec LLM_ERROR
    {
      id: "llm-error-quote",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "devis-illisible.pdf",
      status: Status.INVALID,
      controls_count: 1,
      started_at: "2025-06-17T15:36:23.673Z",
      finished_at: "2025-06-17T15:37:06Z",
      comment: null,
      profile: Profile.PARTICULIER,
      metadata: { aides: [], gestes: [] },
      gestes: [],
      errors: [FileErrorCodes.LLM_ERROR],
      error_details: [],
      error_messages: {
        [FileErrorCodes.LLM_ERROR]:
          "Malheureusement, notre intelligence artificielle est en erreur actuellement, veuillez réessayer plus tard.",
      },
      control_codes: [FileErrorCodes.LLM_ERROR],
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Devis avec UNSUPPORTED_FILE_FORMAT
    {
      id: "unsupported-format-quote",
      parent_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
      filename: "devis.docx",
      status: Status.INVALID,
      controls_count: 1,
      started_at: "2025-06-17T15:36:23.673Z",
      finished_at: "2025-06-17T15:37:06Z",
      comment: null,
      profile: Profile.PARTICULIER,
      metadata: { aides: [], gestes: [] },
      gestes: [],
      errors: [FileErrorCodes.UNSUPPORTED_FILE_FORMAT],
      error_details: [],
      error_messages: {
        [FileErrorCodes.UNSUPPORTED_FILE_FORMAT]:
          "L'extension et le format du fichier ne sont pas supportés pour le moment.",
      },
      control_codes: [FileErrorCodes.UNSUPPORTED_FILE_FORMAT],
      case_id: "9dc76eec-e728-46af-aba5-1f5b0625a3cd",
    },

    // Troisième devis invalide (poêle à bois) - gardé tel quel
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
