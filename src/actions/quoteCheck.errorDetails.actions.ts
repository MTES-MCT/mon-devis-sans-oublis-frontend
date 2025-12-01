"use server";

import {
  deleteErrorDetailShared,
  undoDeleteErrorDetailShared,
  getDeleteErrorDetailReasonsShared,
  updateErrorDetailShared,
} from "@/actions/shared/errorDetails.actions";

// Suppression d'un détail d'erreur pour quote_checks
export async function deleteErrorDetail(
  id: string,
  errorDetailsId: string,
  reason: string
): Promise<boolean> {
  return deleteErrorDetailShared("quote_checks", id, errorDetailsId, reason);
}

// Annulation de la suppression d'un détail d'erreur pour quote_checks
export async function undoDeleteErrorDetail(
  quoteCheckId: string,
  errorDetailsId: string
): Promise<boolean> {
  return undoDeleteErrorDetailShared(
    "quote_checks",
    quoteCheckId,
    errorDetailsId
  );
}

// Récupération des raisons de suppression pour quote_checks
export async function getDeleteErrorDetailReasons(): Promise<
  { id: string; label: string }[]
> {
  return getDeleteErrorDetailReasonsShared("quote_checks");
}

// Mise à jour d'un détail d'erreur pour quote_checks
export async function updateErrorDetail(
  quoteCheckId: string,
  errorDetailsId: string,
  comment: string | null
): Promise<boolean> {
  return updateErrorDetailShared(
    "quote_checks",
    quoteCheckId,
    errorDetailsId,
    comment
  );
}
