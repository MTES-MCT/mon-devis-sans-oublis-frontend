"use server";

import { apiClient } from "@/lib/server/apiClient";
import { Profile, RenovationType, RenovationTypes } from "@/types";
import { revalidatePath } from "next/cache";

interface QuoteCheckUpdateData {
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

// Récupération d'un devis
export async function getQuoteCheck(quoteCheckId: string) {
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

// Envoi d'un devis simple (pour geste simple)
export async function uploadQuoteCheck(
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

// Envoi d'un devis lié à un dossier (pour rénovation d'ampleur)
export async function uploadQuoteCheckToCase(
  file: File,
  quoteCaseId: string,
  profile: Profile
) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("profile", profile);
    formData.append("renovation_type", RenovationTypes.AMPLEUR);
    formData.append("quote_case_id", quoteCaseId);

    const result = await apiClient.post("/api/v1/quote_checks", formData);

    if (!result.id) {
      throw new Error("The API didn't return an ID.");
    }

    return result;
  } catch (error) {
    console.error("Error uploading quote to case:", error);
    throw error;
  }
}

// Upload de plusieurs devis pour geste simple
export async function uploadMultipleQuotesCheck(
  files: File[],
  metadata: { aides: string[]; gestes: string[] },
  profile: Profile
) {
  try {
    const uploadPromises = files.map((file) =>
      uploadQuoteCheck(file, metadata, profile)
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

// Upload de plusieurs devis pour un dossier de rénovation d'ampleur
export async function uploadMultipleQuotesCheckToCase(
  files: File[],
  quoteCaseId: string,
  profile: Profile
) {
  try {
    const uploadPromises = files.map((file) =>
      uploadQuoteCheckToCase(file, quoteCaseId, profile)
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
      quoteCaseId,
    };
  } catch (error) {
    console.error("Error uploading multiple quotes to case:", error);
    throw error;
  }
}

// Mise à jour d'un devis
export async function updateQuoteCheck(
  quoteCheckId: string,
  updatedData: QuoteCheckUpdateData
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
export async function updateQuoteCheckComment(
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
export async function addQuoteCheckComment(
  quoteCheckId: string,
  comment: string
) {
  if (!comment.trim()) {
    throw new Error("Comment cannot be empty");
  }

  await updateQuoteCheckComment(quoteCheckId, comment);
  return getQuoteCheck(quoteCheckId);
}

// Suppression d'un commentaire
export async function removeQuoteCheckComment(quoteCheckId: string) {
  return updateQuoteCheckComment(quoteCheckId, null);
}

// Récupération des métadonnées des devis
export async function getQuoteCheckMetadata() {
  try {
    return await apiClient.get("/api/v1/quote_checks/metadata");
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw error;
  }
}
