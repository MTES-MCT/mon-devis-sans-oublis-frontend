"use server";

import { apiClient } from "@/lib/server/apiClient";
import { FeedbackResponse, GlobalFeedbackData } from "@/types";

// Envoi d'un feedback pour une erreur spécifique
export async function sendErrorFeedback(
  comment: string | null,
  errorDetailsId: string,
  quoteCheckId: string
): Promise<FeedbackResponse> {
  try {
    if (!comment || !errorDetailsId || !quoteCheckId) {
      throw new Error(
        "Comment, error details ID, and quote check ID are required"
      );
    }

    return await apiClient.post(
      `/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}/feedbacks`,
      { comment }
    );
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
}

// Envoi d'un feedback global sur le devis
export async function sendGlobalFeedback(
  quoteCheckId: string,
  feedback: GlobalFeedbackData
): Promise<FeedbackResponse> {
  try {
    if (!quoteCheckId) {
      throw new Error("Quote check ID is required");
    }

    return await apiClient.post(
      `/api/v1/quote_checks/${quoteCheckId}/feedbacks`,
      { ...feedback }
    );
  } catch (error) {
    console.error("Error sending global feedback:", error);
    throw error;
  }
}
