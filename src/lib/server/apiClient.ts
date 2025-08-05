import { getServerEnv, getSharedEnv } from "../config/env.config";
import { ApiError } from "@/types";

function getHeaders(): HeadersInit {
  const serverEnv = getServerEnv();
  return {
    accept: "application/json",
    Authorization: `Bearer ${serverEnv.NEXT_PRIVATE_API_AUTH_TOKEN}`,
  };
}

function getApiUrl(): string {
  const sharedEnv = getSharedEnv();
  return sharedEnv.NEXT_PUBLIC_API_URL;
}

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      headers: getHeaders(),
      cache: "no-store",
    });

    // Récupérer les données avant de vérifier le statut
    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      // Si on ne peut pas parser le JSON, on continue avec null
    }

    if (!response.ok) {
      const apiError: ApiError = {
        message: `API Error: ${response.status} ${response.statusText}`,
        status: response.status,
        error_details: responseData?.error_details || undefined,
      };
      throw apiError;
    }

    return responseData;
  },

  async post(endpoint: string, data?: unknown) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        ...(!(data instanceof FormData) && {
          "Content-Type": "application/json",
        }),
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    // Récupérer les données avant de vérifier le statut
    let responseData = null;
    if (response.status !== 204) {
      const contentLength = response.headers.get("content-length");
      if (contentLength !== "0") {
        try {
          const text = await response.text();
          if (text.trim()) {
            responseData = JSON.parse(text);
          }
        } catch {
          // Si on ne peut pas parser, on continue
        }
      }
    }

    if (!response.ok) {
      const apiError: ApiError = {
        message: `API Error: ${response.status} ${response.statusText}`,
        status: response.status,
        error_details: responseData?.error_details || undefined,
      };
      throw apiError;
    }

    return responseData;
  },

  async patch(endpoint: string, data: unknown) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: "PATCH",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Récupérer les données avant de vérifier le statut
    let responseData = null;
    if (response.status !== 204) {
      const contentLength = response.headers.get("content-length");
      if (contentLength !== "0") {
        try {
          const text = await response.text();
          if (text.trim()) {
            responseData = JSON.parse(text);
          }
        } catch {
          // Si on ne peut pas parser, on continue
        }
      }
    }

    if (!response.ok) {
      const apiError: ApiError = {
        message: `API Error: ${response.status} ${response.statusText}`,
        status: response.status,
        error_details: responseData?.error_details || undefined,
      };
      throw apiError;
    }

    return responseData;
  },

  async delete(endpoint: string) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const apiError: ApiError = {
        message: `API Error: ${response.status} ${response.statusText}`,
        status: response.status,
      };
      throw apiError;
    }

    return response;
  },
};
