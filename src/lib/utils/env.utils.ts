export const isClient = (): boolean => {
  return typeof window !== "undefined";
};

export const isServer = (): boolean => {
  return typeof window === "undefined";
};

export const isDev = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const isProd = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === "test";
};

/**
 * Helper pour exécuter du code uniquement côté client
 */
export const runOnClient = (callback: () => void): void => {
  if (isClient()) {
    callback();
  }
};

/**
 * Helper pour exécuter du code uniquement côté serveur
 */
export const runOnServer = (callback: () => void): void => {
  if (isServer()) {
    callback();
  }
};
