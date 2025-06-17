import { ErrorDetails } from "./errorDetails.types";
import { Metadata } from "./gestes.types";
import { Profile, QuoteChecksId, RenovationTypes, Status } from "./quote.types";

export interface QuoteCase {
  id: string;
  reference?: string | null;
  status: Status;
  profile: Profile;
  renovation_type: RenovationTypes;
  metadata?: Metadata | null;
  started_at?: string;
  finished_at?: string;
  quote_checks?: QuoteChecksId[];
  errors?: string[];
  error_details?: ErrorDetails[];
  error_messages?: Record<string, string>;
  control_codes?: string[];
  controls_count?: number;
}

export interface QuoteCaseUpdateData {
  reference?: string | null;
}
