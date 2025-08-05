import {
  getQuoteCheck,
  uploadQuoteCheck,
  updateQuoteCheck,
  updateQuoteCheckComment,
  getQuoteCheckMetadata,
  addQuoteCheckComment,
  removeQuoteCheckComment,
} from "@/actions/quoteCheck.actions";

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
} from "@/actions/quoteCheck.errorDetails.actions";

// Wrapper pour maintenir la compatibilité avec l'ancien code
export const quoteService = {
  getQuoteCheck,
  uploadQuoteCheck,
  updateQuoteCheck,
  updateQuoteCheckComment,
  getQuoteCheckMetadata,
  addQuoteCheckComment,
  removeQuoteCheckComment,
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
