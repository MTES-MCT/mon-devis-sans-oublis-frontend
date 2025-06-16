"use server";

import { apiClient } from "@/lib/server/apiClient";
import { Profile } from "@/types";
import { revalidatePath } from "next/cache";

interface QuoteUpdateData {
  status?: string;
  metadata?: {
    aides?: string[];
    gestes?: string[];
  };
}

interface QuoteUploadResult {
  id: string;
  [key: string]: unknown;
}

// Suppression du type restrictif QuoteResponse

// Récupération d'un devis - SANS typage restrictif
export async function getQuote(quoteCheckId: string) {
  try {
    if (!quoteCheckId) {
      throw new Error("Quote check ID is required");
    }

    return await apiClient.get(`/api/v1/quote_checks/${quoteCheckId}`);
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}

// Envoi d'un devis - SANS typage restrictif
export async function uploadQuote(
  file: File,
  metadata: { aides: string[]; gestes: string[] },
  profile: Profile
) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("profile", profile);
    formData.append("renovation_type", "geste");
    formData.append("metadata", JSON.stringify(metadata));

    const result = await apiClient.post("/api/v1/quote_checks", formData);

    if (!result.id) {
      throw new Error("The API didn't return an ID.");
    }

    return result;
  } catch (error) {
    console.error("Error uploading quote:", error);
    throw error;
  }
}

// Upload de plusieurs devis en parallèle
export async function uploadMultipleQuotes(
  files: File[],
  metadata: { aides: string[]; gestes: string[] },
  profile: Profile
) {
  try {
    const uploadPromises = files.map((file) =>
      uploadQuote(file, metadata, profile)
    );

    const results = await Promise.allSettled(uploadPromises);

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map(
        (result) => (result as PromiseFulfilledResult<QuoteUploadResult>).value
      );

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result) => (result as PromiseRejectedResult).reason);

    return {
      successful,
      failed,
      totalCount: files.length,
      successCount: successful.length,
      failureCount: failed.length,
    };
  } catch (error) {
    console.error("Error uploading multiple quotes:", error);
    throw error;
  }
}

// Mise à jour d'un devis - SANS typage restrictif
export async function updateQuote(
  quoteCheckId: string,
  updatedData: QuoteUpdateData
) {
  try {
    if (!quoteCheckId) {
      throw new Error("Quote check ID is required");
    }

    const result = await apiClient.patch(
      `/api/v1/quote_checks/${quoteCheckId}`,
      updatedData
    );
    revalidatePath(`/result/${quoteCheckId}`);
    return result;
  } catch (error) {
    console.error("Error updating quote:", error);
    throw error;
  }
}

// Mise à jour du commentaire d'un devis
export async function updateQuoteComment(
  quoteCheckId: string,
  comment: string | null
) {
  try {
    if (!quoteCheckId) {
      throw new Error("Quote check ID is required");
    }

    const result = await apiClient.patch(
      `/api/v1/quote_checks/${quoteCheckId}`,
      { comment }
    );

    revalidatePath(`/result/${quoteCheckId}`);

    return result || null;
  } catch (error) {
    console.error("Error updating quote comment:", error);
    throw error;
  }
}

// Ajout d'un commentaire
export async function addQuoteComment(quoteCheckId: string, comment: string) {
  if (!comment.trim()) {
    throw new Error("Comment cannot be empty");
  }

  await updateQuoteComment(quoteCheckId, comment);
  return getQuote(quoteCheckId);
}

// Suppression d'un commentaire
export async function removeQuoteComment(quoteCheckId: string) {
  return updateQuoteComment(quoteCheckId, null);
}

// Récupération des métadonnées des devis
export async function getQuoteMetadata() {
  try {
    return await apiClient.get("/api/v1/quote_checks/metadata");
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw error;
  }
}
