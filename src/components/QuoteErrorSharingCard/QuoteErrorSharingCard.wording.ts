export const QUOTE_ERROR_SHARING_WORDING = {
  button_copied_url: "Lien copié",
  button_copy_url: "Copier le lien",
  image_alt: "Image partagez les corrections du devis",
  image_src: "/images/documents/document-download.svg",
  getTitle: (isQuoteCase: boolean) =>
    isQuoteCase
      ? "Partagez les corrections du dossier"
      : "Partagez les corrections du devis",
  button_share_for_email: "Exporter en texte",
} as const;
