import { useState, useEffect } from "react";
import { getDeleteErrorDetailReasons } from "@/actions/errorDetails.actions";

let cachedReasons: { id: string; label: string }[] | null = null;

export const useDeleteErrorReasons = () => {
  const [reasons, setReasons] = useState<{ id: string; label: string }[]>(
    cachedReasons || []
  );
  const [loading, setLoading] = useState(!cachedReasons);

  useEffect(() => {
    if (cachedReasons) {
      setReasons(cachedReasons);
      setLoading(false);
      return;
    }

    const loadReasons = async () => {
      try {
        const data = await getDeleteErrorDetailReasons();
        cachedReasons = data;
        setReasons(data);
      } catch (error) {
        console.error("Erreur lors du chargement des raisons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReasons();
  }, []);

  return { reasons, loading };
};
