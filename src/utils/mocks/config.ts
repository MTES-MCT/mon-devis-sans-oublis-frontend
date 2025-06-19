export const MOCK_CONFIG = {
  // Activation basée sur la variable d'environnement
  enabled: process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true",

  // Pour forcer l'activation même en production (utile pour démo)
  forceEnabled: process.env.NEXT_PUBLIC_FORCE_MOCKS === "true",

  // Logger quand un mock est utilisé
  logUsage: process.env.NODE_ENV === "development",

  // Délai pour simuler une vraie API (en ms)
  apiDelay: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || "500"),

  // Type de mock par défaut selon l'environnement
  defaultScenario: process.env.NEXT_PUBLIC_MOCK_SCENARIO || "valid",
};

// Helper pour vérifier si les mocks sont actifs
export const isMockEnabled = (): boolean => {
  return MOCK_CONFIG.enabled || MOCK_CONFIG.forceEnabled;
};

// Helper pour logger l'utilisation des mocks
export const logMockUsage = (mockName: string, data?: any) => {
  if (MOCK_CONFIG.logUsage && isMockEnabled()) {
    console.group(`🎭 MOCK UTILISÉ: ${mockName}`);
    console.log("📊 Data:", data);
    console.log("⚙️ Config:", MOCK_CONFIG);
    console.groupEnd();
  }
};

// Helper pour simuler un délai d'API
export const simulateApiDelay = async (): Promise<void> => {
  if (isMockEnabled() && MOCK_CONFIG.apiDelay > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_CONFIG.apiDelay));
  }
};

// Helper pour utiliser un mock de manière conditionnelle
export const useMockIf = <T>(
  mockData: T,
  realDataFn: () => Promise<T>
): Promise<T> => {
  if (isMockEnabled()) {
    return Promise.resolve(mockData);
  }
  return realDataFn();
};
