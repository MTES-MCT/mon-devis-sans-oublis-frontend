import { ErrorDetails } from "./errorDetails.types";
import { Gestes, Metadata } from "./gestes.types";

export enum Category {
  ADMIN = "admin",
  FILE = "file",
  GESTES = "gestes",
  INCOHERENCE_DEVIS = "case_incoherence",
}

export enum Profile {
  ARTISAN = "artisan",
  CONSEILLER = "conseiller",
  PARTICULIER = "particulier",
}

export enum Status {
  INVALID = "invalid",
  VALID = "valid",
  PENDING = "pending",
}

export enum Type {
  MISSING = "missing",
  WRONG = "wrong",
}

export enum RenovationTypes {
  GESTES = "geste",
  AMPLEUR = "ampleur",
}

export interface QuoteCheck {
  id: string;
  status: Status;
  profile: Profile;
  filename: string;
  started_at: string;
  finished_at: string;
  controls_count: number;
  comment: string | null;

  // Métadonnées et gestes
  metadata: Metadata;
  gestes: Gestes[];

  // Erreurs et contrôles
  errors: string[];
  error_details: ErrorDetails[];
  error_messages: Record<string, string>;
  control_codes: string[];

  // Champs pour les devis dans un dossier
  case_id?: string;
  parent_id?: string;
}

export interface QuoteCheckUpdateData {
  status?: string;
  metadata?: {
    aides?: string[];
    gestes?: string[];
  };
}

export interface QuoteUploadResult {
  id: string;
  [key: string]: unknown;
}
