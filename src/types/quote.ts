export enum Category {
  ADMIN = "admin",
  FILE = "file",
  GESTES = "gestes",
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

export interface ErrorDetails {
  id: string;
  code: string;
  deleted: boolean;
  comment: string | null;
  type: string;
  title: string;
  category: string;
  geste_id?: string | null;
  problem?: string | null;
  solution?: string | null;
  provided_value?: string | null;
}

export interface Gestes {
  id: string;
  intitule: string;
  valid: boolean;
}

export interface GestesGroup {
  group: string;
  values: string[];
}

export interface Metadata {
  aides: string[];
  gestes: GestesGroup[];
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

export enum RenovationType {
  GESTES = "renovation-par-gestes",
  AMPLEUR = "renovation-ampleur",
}
