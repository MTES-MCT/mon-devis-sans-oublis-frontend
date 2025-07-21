"use server";

import { apiClient } from "@/lib/server/apiClient";
import { isApiError } from "@/types";
import {
  DataCheckResult,
  DataCheckRgeResult,
  CheckRGEParams,
} from "@/types/dataChecks.types";

export async function checkSIRET(siret: string): Promise<DataCheckResult> {
  try {
    if (!siret || siret.trim().length === 0) {
      throw new Error("Le SIRET est requis");
    }

    const cleanSiret = siret.trim();
    const response = await apiClient.get(
      `/api/v1/data_checks/siret?siret=${encodeURIComponent(cleanSiret)}`
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification du SIRET:", error);
    throw error;
  }
}

export async function checkRGE(
  params: CheckRGEParams
): Promise<DataCheckRgeResult> {
  try {
    const { siret, gestes, rge, date } = params;

    if (!siret || siret.trim().length === 0) {
      throw new Error("Le SIRET est requis pour la vérification RGE");
    }

    if (!gestes || gestes.length === 0) {
      throw new Error("Au moins un geste est requis pour la vérification RGE");
    }

    const queryParams = new URLSearchParams();

    queryParams.append("siret", siret.trim());
    queryParams.append("geste_types", gestes.join(","));

    if (rge && rge.trim().length > 0) queryParams.append("rge", rge.trim());
    if (date && date.trim().length > 0) queryParams.append("date", date.trim());

    const url = `/api/v1/data_checks/rge?${queryParams.toString()}`;

    const response = await apiClient.get(url);

    return response.data || response;
  } catch (error) {
    console.error("Erreur lors de la vérification RGE:", error);

    if (isApiError(error)) {
      // Gestion spécifique de l'erreur 404
      if (error.message.includes("404")) {
        return {
          valid: false,
          error_details: [{ code: "siret_not_found" }],
          results: null,
        };
      }

      // Gestion spécifique de l'erreur 400
      if (error.message.includes("400")) {
        return {
          valid: false,
          error_details: [{ code: "invalid_parameters" }],
          results: null,
        };
      }
    }

    throw error;
  }
}

export async function getDataChecksGestesTypes() {
  try {
    return await apiClient.get("/api/v1/data_checks/geste_types");
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des types de gestes pour data check :",
      error
    );
    throw error;
  }
}
