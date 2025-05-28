import {
  getQuote,
  uploadQuote,
  updateQuote,
  updateQuoteComment,
  getQuoteMetadata,
  addQuoteComment,
  removeQuoteComment,
} from "@/actions/quote.actions";

import {
  sendErrorFeedback,
  sendGlobalFeedback,
} from "@/actions/feedback.actions";

import { getStats } from "@/actions/stats.actions";

import {
  deleteErrorDetail,
  getDeleteErrorDetailReasons,
  undoDeleteErrorDetail,
  updateErrorDetail,
} from "@/actions/errorDetails.actions";

// Wrapper pour maintenir la compatibilité avec l'ancien code
export const quoteService = {
  getQuote,
  uploadQuote,
  updateQuote,
  updateQuoteComment,
  getQuoteMetadata,
  addQuoteComment,
  removeQuoteComment,
  deleteErrorDetail,
  undoDeleteErrorDetail,
  getDeleteErrorDetailReasons,
  updateErrorDetail,
  addErrorComment: updateErrorDetail,
  removeErrorDetailComment: (quoteCheckId: string, errorDetailsId: string) =>
    updateErrorDetail(quoteCheckId, errorDetailsId, null),
  sendErrorFeedback,
  sendGlobalFeedback,
};

export const statService = {
  getStats,
};
