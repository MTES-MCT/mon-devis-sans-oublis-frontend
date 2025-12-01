export interface DataCheckResult {
  error_details?: Array<{
    code: string;
  }> | null;
  valid?: boolean | null;
}

export interface AdemeResult {
  siret: string;
  nom_entreprise: string;
  adresse: string;
  code_postal: string;
  commune: string;
  latitude?: number;
  longitude?: number;
  telephone: string;
  email: string;
  site_internet: string;
  code_qualification: string;
  nom_qualification: string;
  url_qualification: string;
  nom_certificat: string;
  domaine: string;
  meta_domaine: string;
  organisme: string;
  particulier: boolean;
  lien_date_debut: string;
  lien_date_fin: string;
}

export interface DataCheckRgeResult extends DataCheckResult {
  results?: AdemeResult[] | null;
}

export interface CheckRGEParams {
  siret: string;
  rge?: string;
  gestes: string[];
  date?: string;
}
