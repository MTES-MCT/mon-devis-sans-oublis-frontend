// Interface API Crisp
interface CrispAPI {
  push: (
    command:
      | ["safe", boolean]
      | [string, string]
      | [string, string, [string, string]]
      | [string, string, [string]]
  ) => void;
}

interface WindowWithCrisp extends Window {
  $crisp?: CrispAPI;
  CRISP_WEBSITE_ID?: string;
}

declare global {
  interface Window {
    $crisp?: CrispAPI;
    CRISP_WEBSITE_ID?: string;
  }
}

export type { WindowWithCrisp, CrispAPI };
