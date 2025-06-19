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

export interface QuoteChecksId {
  controls_count: number | undefined;
  id: string;
  parent_id: string;
  status: Status;
  filename: string;
  finished_at: string;
  comment: string | null;
  metadata: Metadata;
  profile: Profile;
  gestes: Gestes[];
  errors: string[];
  error_details: ErrorDetails[];
  error_messages: Record<string, string>;
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
