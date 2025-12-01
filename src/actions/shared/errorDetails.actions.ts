"use server";

import { apiClient } from "@/lib/server/apiClient";
import { revalidatePath } from "next/cache";

export type EntityType = "quote_checks" | "quotes_cases";

// Fonction helper pour les revalidations
function revalidateErrorDetailPaths(id: string): void {
  revalidatePath(`/devis/${id}`);
  revalidatePath(`/artisan/dossier/${id}`);
  revalidatePath(`/conseiller/dossier/${id}`);
  revalidatePath(`/particulier/dossier/${id}`);
}

// Suppression d'un détail d'erreur
export async function deleteErrorDetailShared(
  entityType: EntityType,
  id: string,
  errorDetailsId: string,
  reason: string
): Promise<boolean> {
  try {
    if (!id || !errorDetailsId) {
      throw new Error("ID and error details ID are required");
    }

    await apiClient.delete(
      `/api/v1/${entityType}/${id}/error_details/${errorDetailsId}?reason=${reason}`
    );

    revalidateErrorDetailPaths(id);
    return true;
  } catch (error) {
    console.error(`Error deleting ${entityType} error detail:`, error);
    throw error;
  }
}

// Annulation de la suppression d'un détail d'erreur
export async function undoDeleteErrorDetailShared(
  entityType: EntityType,
  id: string,
  errorDetailsId: string
): Promise<boolean> {
  try {
    if (!id || !errorDetailsId) {
      throw new Error("ID and error details ID are required");
    }

    await apiClient.post(
      `/api/v1/${entityType}/${id}/error_details/${errorDetailsId}`
    );

    revalidatePath(`/result/${id}`);
    return true;
  } catch (error) {
    console.error(`Error undoing ${entityType} error detail:`, error);
    throw error;
  }
}

// Récupération des raisons de suppression
export async function getDeleteErrorDetailReasonsShared(
  entityType: EntityType
): Promise<{ id: string; label: string }[]> {
  try {
    const responseData = await apiClient.get(
      `/api/v1/${entityType}/error_detail_deletion_reasons`
    );

    if (!responseData.data) {
      throw new Error("Invalid response format: 'data' field is missing.");
    }

    return Object.entries(responseData.data).map(([key, value]) => ({
      id: key,
      label: value as string,
    }));
  } catch (error) {
    console.error(
      `Error fetching ${entityType} delete error detail reasons:`,
      error
    );
    throw error;
  }
}

// Mise à jour d'un détail d'erreur
export async function updateErrorDetailShared(
  entityType: EntityType,
  id: string,
  errorDetailsId: string,
  comment: string | null
): Promise<boolean> {
  try {
    if (!id || !errorDetailsId) {
      throw new Error("ID and error details ID are required");
    }

    await apiClient.patch(
      `/api/v1/${entityType}/${id}/error_details/${errorDetailsId}`,
      { comment }
    );

    revalidatePath(`/result/${id}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${entityType} error detail:`, error);
    throw error;
  }
}
