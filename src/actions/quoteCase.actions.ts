"use server";

import { apiClient } from "@/lib/server/apiClient";
import { Profile } from "@/types";

// Création d'un dossier de rénovation d'ampleur
export async function createQuoteCase(
  metadata: { aides: string[]; gestes: string[] },
  profile: Profile
) {
  try {
    const result = await apiClient.post("/api/v1/quote_cases", {
      profile,
      renovation_type: "renovation_ampleur",
      metadata: JSON.stringify(metadata),
    });

    if (!result.id) {
      throw new Error("The API didn't return an ID for the quote case.");
    }

    return result;
  } catch (error) {
    console.error("Error creating quote case:", error);
    throw error;
  }
}

// Récupération d'un dossier de rénovation d'ampleur
export async function getQuoteCase(quoteCaseId: string) {
  try {
    if (!quoteCaseId) {
      throw new Error("Quote case ID is required");
    }

    return await apiClient.get(`/api/v1/quote_cases/${quoteCaseId}`);
  } catch (error) {
    console.error("Error fetching quote case:", error);
    throw error;
  }
}

// Mise à jour d'un dossier de rénovation d'ampleur
export async function updateQuoteCase(
  quoteCaseId: string,
  updatedData: {
    status?: string;
    metadata?: { aides?: string[]; gestes?: string[] };
  }
) {
  try {
    if (!quoteCaseId) {
      throw new Error("Quote case ID is required");
    }

    const result = await apiClient.patch(
      `/api/v1/quote_cases/${quoteCaseId}`,
      updatedData
    );

    return result;
  } catch (error) {
    console.error("Error updating quote case:", error);
    throw error;
  }
}
