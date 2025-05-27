export const QUOTE_ERROR_SHARING_MODAL_WORDING = {
  file_unknown: "Fichier inconnu",
  getEmailHeader: (dateAnalyse: string, nomFichier: string) => `Bonjour,

Pour être conforme aux attendus des aides, voici les erreurs (détectées lors de l'analyse du ${dateAnalyse} du Devis ${nomFichier}) à corriger. En corrigeant ces erreurs maintenant, vous optimisez vos chances d'une instruction sans demandes complémentaires et vous gagnerez donc beaucoup de temps.


`,
  administrativeSection: "Mentions administratives",
  technicalSection: "Descriptif technique des gestes",
  notSpecified: "Non spécifié",
  noErrors: "Aucune erreur à signaler.",
} as const;
