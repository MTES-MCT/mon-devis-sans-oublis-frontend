export interface Gestes {
  id: string;
  intitule: string;
  valid: boolean;
}

export interface GesteGroup {
  group: string;
  values: string[];
}

export interface Metadata {
  aides: string[];
  gestes: GesteGroup[];
}
