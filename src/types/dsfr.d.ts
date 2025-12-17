export interface DsfrGlobal {
  verbose: boolean;
  mode: string;
  start?: () => void;
}

declare global {
  interface Window {
    dsfr: DsfrGlobal;
  }
}
