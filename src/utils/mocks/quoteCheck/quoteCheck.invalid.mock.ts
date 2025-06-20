import { QuoteCheck, Status, Profile } from "@/types";
import { MOCK_ERROR_DETAILS_ADMIN } from "../errorDetails/errorDetails.admin.mock";
import { MOCK_CONTROL_CODES_COMPLETE } from "../controlCodes/controlCodes.common.mock";
import { MOCK_GESTES_INVALID } from "../gestes/gestes.invalid.mock";

export const MOCK_QUOTE_CHECK_INVALID: QuoteCheck = {
  id: "a34d3051-e9ec-48a0-939d-e84293f96482",
  parent_id: "case-456",
  filename: "Devis test valide - Copie (2).pdf",
  status: Status.INVALID,
  profile: Profile.PARTICULIER,
  controls_count: 38,
  started_at: "2025-06-17T15:36:23.675Z",
  finished_at: "2025-06-17T15:37:07Z",
  comment: null,

  gestes: [
    {
      ...MOCK_GESTES_INVALID.pompeAChaleur,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482-geste-1",
      valid: true,
    },
  ],

  metadata: {
    aides: ["MaPrimeRénov'", "CEE"],
    gestes: [
      {
        group: "chauffage",
        values: ["pompe_a_chaleur_air_eau"],
      },
    ],
  },

  errors: [
    MOCK_ERROR_DETAILS_ADMIN.rcsManquant.code,
    MOCK_ERROR_DETAILS_ADMIN.assuranceManquante.code,
    MOCK_ERROR_DETAILS_ADMIN.civiliteManquante.code,
    MOCK_ERROR_DETAILS_ADMIN.rgeNonCorrespondant.code,
    MOCK_ERROR_DETAILS_ADMIN.separationFourniturePose.code,
  ],

  error_details: [
    {
      ...MOCK_ERROR_DETAILS_ADMIN.rcsManquant,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482-1",
    },
    {
      ...MOCK_ERROR_DETAILS_ADMIN.assuranceManquante,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482-2",
    },
    {
      ...MOCK_ERROR_DETAILS_ADMIN.civiliteManquante,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482-3",
    },
    {
      ...MOCK_ERROR_DETAILS_ADMIN.rgeNonCorrespondant,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482-4",
    },
    {
      ...MOCK_ERROR_DETAILS_ADMIN.separationFourniturePose,
      id: "a34d3051-e9ec-48a0-939d-e84293f96482-5",
    },
  ],

  error_messages: {
    [MOCK_ERROR_DETAILS_ADMIN.rcsManquant.code]:
      MOCK_ERROR_DETAILS_ADMIN.rcsManquant.title,
    [MOCK_ERROR_DETAILS_ADMIN.assuranceManquante.code]:
      MOCK_ERROR_DETAILS_ADMIN.assuranceManquante.title,
    [MOCK_ERROR_DETAILS_ADMIN.civiliteManquante.code]:
      MOCK_ERROR_DETAILS_ADMIN.civiliteManquante.title,
    [MOCK_ERROR_DETAILS_ADMIN.rgeNonCorrespondant.code]:
      MOCK_ERROR_DETAILS_ADMIN.rgeNonCorrespondant.title,
    [MOCK_ERROR_DETAILS_ADMIN.separationFourniturePose.code]:
      MOCK_ERROR_DETAILS_ADMIN.separationFourniturePose.title,
  },

  control_codes: MOCK_CONTROL_CODES_COMPLETE,
};
