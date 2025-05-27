import { Category, ErrorDetails, Gestes } from "@/types";
import { QUOTE_ERROR_SHARING_MODAL_WORDING } from "./QuoteErrorSharingCard.modal.wordings";

// Filtre erreurs actives
const getActiveErrors = (adminErrorList: ErrorDetails[]): ErrorDetails[] => {
  return adminErrorList.filter((error) => !error.deleted);
};

// Catégorisation des erreurs
const categorizeErrors = (errors: ErrorDetails[]) => {
  const adminErrors = errors.filter(
    (error) => error.category === Category.ADMIN
  );
  const technicalErrors = errors.filter(
    (error) => error.category === Category.GESTES
  );

  return { adminErrors, technicalErrors };
};

// Génération de l'en-tête de l'email
const generateEmailHeader = (fileName?: string): string => {
  const dateAnalyse = new Date().toLocaleDateString("fr-FR");
  const nomFichier = fileName || QUOTE_ERROR_SHARING_MODAL_WORDING.file_unknown;
  return QUOTE_ERROR_SHARING_MODAL_WORDING.getEmailHeader(
    dateAnalyse,
    nomFichier
  );
};

// Génération de la section administrative
const generateAdminSection = (adminErrors: ErrorDetails[]): string => {
  if (adminErrors.length === 0) {
    return "";
  }

  return `• ${QUOTE_ERROR_SHARING_MODAL_WORDING.administrativeSection}
${adminErrors.map((error) => `    • ${error.title}`).join("\n")}

`;
};

// Groupe les erreurs techniques par geste
const groupErrorsByGeste = (
  technicalErrors: ErrorDetails[]
): Record<string, ErrorDetails[]> => {
  return technicalErrors.reduce((acc, error) => {
    const gesteId =
      error.geste_id || QUOTE_ERROR_SHARING_MODAL_WORDING.notSpecified;
    if (!acc[gesteId]) {
      acc[gesteId] = [];
    }
    acc[gesteId].push(error);
    return acc;
  }, {} as Record<string, ErrorDetails[]>);
};

// Génération de la section technique
const generateTechnicalSection = (
  technicalErrors: ErrorDetails[],
  gestes: Gestes[]
): string => {
  if (technicalErrors.length === 0) {
    return "";
  }

  let technicalSection = `• ${QUOTE_ERROR_SHARING_MODAL_WORDING.technicalSection}
`;

  const errorsByGeste = groupErrorsByGeste(technicalErrors);

  Object.entries(errorsByGeste).forEach(([gesteId, errors]) => {
    const geste = gestes.find((g) => g.id === gesteId);
    const gesteIntitule = geste?.intitule ? geste.intitule : `Geste ${gesteId}`;

    technicalSection += `   • ${gesteIntitule}
`;

    errors.forEach((error) => {
      technicalSection += `   => ${error.title}
`;
    });

    technicalSection += "\n";
  });

  return technicalSection;
};

// Génération du contenu de l'email
export const generateEmailContent = (
  adminErrorList: ErrorDetails[],
  gestes: Gestes[] = [],
  fileName?: string
): string => {
  const activeErrors = getActiveErrors(adminErrorList);

  if (activeErrors.length === 0) {
    return QUOTE_ERROR_SHARING_MODAL_WORDING.noErrors;
  }

  const { adminErrors, technicalErrors } = categorizeErrors(activeErrors);

  const header = generateEmailHeader(fileName);
  const adminSection = generateAdminSection(adminErrors);
  const technicalSection = generateTechnicalSection(technicalErrors, gestes);

  return header + adminSection + technicalSection;
};
