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
}

export interface QuoteCaseUpdateData {
  reference?: string | null;
}
