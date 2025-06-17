// src/utils/testData.ts - Fichier temporaire pour les tests
import { QuoteCase, Status, Category } from "@/types";

export const mockQuoteCase: QuoteCase = {
  id: "test-case-123",
  status: Status.INVALID,
  profile: "particulier",
  renovation_type: "reno_globale",
  started_at: "2025-06-19T10:00:00.000Z",
  finished_at: "2025-06-19T10:05:00.000Z",

  // Erreurs d'incohérence entre devis
  errors: ["client_prenom_incoherent", "client_adresse_incoherent"],
  error_details: [
    {
      id: "test-case-123-inc-1",
      code: "client_prenom_incoherent",
      category: "case_incoherence" as Category,
      type: "error",
      title: "Le prénom du client est différent dans les documents",
      deleted: false,
      comment: "",
    },
    {
      id: "test-case-123-inc-2",
      code: "client_adresse_incoherent",
      category: "case_incoherence" as Category,
      type: "error",
      title: "L'adresse du client est différente dans les documents",
      deleted: false,
      comment: "",
    },
  ],
  error_messages: {
    client_prenom_incoherent:
      "Le prénom du client est différent dans les documents",
    client_adresse_incoherent:
      "L'adresse du client est différente dans les documents",
  },
  control_codes: ["client_prenom_incoherent", "client_adresse_incoherent"],
  controls_count: 2,

  // Devis avec différents statuts
  quote_checks: [
    // Devis conforme
    {
      id: "devis-conforme-1",
      status: Status.VALID,
      profile: "particulier",
      filename: "Devis_PAC_Conforme.pdf",
      gestes: [
        {
          intitule:
            "Pompe à chaleur AIR/EAU - haute température - marque ATLANTIC - modèle ALFEA EXTENSA AI 11 - 11kW - classe A+++ - SCOP 4.2",
          id: "devis-conforme-1-geste-1",
          valid: true,
        },
      ],
      started_at: "2025-06-19T10:00:00.000Z",
      finished_at: "2025-06-19T10:02:00.000Z",
      errors: [],
      error_details: [],
      error_messages: {},
      control_codes: [
        "file_type_error",
        "devis_manquant",
        "numero_devis_manquant",
        "date_devis_manquant",
        "pro_raison_sociale_manquant",
      ],
      controls_count: 25,
      case_id: "test-case-123",
    },

    // Devis avec erreurs administratives
    {
      id: "devis-erreur-admin",
      status: Status.INVALID,
      profile: "particulier",
      filename: "Devis_Isolation_Erreurs_Admin.pdf",
      gestes: [
        {
          intitule:
            "Isolation des combles perdus - laine de verre - R=7m².K/W - 120m²",
          id: "devis-erreur-admin-geste-1",
          valid: true,
        },
      ],
      started_at: "2025-06-19T10:00:00.000Z",
      finished_at: "2025-06-19T10:03:00.000Z",
      errors: [
        "rcs_manquant",
        "pro_assurance_manquant",
        "client_civilite_manquant",
      ],
      error_details: [
        {
          id: "devis-erreur-admin-1",
          code: "rcs_manquant",
          type: "missing",
          title: "Le N° RCS et ville d'immatriculation est manquant",
          category: "admin" as Category,
          deleted: false,
          comment: "",
        },
        {
          id: "devis-erreur-admin-2",
          code: "pro_assurance_manquant",
          type: "missing",
          title: "Assurance professionnelle souscrite manquante",
          category: "admin" as Category,
          solution:
            "Assurance professionnelle souscrite avec le N° de la police d'assurance, le type (décennale, biennale ...), les coordonnées de l'assureur.",
          deleted: false,
          comment: "",
        },
        {
          id: "devis-erreur-admin-3",
          code: "client_civilite_manquant",
          type: "missing",
          title: "La civilité du client est manquante",
          category: "admin" as Category,
          deleted: false,
          comment: "",
        },
      ],
      error_messages: {
        rcs_manquant: "Le N° RCS et ville d'immatriculation est manquant",
        pro_assurance_manquant: "Assurance professionnelle souscrite manquante",
        client_civilite_manquant: "La civilité du client est manquante",
      },
      control_codes: [
        "file_type_error",
        "devis_manquant",
        "rcs_manquant",
        "pro_assurance_manquant",
        "client_civilite_manquant",
      ],
      controls_count: 28,
      case_id: "test-case-123",
    },

    // Devis avec erreurs de gestes
    {
      id: "devis-erreur-gestes",
      status: Status.INVALID,
      profile: "particulier",
      filename: "Devis_Poele_Erreurs_Gestes.pdf",
      gestes: [
        {
          intitule:
            "FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - modèle F 100 SE",
          id: "devis-erreur-gestes-geste-1",
          valid: false,
        },
        {
          intitule: "Isolation toiture - laine de roche - R=6m².K/W",
          id: "devis-erreur-gestes-geste-2",
          valid: true,
        },
      ],
      started_at: "2025-06-19T10:00:00.000Z",
      finished_at: "2025-06-19T10:04:00.000Z",
      errors: [
        "chauffage_puissance_manquant",
        "poele_rendement_energetique_manquant",
        "poele_emission_CO_manquant",
      ],
      error_details: [
        {
          id: "devis-erreur-gestes-1",
          code: "chauffage_puissance_manquant",
          type: "missing",
          title: "La puissance du matériel est manquante",
          category: "gestes" as Category,
          geste_id: "devis-erreur-gestes-geste-1",
          solution: "La puissance doit être indiquée en KW.",
          provided_value:
            "FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - modèle F 100 SE",
          deleted: false,
          comment: "",
        },
        {
          id: "devis-erreur-gestes-2",
          code: "poele_rendement_energetique_manquant",
          type: "missing",
          title: "Le rendement énergétique du poêle est manquant",
          category: "gestes" as Category,
          geste_id: "devis-erreur-gestes-geste-1",
          solution: "Le rendement est une valeur en pourcentage.",
          provided_value:
            "FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - modèle F 100 SE",
          deleted: false,
          comment: "",
        },
        {
          id: "devis-erreur-gestes-3",
          code: "poele_emission_CO_manquant",
          type: "missing",
          title: "Il manque les émissions de monoxyde de carbone (CO)",
          category: "gestes" as Category,
          geste_id: "devis-erreur-gestes-geste-1",
          solution:
            "Indiquer les émissions de CO rapportée à 10% d'O2 (en mg/Nm3).",
          provided_value:
            "FOURNITURE ET POSE D'UN POÊLE A BOIS Jotul - modèle F 100 SE",
          deleted: false,
          comment: "",
        },
      ],
      error_messages: {
        chauffage_puissance_manquant: "La puissance du matériel est manquante",
        poele_rendement_energetique_manquant:
          "Le rendement énergétique du poêle est manquant",
        poele_emission_CO_manquant:
          "Il manque les émissions de monoxyde de carbone (CO)",
      },
      control_codes: [
        "file_type_error",
        "chauffage_puissance_manquant",
        "poele_rendement_energetique_manquant",
        "poele_emission_CO_manquant",
      ],
      controls_count: 35,
      case_id: "test-case-123",
    },

    // Devis avec erreurs mixtes (admin + gestes)
    {
      id: "devis-erreur-mixte",
      status: Status.INVALID,
      profile: "particulier",
      filename: "Devis_Chaudiere_Erreurs_Mixtes.pdf",
      gestes: [
        {
          intitule: "Chaudière gaz à condensation - marque VIESSMANN - 24kW",
          id: "devis-erreur-mixte-geste-1",
          valid: false,
        },
      ],
      started_at: "2025-06-19T10:00:00.000Z",
      finished_at: "2025-06-19T10:05:00.000Z",
      errors: [
        "rge_manquant",
        "separation_fourniture_pose_manquant",
        "chauffage_etas_manquant",
      ],
      error_details: [
        {
          id: "devis-erreur-mixte-1",
          code: "rge_manquant",
          type: "missing",
          title: "Le numéro de certification RGE est manquant",
          category: "admin" as Category,
          solution:
            "Le professionnel doit avoir le label RGE du geste en question.",
          deleted: false,
          comment: "",
        },
        {
          id: "devis-erreur-mixte-2",
          code: "separation_fourniture_pose_manquant",
          type: "missing",
          title: "La séparation fourniture et pose est manquante",
          category: "admin" as Category,
          solution:
            "Il est obligatoire de bien séparer la fourniture et la pose du matériel.",
          deleted: false,
          comment: "",
        },
        {
          id: "devis-erreur-mixte-3",
          code: "chauffage_etas_manquant",
          type: "missing",
          title: "L'efficacité énergétique saisonnière (ETAS) est manquante",
          category: "gestes" as Category,
          geste_id: "devis-erreur-mixte-geste-1",
          solution: "L'ETAS doit être indiquée en pourcentage.",
          provided_value:
            "Chaudière gaz à condensation - marque VIESSMANN - 24kW",
          deleted: false,
          comment: "",
        },
      ],
      error_messages: {
        rge_manquant: "Le numéro de certification RGE est manquant",
        separation_fourniture_pose_manquant:
          "La séparation fourniture et pose est manquante",
        chauffage_etas_manquant:
          "L'efficacité énergétique saisonnière (ETAS) est manquante",
      },
      control_codes: [
        "rge_manquant",
        "separation_fourniture_pose_manquant",
        "chauffage_etas_manquant",
      ],
      controls_count: 30,
      case_id: "test-case-123",
    },
  ],
};

// Hook temporaire pour activer/désactiver les données de test
export const USE_TEST_DATA =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_TEST_DATA === "true";
