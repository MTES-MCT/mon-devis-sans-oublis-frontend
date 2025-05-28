// src/lib/api.ts
// TODO : Remove this file when the API Server Action migration is complete
import { ErrorDetails, Profile, Rating } from "@/types";
import { isClient, isServer } from "./utils/env.utils";
import { getServerEnv, getSharedEnv } from "./config/env.config";

interface QuoteUpdateData {
  status?: string;
  metadata?: {
    aides?: string[];
    gestes?: string[];
  };
}

interface QuoteResponse {
  id: string;
  status: string;
  metadata: {
    aides: string[];
    gestes: string[];
  };
  error_details?: ErrorDetails[];
}

function getHeaders(): HeadersInit {
  const baseHeaders: HeadersInit = { accept: "application/json" };

  if (isServer()) {
    try {
      const serverEnv = getServerEnv();
      return {
        ...baseHeaders,
        Authorization: `Bearer ${serverEnv.NEXT_PRIVATE_API_AUTH_TOKEN}`,
      };
    } catch (error) {
      console.error("Cannot get server env for API headers:", error);
      return baseHeaders;
    }
  }

  return baseHeaders;
}

function getApiUrl(): string {
  // Solution directe : utiliser directement process.env côté client si getSharedEnv() échoue
  if (isClient()) {
    // Côté client : utiliser directement la variable d'environnement
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl;
    }
  }

  try {
    const env = getSharedEnv();
    return env.NEXT_PUBLIC_API_URL;
  } catch (error) {
    console.error("getApiUrl error:", error);
    // Fallback vers la variable directe
    const fallbackUrl = process.env.NEXT_PUBLIC_API_URL;
    if (fallbackUrl) {
      console.log("Using fallback URL:", fallbackUrl);
      return fallbackUrl;
    }
    console.error("No API URL available");
    return "";
  }
}

// Quote Service
// TODO : Remove this service when the API Server Action migration is complete
export const quoteServiceToRemove = {
  // Quote Management
  async uploadQuote(
    file: File,
    metadata: { aides: string[]; gestes: string[] },
    profile: Profile
  ) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("profile", profile);
      formData.append("renovation_type", "geste"); // TODO: Take it from the new UI
      formData.append("metadata", JSON.stringify(metadata));

      const response = await fetch(`${getApiUrl()}/api/v1/quote_checks`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Error while creating the quote: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (!data.id) {
        throw new Error("The API didn't return an ID.");
      }

      return data;
    } catch (error) {
      console.error("Error while uploading the quote:", error);
      throw error;
    }
  },

  async getQuote(quoteCheckId: string) {
    if (!quoteCheckId) {
      throw new Error("Quote check ID is required");
    }

    const response = await fetch(
      `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch quote: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  },

  async updateQuote(
    quoteCheckId: string,
    updatedData: QuoteUpdateData
  ): Promise<QuoteResponse> {
    try {
      if (!quoteCheckId) {
        throw new Error("Quote check ID is required");
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}`,
        {
          method: "PATCH",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update quote: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating quote:", error);
      throw error;
    }
  },

  async updateQuoteComment(quoteCheckId: string, comment: string | null) {
    try {
      if (!quoteCheckId) {
        throw new Error("Quote check ID is required");
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}`,
        {
          method: "PATCH",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update quote comment: ${response.status} ${response.statusText}`
        );
      }

      if (response.status === 204) {
        return null;
      }

      const responseText = await response.text();
      return responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error("Error updating quote comment:", error);
      throw error;
    }
  },

  async addQuoteComment(quoteCheckId: string, comment: string) {
    if (!comment.trim()) {
      throw new Error("Comment cannot be empty");
    }

    await this.updateQuoteComment(quoteCheckId, comment);
    return this.getQuote(quoteCheckId);
  },

  async removeQuoteComment(quoteCheckId: string) {
    return this.updateQuoteComment(quoteCheckId, null);
  },

  async getQuoteMetadata() {
    try {
      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/metadata`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch metadata: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching metadata:", error);
      throw error;
    }
  },

  // Error Details Management
  async deleteErrorDetail(
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ): Promise<Response> {
    if (!quoteCheckId || !errorDetailsId) {
      throw new Error("Quote check ID and error details ID are required");
    }

    const response = await fetch(
      `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}?reason=${reason}`,
      {
        method: "DELETE",
        headers: {
          ...getHeaders(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return response;
  },

  async undoDeleteErrorDetail(quoteCheckId: string, errorDetailsId: string) {
    try {
      if (!quoteCheckId || !errorDetailsId) {
        throw new Error("Quote check ID and error details ID are required");
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}`,
        {
          method: "POST",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur API lors de l'annulation de la suppression: ${response.status}`
        );
      }

      if (response.status === 204) {
        return null;
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Erreur lors de l'annulation de la suppression:", error);
      throw error;
    }
  },

  async getDeleteErrorDetailReasons(): Promise<
    { id: string; label: string }[]
  > {
    try {
      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/error_detail_deletion_reasons`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch delete error detail reasons: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();

      if (!responseData.data) {
        throw new Error("Invalid response format: 'data' field is missing.");
      }

      return Object.entries(responseData.data).map(([key, value]) => ({
        id: key,
        label: value as string,
      }));
    } catch (error) {
      console.error("Error fetching delete error detail reasons:", error);
      throw error;
    }
  },

  // Error Details Comments
  async updateErrorDetail(
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string | null
  ) {
    try {
      if (!quoteCheckId || !errorDetailsId) {
        throw new Error("Quote check ID and error details ID are required");
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}`,
        {
          method: "PATCH",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update comment error detail: ${response.status} ${response.statusText}`
        );
      }

      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return null;
      }

      const responseText = await response.text();

      if (!responseText.trim()) {
        return null;
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  async addErrorComment(
    quoteCheckId: string,
    errorDetailsId: string,
    comment: string
  ) {
    if (!comment.trim()) {
      throw new Error("Comment cannot be empty");
    }

    return this.updateErrorDetail(quoteCheckId, errorDetailsId, comment);
  },

  async removeErrorDetailComment(quoteCheckId: string, errorDetailsId: string) {
    return this.updateErrorDetail(quoteCheckId, errorDetailsId, null);
  },

  // Feedback Management
  async sendErrorFeedback(
    comment: string | null,
    errorDetailsId: string,
    quoteCheckId: string
  ) {
    try {
      if (!comment || !errorDetailsId || !quoteCheckId) {
        throw new Error(
          "Comment, error details ID, and quote check ID are required"
        );
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}/error_details/${errorDetailsId}/feedbacks`,
        {
          method: "POST",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to send feedback: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending feedback:", error);
      throw error;
    }
  },

  async sendGlobalFeedback(
    quoteCheckId: string,
    feedback: {
      comment: string;
      email: string | null;
      rating: Rating;
    }
  ) {
    try {
      if (!quoteCheckId) {
        throw new Error("Quote check ID is required");
      }

      const response = await fetch(
        `${getApiUrl()}/api/v1/quote_checks/${quoteCheckId}/feedbacks`,
        {
          method: "POST",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...feedback }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to send feedbacks: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending feedbacks:", error);
      throw error;
    }
  },
};

// Statistics Service
// TODO : Remove this service when the API Server Action migration is complete
export const statServiceToRemove = {
  async getStats() {
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/stats`, {
        headers: getHeaders(),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch stats: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};
