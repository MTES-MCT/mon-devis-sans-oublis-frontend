/**
 * Supprime l'extension d'un nom de fichier
 * @param filename - Le nom du fichier avec extension
 * @returns Le nom du fichier sans extension
 *
 * @example
 * removeFileExtension("document.pdf") // "document"
 * removeFileExtension("mon-devis-test.docx") // "mon-devis-test"
 * removeFileExtension("fichier") // "fichier" (pas d'extension)
 * removeFileExtension("fichier.backup.pdf") // "fichier.backup"
 */
export function removeFileExtension(filename: string): string {
  if (!filename || typeof filename !== "string") {
    return filename;
  }

  const lastDotIndex = filename.lastIndexOf(".");

  // Si pas de point ou point en première position, retourner le nom complet
  if (lastDotIndex <= 0) {
    return filename;
  }

  return filename.substring(0, lastDotIndex);
}

/**
 * Obtient l'extension d'un fichier
 * @param filename - Le nom du fichier
 * @returns L'extension du fichier (avec le point)
 *
 * @example
 * getFileExtension("document.pdf") // ".pdf"
 * getFileExtension("mon-devis.docx") // ".docx"
 * getFileExtension("fichier") // ""
 */
export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== "string") {
    return "";
  }

  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex <= 0) {
    return "";
  }

  return filename.substring(lastDotIndex);
}
