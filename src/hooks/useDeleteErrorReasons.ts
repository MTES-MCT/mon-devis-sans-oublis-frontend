"use client";

import { useState, useEffect } from "react";
import { getDeleteErrorDetailReasons as getQuoteCheckReasons } from "@/actions/quoteCheck.errorDetails.actions";
import { getDeleteErrorDetailReasons as getQuoteCaseReasons } from "@/actions/quoteCase.errorDetails.actions";

type EntityType = "quote_checks" | "quotes_cases";

// Cache séparé pour chaque type d'entité
const reasonsCache = new Map<EntityType, { id: string; label: string }[]>();

export const useDeleteErrorReasons = (entityType: EntityType) => {
  const [reasons, setReasons] = useState<{ id: string; label: string }[]>(
    reasonsCache.get(entityType) || []
  );
  const [loading, setLoading] = useState(!reasonsCache.has(entityType));

  useEffect(() => {
    const cachedReasons = reasonsCache.get(entityType);

    if (cachedReasons) {
      setReasons(cachedReasons);
      setLoading(false);
      return;
    }

    const loadReasons = async () => {
      try {
        const data =
          entityType === "quote_checks"
            ? await getQuoteCheckReasons()
            : await getQuoteCaseReasons();

        reasonsCache.set(entityType, data);
        setReasons(data);
      } catch (error) {
        console.error("Erreur lors du chargement des raisons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReasons();
  }, [entityType]);

  return { reasons, loading };
};
