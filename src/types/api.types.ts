export interface ApiResponse<T = unknown> {
  data?: T;
  [key: string]: unknown;
}

export interface MultiUploadResult<T> {
  successful: T[];
  failed: unknown[];
  totalCount: number;
  successCount: number;
  failureCount: number;
}

export interface MultiUploadResultWithCase<T> extends MultiUploadResult<T> {
  quoteCaseId: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "message" in error;
}
