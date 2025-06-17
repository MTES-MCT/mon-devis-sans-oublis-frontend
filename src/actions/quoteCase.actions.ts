"use server";

import { apiClient } from "@/lib/server/apiClient";
import {
  Profile,
  RenovationTypes,
  QuoteCase,
  QuoteCaseUpdateData,
} from "@/types";

// Création d'un dossier de rénovation d'ampleur
export async function createQuoteCase(
  metadata: { aides: string[]; gestes: string[] },
  profile: Profile,
  reference?: string | null
): Promise<QuoteCase> {
  try {
    const requestData = {
      profile,
      renovation_type: RenovationTypes.AMPLEUR,
      metadata: {
        aides: metadata.aides,
        gestes: metadata.gestes,
      },
      reference: reference || null,
    };

    const result = await apiClient.post("/api/v1/quote_cases", requestData);

    if (!result.id) {
      throw new Error("The API didn't return an ID for the quote case.");
    }

    return result as QuoteCase;
  } catch (error) {
    console.error("Error creating quote case:", error);
    throw error;
  }
}

// Récupération d'un dossier de rénovation d'ampleur
export async function getQuoteCase(quoteCaseId: string): Promise<QuoteCase> {
  try {
    if (!quoteCaseId) {
      throw new Error("Quote case ID is required");
    }

    const result = await apiClient.get(`/api/v1/quote_cases/${quoteCaseId}`);
    return result as QuoteCase;
  } catch (error) {
    console.error("Error fetching quote case:", error);
    throw error;
  }
}

// Mise à jour d'un dossier de rénovation d'ampleur
export async function updateQuoteCase(
  quoteCaseId: string,
  updatedData: QuoteCaseUpdateData
): Promise<QuoteCase> {
  try {
    if (!quoteCaseId) {
      throw new Error("Quote case ID is required");
    }

    const requestData = {
      reference: updatedData.reference || null,
    };

    const result = await apiClient.patch(
      `/api/v1/quote_cases/${quoteCaseId}`,
      requestData
    );

    return result as QuoteCase;
  } catch (error) {
    console.error("Error updating quote case:", error);
    throw error;
  }
}
