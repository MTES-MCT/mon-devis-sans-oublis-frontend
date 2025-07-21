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

export interface CheckRGEGesteTypesOption {
  label: string;
  value: string;
  group: string;
}

export interface CheckRGEGesteTypes {
  options: CheckRGEGesteTypesOption[];
}
