import { Category, ErrorDetails, Gestes } from "@/types";
import { QUOTE_ERROR_SHARING_MODAL_WORDING } from "./QuoteErrorSharingCard.modal.content.wordings";

// Fonction pour filtrer les erreurs actives
const getActiveErrors = (adminErrorList: ErrorDetails[]): ErrorDetails[] => {
  return adminErrorList.filter((error) => !error.deleted);
};

// Fonction pour séparer les erreurs par catégorie
const categorizeErrors = (errors: ErrorDetails[]) => {
  const adminErrors = errors.filter(
    (error) => error.category === Category.ADMIN
  );
  const technicalErrors = errors.filter(
    (error) => error.category === Category.GESTES
  );

  return { adminErrors, technicalErrors };
};

// Fonction pour générer l'en-tête de l'email en HTML
const generateEmailHeader = (fileName?: string): string => {
  const dateAnalyse = new Date().toLocaleDateString("fr-FR");
  const nomFichier = fileName || QUOTE_ERROR_SHARING_MODAL_WORDING.file_unknown;

  return (
    QUOTE_ERROR_SHARING_MODAL_WORDING.getEmailHeader(dateAnalyse, nomFichier) +
    "\n\n"
  );
};

// Fonction pour générer la section des mentions administratives en HTML
const generateAdminSection = (adminErrors: ErrorDetails[]): string => {
  if (adminErrors.length === 0) {
    return "";
  }

  const errorItems = adminErrors
    .map((error) => `      <li>${error.title}</li>`)
    .join("\n");

  return `  <li><strong>${QUOTE_ERROR_SHARING_MODAL_WORDING.administrativeSection}</strong>
    <ul>
${errorItems}
    </ul>
  </li>
  <br>
`;
};

// Fonction pour grouper les erreurs techniques par geste
const groupErrorsByGeste = (
  technicalErrors: ErrorDetails[]
): Record<string, ErrorDetails[]> => {
  return technicalErrors.reduce(
    (errorGroups, error) => {
      const gesteId =
        error.geste_id || QUOTE_ERROR_SHARING_MODAL_WORDING.notSpecified;
      if (!errorGroups[gesteId]) {
        errorGroups[gesteId] = [];
      }
      errorGroups[gesteId].push(error);
      return errorGroups;
    },
    {} as Record<string, ErrorDetails[]>
  );
};

// Fonction pour générer la section technique en HTML
const generateTechnicalSection = (
  technicalErrors: ErrorDetails[],
  gestes: Gestes[]
): string => {
  if (technicalErrors.length === 0) {
    return "";
  }

  const errorsByGeste = groupErrorsByGeste(technicalErrors);

  const gestesSections = Object.entries(errorsByGeste)
    .map(([gesteId, errors]) => {
      const geste = gestes.find((g) => g.id === gesteId);
      const gesteIntitule = geste?.intitule
        ? geste.intitule
        : `${QUOTE_ERROR_SHARING_MODAL_WORDING.notSpecified} ${gesteId}`;

      const errorItems = errors
        .map((error) => `        <li>${error.title}</li>`)
        .join("\n");

      return `      <li><strong>${gesteIntitule}</strong>
        <ul>
${errorItems}
        </ul>
      </li>`;
    })
    .join("\n      <br>\n");

  return `  <li><strong>${QUOTE_ERROR_SHARING_MODAL_WORDING.technicalSection}</strong>
    <ul>
${gestesSections}
    </ul>
  </li>
  <br>
`;
};

// Génère le contenu de l'email à partir de la liste d'erreurs administratives, des gestes et du nom du fichier
export const generateEmailContent = (
  adminErrorList: ErrorDetails[],
  gestes: Gestes[] = [],
  fileName?: string
): string => {
  const activeErrors = getActiveErrors(adminErrorList);

  if (activeErrors.length === 0) {
    return `<p>${QUOTE_ERROR_SHARING_MODAL_WORDING.noErrors}</p>`;
  }

  const { adminErrors, technicalErrors } = categorizeErrors(activeErrors);

  const header = generateEmailHeader(fileName);
  const adminSection = generateAdminSection(adminErrors);
  const technicalSection = generateTechnicalSection(technicalErrors, gestes);

  // Construction de la liste principale
  const sections = [adminSection, technicalSection].filter(
    (section) => section.length > 0
  );

  if (sections.length === 0) {
    return header + `<p>${QUOTE_ERROR_SHARING_MODAL_WORDING.noErrors}</p>`;
  }

  return header + `<ul>\n${sections.join("")}\n</ul>`;
};
