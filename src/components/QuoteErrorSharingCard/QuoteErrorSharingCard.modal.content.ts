import { ErrorDetails, Gestes } from "@/types";

export const generateEmailContent = (
  adminErrorList: ErrorDetails[],
  gestes: Gestes[] = [],
  fileName?: string
): string => {
  const dateAnalyse = new Date().toLocaleDateString("fr-FR");
  const nomFichier = `${fileName || "Fichier inconnu"}`;

  const activeErrors = adminErrorList.filter((error) => !error.deleted);

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
    adminSection = `• Mentions administratives
${adminErrors.map((error) => `    • ${error.title}`).join("\n")}

`;
  }

  // Section Descriptif technique des gestes
  let technicalSection = "";
  if (technicalErrors.length > 0) {
    technicalSection = `• Descriptif technique des gestes
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
      const gesteIntitule = geste?.intitule
        ? `${geste.intitule}`
        : `Geste ${gesteId}`;
      technicalSection += `   • ${gesteIntitule.toUpperCase()}
`;

      // Lister les erreurs pour ce geste
      errors.forEach((error) => {
        technicalSection += `   => ${error.title}`;
        if (error.solution) {
          technicalSection += ` => ${error.solution}`;
        }
        technicalSection += "\n";
      });

      technicalSection += "\n";
    });
  }

  return header + adminSection + technicalSection;
};
