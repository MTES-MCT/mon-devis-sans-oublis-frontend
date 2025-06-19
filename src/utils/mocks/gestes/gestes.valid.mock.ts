import { Gestes } from "@/types";

export const MOCK_GESTES_VALID = {
  isolation: {
    id: "geste-iso-001",
    intitule: "Isolation des combles perdus",
    valid: true,
  } as Gestes,

  chauffage: {
    id: "geste-chauf-001",
    intitule: "Installation pompe à chaleur air/eau",
    valid: true,
  } as Gestes,

  menuiseries: {
    id: "geste-menu-001",
    intitule: "Remplacement fenêtres double vitrage",
    valid: true,
  } as Gestes,

  ventilation: {
    id: "geste-vent-001",
    intitule: "Installation VMC double flux",
    valid: true,
  } as Gestes,

  etancheite: {
    id: "geste-etan-001",
    intitule: "Amélioration étanchéité à l'air",
    valid: true,
  } as Gestes,
};

export const MOCK_GESTES_VALID_ARRAY = Object.values(MOCK_GESTES_VALID);
