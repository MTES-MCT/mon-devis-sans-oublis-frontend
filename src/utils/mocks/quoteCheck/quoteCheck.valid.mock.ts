import { QuoteChecksId, Status, Profile } from "@/types";
import { MOCK_GESTES_VALID } from "../gestes/gestes.valid.mock";
import {
  MOCK_METADATA_ISOLATION,
  MOCK_METADATA_CHAUFFAGE,
  MOCK_METADATA_MENUISERIES,
} from "../shared/metadata.mock";

export const MOCK_QUOTE_CHECK_ISOLATION_VALID: QuoteChecksId = {
  id: "check-isolation-001",
  parent_id: "case-valid-12345",
  filename: "devis_isolation_combles_perdus.pdf",
  status: Status.VALID,
  controls_count: 28,
  finished_at: "2024-12-15T09:35:22.000Z",
  comment: null,
  profile: Profile.PARTICULIER,
  metadata: MOCK_METADATA_ISOLATION,
  gestes: [MOCK_GESTES_VALID.isolation],
  error_details: [],
  errors: [],
  error_messages: {},
};

export const MOCK_QUOTE_CHECK_CHAUFFAGE_VALID: QuoteChecksId = {
  id: "check-chauffage-002",
  parent_id: "case-valid-12345",
  filename: "devis_pompe_a_chaleur_air_eau.pdf",
  status: Status.VALID,
  controls_count: 32,
  finished_at: "2024-12-15T09:42:18.000Z",
  comment: null,
  profile: Profile.PARTICULIER,
  metadata: MOCK_METADATA_CHAUFFAGE,
  gestes: [MOCK_GESTES_VALID.chauffage],
  error_details: [],
  errors: [],
  error_messages: {},
};

export const MOCK_QUOTE_CHECK_MENUISERIES_VALID: QuoteChecksId = {
  id: "check-menuiseries-003",
  parent_id: "case-valid-12345",
  filename: "devis_fenetres_double_vitrage.pdf",
  status: Status.VALID,
  controls_count: 15,
  finished_at: "2024-12-15T09:38:45.000Z",
  comment: null,
  profile: Profile.PARTICULIER,
  metadata: MOCK_METADATA_MENUISERIES,
  gestes: [MOCK_GESTES_VALID.menuiseries],
  error_details: [],
  errors: [],
  error_messages: {},
};

// Export groupé pour faciliter l'utilisation
export const MOCK_QUOTE_CHECKS_VALID = [
  MOCK_QUOTE_CHECK_ISOLATION_VALID,
  MOCK_QUOTE_CHECK_CHAUFFAGE_VALID,
  MOCK_QUOTE_CHECK_MENUISERIES_VALID,
];
