/**
 * Utilitaires pour la modal de partage des erreurs de devis
 */

// Fonction pour copier du HTML formaté dans le presse-papier
export const copyHTMLToClipboard = async (
  htmlContent: string
): Promise<boolean> => {
  try {
    // Méthode moderne avec ClipboardItem (supportée par les navigateurs récents)
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const textBlob = new Blob([htmlContent.replace(/<[^>]*>/g, "")], {
        type: "text/plain",
      });

      const clipboardItem = new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob,
      });

      await navigator.clipboard.write([clipboardItem]);
      return true;
    }

    // Méthode de fallback avec execCommand (dépréciée mais compatible)
    return copyHTMLFallback(htmlContent);
  } catch (error) {
    console.error("Erreur lors de la copie HTML:", error);
    // Fallback vers la copie de texte simple
    try {
      await navigator.clipboard.writeText(htmlContent);
      return true;
    } catch (fallbackError) {
      console.error("Erreur lors de la copie fallback:", fallbackError);
      return false;
    }
  }
};

// Fonction de fallback pour copier du HTML
const copyHTMLFallback = (htmlContent: string): boolean => {
  try {
    // Créer un élément temporaire invisible
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    tempDiv.style.opacity = "0";

    document.body.appendChild(tempDiv);

    // Sélectionner le contenu
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Copier
    const result = document.execCommand("copy");

    // Nettoyer
    selection?.removeAllRanges();
    document.body.removeChild(tempDiv);

    return result;
  } catch (error) {
    console.error("Erreur dans copyHTMLFallback:", error);
    return false;
  }
};

// Fonction pour gérer la copie avec gestion d'état
export const handleCopyToClipboard = async (
  htmlContent: string,
  setIsCopied: (value: boolean) => void
): Promise<void> => {
  try {
    const success = await copyHTMLToClipboard(htmlContent);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      // Si la copie HTML échoue, copier le texte brut
      await navigator.clipboard.writeText(htmlContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  } catch (error) {
    console.error("Erreur lors de la copie:", error);
  }
};
