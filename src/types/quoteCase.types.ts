import { Metadata } from "./gestes.types";
import { Profile, RenovationTypes, Status } from "./quote.types";

export interface QuoteCase {
  id: string;
  reference?: string | null;
  status: Status;
  profile: Profile;
  renovation_type: RenovationTypes;
  metadata?: Metadata | null;
}

export interface QuoteCaseUpdateData {
  reference?: string | null;
}
