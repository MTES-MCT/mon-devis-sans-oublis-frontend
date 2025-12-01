// Constantes de tracking Matomo
export const MATOMO_EVENTS = {
  BUTTON_EXPORT_FOR_MAIL: "Bouton Exporter en texte",

  // TODO Mettre ici les autres événements Matomo exemples :
  //   LINK_HOMEPAGE: "Lien Page d'accueil",
  //   ACTION_FILE_UPLOAD: "Fichier Uploadé",
  //   ACTION_RESULT_VIEW: "Résultat Consulté",

  // Debug et tests
  DEBUG_TEST_EVENT: "Test Debug Event",
} as const;

export type MatomoEvent = (typeof MATOMO_EVENTS)[keyof typeof MATOMO_EVENTS];
