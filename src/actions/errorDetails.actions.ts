"use server";

import { apiClient } from "@/lib/server/apiClient";
import { revalidatePath } from "next/cache";

// Suppression d'un détail d'erreur
export async function deleteErrorDetail(
  quoteCheckId: string,
  errorDetailsId: string,
  reason: string
): Promise<boolean> {
  try {
    if (!quoteCheckId || !errorDetailsId) {
      throw new Error("Quote check ID and error details ID are required");
    }

    await apiClient.delete(
      `/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}?reason=${reason}`
    );

    revalidatePath(`/result/${quoteCheckId}`);
    return true;
  } catch (error) {
    console.error("Error deleting error detail:", error);
    throw error;
  }
}

// Annulation de la suppression d'un détail d'erreur
export async function undoDeleteErrorDetail(
  quoteCheckId: string,
  errorDetailsId: string
): Promise<boolean> {
  try {
    if (!quoteCheckId || !errorDetailsId) {
      throw new Error("Quote check ID and error details ID are required");
    }

    await apiClient.post(
      `/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}`
    );

    revalidatePath(`/result/${quoteCheckId}`);
    return true;
  } catch (error) {
    console.error("Error undoing delete error detail:", error);
    throw error;
  }
}

// Récupération des raisons de suppression des détails d'erreur
export async function getDeleteErrorDetailReasons(): Promise<
  { id: string; label: string }[]
> {
  try {
    const responseData = await apiClient.get(
      "/api/v1/quote_checks/error_detail_deletion_reasons"
    );

    if (!responseData.data) {
      throw new Error("Invalid response format: 'data' field is missing.");
    }

    return Object.entries(responseData.data).map(([key, value]) => ({
      id: key,
      label: value as string,
    }));
  } catch (error) {
    console.error("Error fetching delete error detail reasons:", error);
    throw error;
  }
}

// Mise à jour d'un détail d'erreur
export async function updateErrorDetail(
  quoteCheckId: string,
  errorDetailsId: string,
  comment: string | null
): Promise<boolean> {
  try {
    if (!quoteCheckId || !errorDetailsId) {
      throw new Error("Quote check ID and error details ID are required");
    }

    await apiClient.patch(
      `/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}`,
      { comment }
    );

    revalidatePath(`/result/${quoteCheckId}`);
    return true;
  } catch (error) {
    console.error("Error updating error detail:", error);
    throw error;
  }
}
