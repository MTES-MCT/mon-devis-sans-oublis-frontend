import { ErrorDetails, Gestes } from "@/types";
import { QUOTE_ERROR_SHARING_MODAL_WORDING } from "./QuoteErrorSharingCard.modal.content.wordings";

// Fonction pour filtrer les erreurs actives (non supprimées)
const getActiveErrors = (errorList: ErrorDetails[]): ErrorDetails[] => {
  return errorList.filter((error) => !error.deleted);
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

// Fonction pour générer la section des erreurs administratives en HTML
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
  gestesErrors: ErrorDetails[]
): Record<string, ErrorDetails[]> => {
  return gestesErrors.reduce(
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
  gestesErrors: ErrorDetails[],
  gestes: Gestes[]
): string => {
  if (gestesErrors.length === 0) {
    return "";
  }

  const errorsByGeste = groupErrorsByGeste(gestesErrors);

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

// Génère le contenu de l'email à partir des listes d'erreurs séparées
export const generateEmailContent = (
  adminErrorList: ErrorDetails[],
  gestesErrorList: ErrorDetails[],
  gestes: Gestes[] = [],
  fileName?: string
): string => {
  // Filtre les erreurs actives pour chaque catégorie
  const activeAdminErrors = getActiveErrors(adminErrorList);
  const activeGestesErrors = getActiveErrors(gestesErrorList);

  // Vérifie s'il y a des erreurs à afficher
  if (activeAdminErrors.length === 0 && activeGestesErrors.length === 0) {
    return `<p>${QUOTE_ERROR_SHARING_MODAL_WORDING.noErrors}</p>`;
  }

  // Génère chaque section
  const header = generateEmailHeader(fileName);
  const adminSection = generateAdminSection(activeAdminErrors);
  const technicalSection = generateTechnicalSection(activeGestesErrors, gestes);

  // Construction de la liste principale avec les sections non vides
  const sections = [adminSection, technicalSection].filter(
    (section) => section.length > 0
  );

  // Retourne le contenu final
  if (sections.length === 0) {
    return header + `<p>${QUOTE_ERROR_SHARING_MODAL_WORDING.noErrors}</p>`;
  }

  return header + `<ul>\n${sections.join("")}\n</ul>`;
};
