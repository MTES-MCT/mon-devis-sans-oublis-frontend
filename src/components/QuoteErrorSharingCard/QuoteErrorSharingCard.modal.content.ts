import { ErrorDetails } from "@/types";

interface GenerateEmailContentOptions {
  dateAnalyse?: string;
  nomFichier?: string;
  gestes?: Array<{ id: string; intitule: string }>;
}

export const generateEmailContent = (
  errorsList: ErrorDetails[],
  options: GenerateEmailContentOptions = {}
): string => {
  const {
    dateAnalyse = new Date().toLocaleDateString("fr-FR"),
    nomFichier = "devis_analyse",
    gestes = [],
  } = options;

  const activeErrors = errorsList.filter((error) => !error.deleted);

  if (activeErrors.length === 0) {
    return "Aucune erreur à signaler.";
  }

  // Séparer les erreurs par catégorie
  const adminErrors = activeErrors.filter(
    (error) => error.category === "admin"
  );
  const technicalErrors = activeErrors.filter(
    (error) => error.category !== "admin"
  );

  // Header
  const header = `Bonjour,
Pour être conforme aux attendus des aides, voici les erreurs (détectées lors de l'analyse du ${dateAnalyse} du Devis ${nomFichier}) à corriger. En corrigeant ces erreurs maintenant, vous optimisez vos chances d'une instruction sans demandes complémentaires et vous gagnerez donc beaucoup de temps.

`;

  // Section Mentions administratives
  let adminSection = "";
  if (adminErrors.length > 0) {
    adminSection = `MENTIONS ADMINISTRATIVES
${adminErrors.map((error) => `• ${error.title}`).join("\n")}

`;
  }

  // Section Descriptif technique des gestes
  let technicalSection = "";
  if (technicalErrors.length > 0) {
    technicalSection = `DESCRIPTIF TECHNIQUE DES GESTES

`;

    // Grouper les erreurs techniques par geste_id
    const errorsByGeste = technicalErrors.reduce((acc, error) => {
      const gesteId = error.geste_id || "non_specifie";
      if (!acc[gesteId]) {
        acc[gesteId] = [];
      }
      acc[gesteId].push(error);
      return acc;
    }, {} as Record<string, ErrorDetails[]>);

    // Générer le contenu pour chaque geste
    Object.entries(errorsByGeste).forEach(([gesteId, errors]) => {
      // Trouver l'intitulé du geste
      const geste = gestes.find((g) => g.id === gesteId);
      const gesteIntitule = geste?.intitule || `Geste ${gesteId}`;

      technicalSection += `• ${gesteIntitule.toUpperCase()}

`;

      // Lister les erreurs pour ce geste
      errors.forEach((error) => {
        technicalSection += `   - ${error.title}`;
        if (error.solution) {
          technicalSection += ` → ${error.solution}`;
        }
        technicalSection += "\n";
      });

      technicalSection += "\n";
    });
  }

  return header + adminSection + technicalSection;
};
