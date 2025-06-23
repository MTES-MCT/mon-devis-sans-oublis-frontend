export const MOCK_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true",
  delay: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || "300"),
  logUsage: process.env.NODE_ENV === "development",
};

// IDs de test qui activent automatiquement les mocks
export const TEST_IDS = {
  // Devis valides
  QUOTE_VALID: "test-devis-valide",
  QUOTE_VALID_2: "test-devis-valide-2",

  // Devis invalides
  QUOTE_INVALID: "test-devis-invalide",
  QUOTE_INVALID_2: "test-devis-invalide-2",

  // Dossiers valides
  CASE_VALID: "test-dossier-valide",
  CASE_VALID_2: "test-dossier-valide-2",

  // Dossiers invalides
  CASE_INVALID: "test-dossier-invalide",
  CASE_INVALID_2: "test-dossier-invalide-2",
} as const;

// Helper simple pour vérifier si c'est un ID de test
export const isTestId = (id: string): boolean => {
  return (Object.values(TEST_IDS) as readonly string[]).includes(id);
};

// Helper pour savoir si on doit utiliser les mocks
export const shouldUseMock = (id?: string): boolean => {
  return MOCK_CONFIG.enabled || (!!id && isTestId(id));
};

// Helper pour logger (optionnel)
export const logMock = (name: string, id: string) => {
  if (MOCK_CONFIG.logUsage) {
    console.log(`🎭 Mock utilisé: ${name} avec ID: ${id}`);
  }
};

// Helper pour simuler le délai
export const delay = () => {
  if (MOCK_CONFIG.delay > 0) {
    return new Promise((resolve) => setTimeout(resolve, MOCK_CONFIG.delay));
  }
  return Promise.resolve();
};
