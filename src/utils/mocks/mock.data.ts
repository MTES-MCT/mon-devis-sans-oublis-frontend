import { QuoteCase, QuoteCheck } from "@/types";
import { MOCK_QUOTE_CASE_VALID } from "./quoteCase/quoteCase.valid.mock";
import { MOCK_QUOTE_CASE_INVALID } from "./quoteCase/quoteCase.invalid.mock";
import { MOCK_QUOTE_CHECK_SIMPLE_VALID } from "./quoteCheck/quoteCheck.valid.mock";
import { MOCK_QUOTE_CHECK_INVALID } from "./quoteCheck/quoteCheck.invalid.mock";

// Fonction simple pour récupérer le bon mock selon l'ID
export const getMockQuoteCheck = (id: string): QuoteCheck => {
  if (id.includes("invalide")) {
    return { ...MOCK_QUOTE_CHECK_INVALID, id };
  }
  return { ...MOCK_QUOTE_CHECK_SIMPLE_VALID, id };
};

export const getMockQuoteCase = (id: string): QuoteCase => {
  if (id.includes("invalide")) {
    return { ...MOCK_QUOTE_CASE_INVALID, id };
  }
  return { ...MOCK_QUOTE_CASE_VALID, id };
};
