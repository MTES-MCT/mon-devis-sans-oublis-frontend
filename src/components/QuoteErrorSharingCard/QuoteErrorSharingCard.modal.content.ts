import { ErrorDetails, Gestes, QuoteCase, QuoteCheck, Category } from "@/types";
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

// Fonction pour générer l'en-tête pour un dossier
const generateCaseEmailHeader = (quoteCase: QuoteCase): string => {
  const dateAnalyse = new Date().toLocaleDateString("fr-FR");
  const idDossier = quoteCase.id || "Identifiant inconnu";

  return (
    QUOTE_ERROR_SHARING_MODAL_WORDING.getCaseEmailHeader(
      dateAnalyse,
      idDossier
    ) + "\n\n"
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

// Fonction pour séparer les erreurs par catégorie
const separateErrorsByCategory = (errors: ErrorDetails[]) => {
  const adminErrors = errors.filter(
    (error) => error.category === Category.ADMIN
  );
  const gestesErrors = errors.filter(
    (error) => error.category === Category.GESTES
  );
  const incoherenceErrors = errors.filter(
    (error) => error.category === Category.INCOHERENCE_DEVIS
  );

  return { adminErrors, gestesErrors, incoherenceErrors };
};

// Fonction pour générer la section d'incohérences
const generateIncoherenceSection = (
  incoherenceErrors: ErrorDetails[]
): string => {
  if (incoherenceErrors.length === 0) {
    return "";
  }

  const errorItems = incoherenceErrors
    .map((error) => `      <li>${error.title}</li>`)
    .join("\n");

  return `  <li><strong>Erreurs de cohérence entre devis</strong>
    <ul>
${errorItems}
    </ul>
  </li>
  <br>
`;
};

// Fonction pour générer le contenu d'un devis individuel
const generateQuoteSection = (quote: QuoteCheck, index: number): string => {
  if (!quote.error_details || quote.error_details.length === 0) {
    return "";
  }

  const activeErrors = getActiveErrors(quote.error_details);
  if (activeErrors.length === 0) {
    return "";
  }

  const { adminErrors, gestesErrors } = separateErrorsByCategory(activeErrors);

  const adminSection =
    adminErrors.length > 0 ? generateAdminSection(adminErrors) : "";
  const technicalSection =
    gestesErrors.length > 0
      ? generateTechnicalSection(gestesErrors, quote.gestes || [])
      : "";

  if (!adminSection && !technicalSection) {
    return "";
  }

  const sections = [adminSection, technicalSection].filter(
    (section) => section.length > 0
  );

  return `  <li><strong>Devis ${index + 1} - ${quote.filename}</strong>
    <ul>
${sections.join("")}    </ul>
  </li>
  <br>
`;
};

// Génère le contenu de l'email à partir des listes d'erreurs séparées (mode QuoteCheck)
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

// Génère le contenu de l'email pour un QuoteCase (dossier)
export const generateCaseEmailContent = (quoteCase: QuoteCase): string => {
  const header = generateCaseEmailHeader(quoteCase);

  // Erreurs du dossier lui-même
  const caseErrors = quoteCase.error_details
    ? getActiveErrors(quoteCase.error_details)
    : [];
  const { incoherenceErrors } = separateErrorsByCategory(caseErrors);

  // Section des incohérences du dossier
  const incoherenceSection = generateIncoherenceSection(incoherenceErrors);

  // Sections des devis
  const quoteSections = (quoteCase.quote_checks || [])
    .map((quote, index) => generateQuoteSection(quote, index))
    .filter((section) => section.length > 0);

  // Construction finale
  const allSections = [incoherenceSection, ...quoteSections].filter(
    (section) => section.length > 0
  );

  if (allSections.length === 0) {
    return header + `<p>${QUOTE_ERROR_SHARING_MODAL_WORDING.noErrors}</p>`;
  }

  return header + `<ul>\n${allSections.join("")}\n</ul>`;
};
