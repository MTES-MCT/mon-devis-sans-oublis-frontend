"use client";

import { useEffect, useState } from "react";

import { LoadingDots } from "@/components";
import { quoteService } from "@/lib/api";
import { ResultClient } from "@/page-sections";
import { QuoteChecksId } from "@/types";
import wording from "@/wording";

export default function EditClient({
  deleteErrorReasons,
  params,
}: {
  deleteErrorReasons?: { id: string; label: string }[];
  params: { profile: string; quoteCheckId: string };
}) {
  const [currentDevis, setCurrentDevis] = useState<QuoteChecksId | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentDevis = async () => {
      try {
        const data = await quoteService.getQuote(params.quoteCheckId);
        setCurrentDevis(data);
      } catch (error) {
        console.error("Error fetching devis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentDevis();
  }, [params.quoteCheckId]);

  const handleDeleteErrorDetail = async (
    quoteCheckId: string,
    errorDetailId: string,
    reason: string
  ) => {
    if (!currentDevis) return;

    const updatedDevis = {
      ...currentDevis,
      error_details: (currentDevis.error_details || []).map((error) => ({
        ...error,
        deleted: error.id === errorDetailId ? true : error.deleted,
      })),
    };

    setCurrentDevis(updatedDevis);

    try {
      await quoteService.deleteErrorDetail(quoteCheckId, errorDetailId, reason);
      const refreshedDevis = await quoteService.getQuote(quoteCheckId);
      setCurrentDevis(refreshedDevis);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'erreur:", error);
      setCurrentDevis(currentDevis);
    }
  };

  if (isLoading) {
    return (
      <section className="fr-container-fluid fr-py-10w h-[500px] flex flex-col items-center justify-center">
        <LoadingDots title={wording.page_upload_id.analysis_redirect_title} />
        <p>{wording.page_upload_id.analysis_redirect}</p>
      </section>
    );
  }

  return (
    <ResultClient
      currentDevis={currentDevis}
      deleteErrorReasons={deleteErrorReasons}
      onDeleteErrorDetail={handleDeleteErrorDetail}
      profile={params.profile}
      quoteCheckId={params.quoteCheckId}
      showDeletedErrors
    />
  );
}
