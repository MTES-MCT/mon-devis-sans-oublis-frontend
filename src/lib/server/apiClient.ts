import { getServerEnv, getSharedEnv } from "../config/env.config";

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

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return null;
    return response.json();
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

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return null;
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  },
};
