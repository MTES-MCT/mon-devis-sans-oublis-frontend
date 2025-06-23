import { QuoteCase, Status, Profile, RenovationTypes } from "@/types";
import { MOCK_METADATA_GLOBAL } from "../shared/metadata.mock";
import { MOCK_QUOTE_CHECKS_VALID } from "../quoteCheck";

export const MOCK_QUOTE_CASE_VALID: QuoteCase = {
  id: "case-valid-12345",
  status: Status.VALID,
  profile: Profile.PARTICULIER,
  renovation_type: RenovationTypes.AMPLEUR,

  // Dates
  started_at: "2024-12-15T09:30:00.000Z",
  finished_at: "2024-12-15T09:45:00.000Z",

  // Aucune erreur de cohérence entre devis
  error_details: [],
  errors: [],
  error_messages: {},

  // Métadonnées globales du dossier
  metadata: MOCK_METADATA_GLOBAL,

  // Contrôles globaux
  control_codes: ["CTRL_001", "CTRL_002", "CTRL_003"],
  controls_count: 75,

  // Tous les devis sont valides (importés depuis quoteCheck.valid.mock)
  quote_checks: MOCK_QUOTE_CHECKS_VALID,
};
