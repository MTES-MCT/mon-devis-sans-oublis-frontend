"use server";

import { apiClient } from "@/lib/server/apiClient";

export async function getStats() {
  try {
    return await apiClient.get("/api/v1/stats");
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}
