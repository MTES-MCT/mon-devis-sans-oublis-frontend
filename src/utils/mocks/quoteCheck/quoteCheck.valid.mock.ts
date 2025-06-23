import { QuoteCheck, Status, Profile } from "@/types";
import { MOCK_GESTES_VALID } from "../gestes";
import {
  MOCK_CONTROL_CODES_ISOLATION,
  MOCK_CONTROL_CODES_CHAUFFAGE,
  MOCK_CONTROL_CODES_MENUISERIES,
} from "../controlCodes/controlCodes.common.mock";

export const MOCK_QUOTE_CHECK_ISOLATION_VALID: QuoteCheck = {
  id: "check-isolation-001",
  parent_id: "case-valid-12345",
  filename: "devis_isolation_combles_perdus.pdf",
  status: Status.VALID,
  controls_count: 28,
  started_at: "2024-12-15T09:30:00.000Z",
  finished_at: "2024-12-15T09:35:22.000Z",
  comment: null,
  profile: Profile.PARTICULIER,

  metadata: {
    aides: ["MaPrimeRénov'", "CEE"],
    gestes: [
      {
        group: "isolation",
        values: ["combles_perdus"],
      },
    ],
  },

  gestes: [MOCK_GESTES_VALID.isolation],
  error_details: [],
  errors: [],
  error_messages: {},
  control_codes: MOCK_CONTROL_CODES_ISOLATION,
};

export const MOCK_QUOTE_CHECK_CHAUFFAGE_VALID: QuoteCheck = {
  id: "check-chauffage-002",
  parent_id: "case-valid-12345",
  filename: "devis_pompe_a_chaleur_air_eau.pdf",
  status: Status.VALID,
  controls_count: 32,
  started_at: "2024-12-15T09:35:00.000Z",
  finished_at: "2024-12-15T09:42:18.000Z",
  comment: null,
  profile: Profile.PARTICULIER,

  metadata: {
    aides: ["MaPrimeRénov'", "CEE"],
    gestes: [
      {
        group: "chauffage",
        values: ["pompe_a_chaleur_air_eau"],
      },
    ],
  },

  gestes: [MOCK_GESTES_VALID.chauffage],
  error_details: [],
  errors: [],
  error_messages: {},
  control_codes: MOCK_CONTROL_CODES_CHAUFFAGE,
};

export const MOCK_QUOTE_CHECK_MENUISERIES_VALID: QuoteCheck = {
  id: "check-menuiseries-003",
  parent_id: "case-valid-12345",
  filename: "devis_fenetres_double_vitrage.pdf",
  status: Status.VALID,
  controls_count: 15,
  started_at: "2024-12-15T09:36:00.000Z",
  finished_at: "2024-12-15T09:38:45.000Z",
  comment: null,
  profile: Profile.PARTICULIER,

  metadata: {
    aides: ["MaPrimeRénov'"],
    gestes: [
      {
        group: "menuiseries",
        values: ["fenetres_double_vitrage"],
      },
    ],
  },

  gestes: [MOCK_GESTES_VALID.menuiseries],
  error_details: [],
  errors: [],
  error_messages: {},
  control_codes: MOCK_CONTROL_CODES_MENUISERIES,
};

// Export groupé
export const MOCK_QUOTE_CHECKS_VALID = [
  MOCK_QUOTE_CHECK_ISOLATION_VALID,
  MOCK_QUOTE_CHECK_CHAUFFAGE_VALID,
  MOCK_QUOTE_CHECK_MENUISERIES_VALID,
];

// Mock simple pour les cas où on n'a besoin que d'un seul QuoteCheck valide
export const MOCK_QUOTE_CHECK_SIMPLE_VALID: QuoteCheck =
  MOCK_QUOTE_CHECK_CHAUFFAGE_VALID;
