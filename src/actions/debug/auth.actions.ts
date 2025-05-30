"use server";

import { getServerEnv, getSharedEnv } from "@/lib/config/env.config";

export async function checkApiAuth() {
  try {
    const serverEnv = getServerEnv();
    const sharedEnv = getSharedEnv();

    const response = await fetch(
      `${sharedEnv.NEXT_PUBLIC_API_URL}/auth/check`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serverEnv.NEXT_PRIVATE_API_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error instanceof Error ? error.message : "Erreur réseau",
    };
  }
}
