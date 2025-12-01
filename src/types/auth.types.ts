export interface AuthCheckResult {
  success: boolean;
  status: number;
  message?: string;
  data?: unknown;
}
