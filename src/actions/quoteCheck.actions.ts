"use server";

import { apiClient } from "@/lib/server/apiClient";
import {
  Profile,
  QuoteCheckUpdateData,
  QuoteUploadResult,
  RenovationTypes,
} from "@/types";
import { delay, logMock, shouldUseMock } from "@/utils/mocks/mock.config";
import { getMockQuoteCheck } from "@/utils/mocks/mock.data";
import { perfLogger } from "@/utils/performanceLogger";
import { revalidatePath } from "next/cache";

// Récupération d'un devis
export async function getQuoteCheck(quoteCheckId: string) {
  // Mode mock
  if (shouldUseMock(quoteCheckId)) {
    logMock("getQuoteCheck", quoteCheckId);
    await delay();
    return getMockQuoteCheck(quoteCheckId);
  }

  // Mode normal
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

// Envoi d'un devis lié à un dossier pour rénovation d'ampleur
async function uploadQuoteCheckToCase(
  file: File,
  quoteCaseId: string,
  profile: Profile
) {
  const uploadId = `upload_${file.name}_${Date.now()}`;

  console.log(`[UPLOAD-FILE-START] ${file.name}`, {
    size: `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type,
    quoteCaseId,
  });

  perfLogger.start(uploadId);
  perfLogger.start(`${uploadId}_formdata`);

  try {
    // Préparation FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("profile", profile);
    formData.append("renovation_type", RenovationTypes.AMPLEUR);
    formData.append("case_id", quoteCaseId);

    perfLogger.end(`${uploadId}_formdata`);

    // Appel API
    perfLogger.start(`${uploadId}_api_call`);
    const result = await apiClient.post("/api/v1/quote_checks", formData);
    const apiTime = perfLogger.end(`${uploadId}_api_call`);

    if (!result.id) {
      console.error(`[UPLOAD-FILE-ERROR] Pas d'ID retourné pour ${file.name}`);
      throw new Error("The API didn't return an ID.");
    }

    const totalTime = perfLogger.end(uploadId, {
      fileName: file.name,
      fileSize: file.size,
      quoteCheckId: result.id,
      apiTime: `${apiTime?.toFixed(2)}ms`,
      success: true,
    });

    console.log(`[UPLOAD-FILE-SUCCESS] ${file.name}`, {
      quoteCheckId: result.id,
      totalTime: `${totalTime?.toFixed(2)}ms`,
      apiTime: `${apiTime?.toFixed(2)}ms`,
    });

    return result;
  } catch (error) {
    perfLogger.end(uploadId, {
      fileName: file.name,
      fileSize: file.size,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });

    console.error(`[UPLOAD-FILE-ERROR] ${file.name}:`, error);
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
    perfLogger.start("upload_batch_total");

    // Log détaillé du batch
    console.log(`[UPLOAD-BATCH-START]`, {
      filesCount: files.length,
      quoteCaseId,
      profile,
      files: files.map((f) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(2)} KB`,
        type: f.type,
      })),
    });

    const uploadPromises = files.map((file, index) => {
      const uploadLabel = `batch_upload_${index + 1}`;
      perfLogger.start(uploadLabel);

      return uploadQuoteCheckToCase(file, quoteCaseId, profile)
        .then((result) => {
          const time = perfLogger.end(uploadLabel, {
            fileName: file.name,
            fileSize: file.size,
            success: true,
            quoteCheckId: result.id,
          });

          console.log(`[BATCH-ITEM-${index + 1}/${files.length}] Terminé:`, {
            file: file.name,
            time: `${time?.toFixed(2)}ms`,
            quoteCheckId: result.id,
          });

          return result;
        })
        .catch((error) => {
          perfLogger.end(uploadLabel, {
            fileName: file.name,
            fileSize: file.size,
            success: false,
            error: error.message,
          });

          console.error(`[BATCH-ITEM-${index + 1}/${files.length}] Échec:`, {
            file: file.name,
            error: error.message,
          });

          throw error;
        });
    });

    perfLogger.start("upload_parallel_wait");
    const results = await Promise.allSettled(uploadPromises);
    const parallelTime = perfLogger.end("upload_parallel_wait");

    const successful = results
      .filter((result) => result.status === "fulfilled")
      .map(
        (result) => (result as PromiseFulfilledResult<QuoteUploadResult>).value
      );

    const failed = results
      .filter((result) => result.status === "rejected")
      .map((result) => (result as PromiseRejectedResult).reason);

    const finalResult = {
      successful,
      failed,
      totalCount: files.length,
      successCount: successful.length,
      failureCount: failed.length,
      quoteCaseId,
    };

    const totalTime = perfLogger.end("upload_batch_total", finalResult);

    // Résumé détaillé
    console.log("[UPLOAD-BATCH-COMPLETE]", {
      total: files.length,
      réussis: successful.length,
      échecs: failed.length,
      tempsTotal: `${totalTime?.toFixed(2)}ms`,
      tempsParallel: `${parallelTime?.toFixed(2)}ms`,
      moyenneParFichier: `${((totalTime ?? 0) / files.length).toFixed(2)}ms`,
      fichiersPlusLents: perfLogger.getStats("upload_file_*")?.max,
      devisIds: successful.map((s) => s.id),
    });

    // Afficher les stats détaillées si des uploads ont échoué
    if (failed.length > 0) {
      console.error("[UPLOAD-BATCH-FAILURES]", failed);
    }

    return finalResult;
  } catch (error) {
    perfLogger.end("upload_batch_total", { error: true });
    console.error("[UPLOAD-BATCH-ERROR]", error);
    throw error;
  }
}

// Mise à jour d'un devis
export async function updateQuoteCheck(
  quoteCheckId: string,
  updatedData: QuoteCheckUpdateData
) {
  // Mode mock
  if (shouldUseMock(quoteCheckId)) {
    logMock("updateQuoteCheck", quoteCheckId);
    await delay();
    return getMockQuoteCheck(quoteCheckId);
  }

  // Mode normal
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
  // Mode mock
  if (shouldUseMock(quoteCheckId)) {
    logMock("updateQuoteCheckComment", quoteCheckId);
    await delay();
    const mock = getMockQuoteCheck(quoteCheckId);
    return { ...mock, comment };
  }

  // Mode normal
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
