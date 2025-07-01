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
  ERROR = "error",
}

export enum FileErrorCodes {
  FILE_TYPE_ERROR = "file_type_error",
  EMPTY_FILE_ERROR = "empty_file_error",
  FILE_READING_ERROR = "file_reading_error",
  LLM_ERROR = "llm_error",
  UNSUPPORTED_FILE_FORMAT = "unsupported_file_format",
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

// Helper pour identifier les erreurs de type fichier
export const hasFileError = (quoteCheck: QuoteCheck): boolean => {
  const fileErrorValues = Object.values(FileErrorCodes);
  return (
    quoteCheck.errors?.some((error) =>
      fileErrorValues.includes(error as FileErrorCodes)
    ) ?? false
  );
};

// Helper pour récupérer les erreurs de type fichier
export const getFileErrors = (quoteCheck: QuoteCheck): FileErrorCodes[] => {
  const fileErrorValues = Object.values(FileErrorCodes);
  return (
    (quoteCheck.errors?.filter((error) =>
      fileErrorValues.includes(error as FileErrorCodes)
    ) as FileErrorCodes[]) ?? []
  );
};

// Helper pour récupérer le premier message d'erreur de fichier
export const getFileErrorMessage = (quoteCheck: QuoteCheck): string => {
  const fileErrors = getFileErrors(quoteCheck);
  if (fileErrors.length === 0) return "Erreur de fichier";

  const firstError = fileErrors[0];
  return quoteCheck.error_messages?.[firstError] || "Format non supporté";
};
