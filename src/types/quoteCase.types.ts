import { ErrorDetails } from "./errorDetails.types";
import { Metadata } from "./gestes.types";
import {
  FileErrorCodes,
  getFileErrors,
  hasFileError,
  Profile,
  QuoteCheck,
  RenovationTypes,
  Status,
} from "./quoteCheck.types";

export interface QuoteCase {
  id: string;
  reference?: string | null;
  status: Status;
  profile: Profile;
  renovation_type: RenovationTypes;
  metadata?: Metadata | null;
  started_at?: string;
  finished_at?: string;
  quote_checks?: QuoteCheck[];
  errors?: string[];
  error_details?: ErrorDetails[];
  error_messages?: Record<string, string>;
  control_codes?: string[];
  controls_count?: number;
}

export interface QuoteCaseUpdateData {
  reference?: string | null;
}

// Helper pour récupérer tous les messages détaillés d'erreurs de fichier
export const getAllFileErrorDetailedMessages = (
  dossier: QuoteCase
): Record<FileErrorCodes, string> => {
  const messages: Record<FileErrorCodes, string> = {} as Record<
    FileErrorCodes,
    string
  >;

  dossier.quote_checks?.forEach((quote) => {
    if (hasFileError(quote)) {
      const errors = getFileErrors(quote);
      errors.forEach((errorCode) => {
        const detailedMessage = quote.error_messages?.[errorCode];
        if (detailedMessage && !messages[errorCode]) {
          messages[errorCode] = detailedMessage;
        }
      });
    }
  });

  return messages;
};
