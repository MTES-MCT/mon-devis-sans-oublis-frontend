"use server";

import { apiClient } from "@/lib/server/apiClient";
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
      `/data_checks/siret?siret=${encodeURIComponent(cleanSiret)}`
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
    const { siret, rge, date } = params;

    if (!siret || siret.trim().length === 0) {
      throw new Error("Le SIRET est requis pour la vérification RGE");
    }

    const queryParams = new URLSearchParams();
    queryParams.append("siret", siret.trim());

    if (rge && rge.trim().length > 0) queryParams.append("rge", rge.trim());
    if (date && date.trim().length > 0) queryParams.append("date", date.trim());

    const url = `/data_checks/rge?${queryParams.toString()}`;
    const response = await apiClient.get(url);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification RGE:", error);
    throw error;
  }
}
