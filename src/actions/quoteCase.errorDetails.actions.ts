"use server";

import {
  deleteErrorDetailShared,
  undoDeleteErrorDetailShared,
  getDeleteErrorDetailReasonsShared,
  updateErrorDetailShared,
} from "@/actions/shared/errorDetails.actions";

// Suppression d'un détail d'erreur pour quotes_cases
export async function deleteErrorDetail(
  id: string,
  errorDetailsId: string,
  reason: string
): Promise<boolean> {
  return deleteErrorDetailShared("quotes_cases", id, errorDetailsId, reason);
}

// Annulation de la suppression d'un détail d'erreur pour quotes_cases
export async function undoDeleteErrorDetail(
  quoteCaseId: string,
  errorDetailsId: string
): Promise<boolean> {
  return undoDeleteErrorDetailShared(
    "quotes_cases",
    quoteCaseId,
    errorDetailsId
  );
}

// Récupération des raisons de suppression pour quotes_cases
export async function getDeleteErrorDetailReasons(): Promise<
  { id: string; label: string }[]
> {
  return getDeleteErrorDetailReasonsShared("quotes_cases");
}

// Mise à jour d'un détail d'erreur pour quotes_cases
export async function updateErrorDetail(
  quoteCaseId: string,
  errorDetailsId: string,
  comment: string | null
): Promise<boolean> {
  return updateErrorDetailShared(
    "quotes_cases",
    quoteCaseId,
    errorDetailsId,
    comment
  );
}
