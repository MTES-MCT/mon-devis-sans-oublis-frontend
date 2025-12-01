import { Metadata } from "@/types";

export const MOCK_METADATA_ISOLATION: Metadata = {
  aides: ["MaPrimeRénov", "CEE"],
  gestes: [
    {
      group: "isolation",
      values: ["isolation_combles_perdus", "isolation_murs_exterieurs"],
    },
  ],
};

export const MOCK_METADATA_CHAUFFAGE: Metadata = {
  aides: ["MaPrimeRénov", "CEE", "Coup de pouce chauffage"],
  gestes: [
    {
      group: "chauffage",
      values: ["pompe_a_chaleur_air_eau", "chaudiere_gaz_condensation"],
    },
  ],
};

export const MOCK_METADATA_MENUISERIES: Metadata = {
  aides: ["MaPrimeRénov"],
  gestes: [
    {
      group: "menuiseries",
      values: ["fenetres_double_vitrage", "portes_fenetres"],
    },
  ],
};

export const MOCK_METADATA_VENTILATION: Metadata = {
  aides: ["MaPrimeRénov", "CEE"],
  gestes: [
    {
      group: "ventilation",
      values: ["vmc_double_flux", "vmc_simple_flux"],
    },
  ],
};

export const MOCK_METADATA_GLOBAL: Metadata = {
  aides: ["MaPrimeRénov", "CEE", "Coup de pouce chauffage", "Eco-PTZ"],
  gestes: [
    {
      group: "isolation",
      values: ["isolation_combles_perdus", "isolation_murs_exterieurs"],
    },
    {
      group: "chauffage",
      values: ["pompe_a_chaleur_air_eau"],
    },
    {
      group: "menuiseries",
      values: ["fenetres_double_vitrage"],
    },
  ],
};
