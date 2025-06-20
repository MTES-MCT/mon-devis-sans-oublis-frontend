import { Gestes } from "@/types";

export const MOCK_GESTES_INVALID = {
  pompeAChaleur: {
    id: "ab79b839-892d-46c0-aa08-ae65099fef3e-geste-1",
    intitule:
      " Pompe à chaleur AIR/EAU - moyenne température - de marque NOUVOVO modèle 8 R32 - 6kW - classe énergétique chauffage A+++ - efficacité énergétique saisonnière chauffage avec sonde extérieure 179 % - SCOP 4.5 - COP 4.5 - niveau sonore intérieur / extérieur : 32/38 dB",
    valid: false,
  } as Gestes,

  isolation: {
    id: "geste-iso-invalid-001",
    intitule: "Isolation combles perdus - matériau non conforme",
    valid: false,
  } as Gestes,

  menuiseries: {
    id: "geste-menu-invalid-001",
    intitule: "Fenêtres double vitrage - coefficient thermique insuffisant",
    valid: false,
  } as Gestes,

  ventilation: {
    id: "geste-vent-invalid-001",
    intitule: "VMC simple flux - débit non conforme",
    valid: false,
  } as Gestes,
};
