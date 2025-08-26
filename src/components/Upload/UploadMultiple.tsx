"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const ALLOWED_TYPES = ["application/pdf"];
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAXIMUM_FILES_COUNT = 20;

export interface UploadMultipleProps {
  maxFileSize: number; // in MB
  onFileUpload: (files: File[]) => void;
  setError: (error: string | null) => void;
}

interface FileStatus {
  file: File;
  isValid: boolean;
  error?: string;
}

const UploadMultiple: React.FC<UploadMultipleProps> = ({
  maxFileSize,
  onFileUpload,
  setError,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileStatus[]>([]);
  const [hasExceededLimit, setHasExceededLimit] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateFiles(Array.from(files));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      validateFiles(Array.from(event.dataTransfer.files));
    }
  };

  const validateFiles = (newFiles: File[]) => {
    // Vérifier si on dépasse la limite avec les nouveaux fichiers
    const wouldExceedLimit =
      uploadedFiles.length + newFiles.length > MAXIMUM_FILES_COUNT;

    if (wouldExceedLimit) {
      newFiles = newFiles.slice(0, MAXIMUM_FILES_COUNT - uploadedFiles.length);
      setHasExceededLimit(true);
    } else {
      setHasExceededLimit(false);
    }

    const fileStatuses: FileStatus[] = [];

    newFiles.forEach((file) => {
      let isValid = true;
      let error = "";

      // Vérifier la taille
      if (file.size > maxFileSize * 1024 * 1024) {
        isValid = false;
        error = `Taille trop importante (max ${maxFileSize} Mo)`;
      }

      // Vérifier le type
      if (
        !ALLOWED_TYPES.includes(file.type) &&
        !ALLOWED_IMAGE_TYPES.includes(file.type)
      ) {
        isValid = false;
        error = error
          ? `${error} et format non supporté`
          : "Format non supporté (PDF et image uniquement)";
      }

      fileStatuses.push({
        file,
        isValid,
        error: isValid ? undefined : error,
      });
    });

    // Ajouter les nouveaux fichiers aux existants
    setUploadedFiles([...uploadedFiles, ...fileStatuses]);

    // Transmettre seulement les fichiers valides (nouveaux + existants)
    const allValidFiles = [...uploadedFiles, ...fileStatuses]
      .filter((status) => status.isValid)
      .map((status) => status.file);

    if (allValidFiles.length > 0) {
      onFileUpload(allValidFiles);
      setError(null);
    } else {
      setError("Aucun fichier valide");
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  // Fonction pour supprimer un fichier
  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = uploadedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setUploadedFiles(updatedFiles);
    setHasExceededLimit(false);

    // Mettre à jour les fichiers valides transmis au parent
    const validFiles = updatedFiles
      .filter((status) => status.isValid)
      .map((status) => status.file);

    // Notification du parent dans tous les cas
    onFileUpload(validFiles);

    // Gestion erreurs
    if (updatedFiles.length === 0) {
      setError(null);
    } else if (validFiles.length === 0) {
      setError("Aucun fichier valide");
    } else {
      setError(null);
    }
  };

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);

    if (mb < 0.1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(0)} Ko`;
    }

    return `${mb.toFixed(1)} Mo`;
  };

  // Calculer les statistiques des fichiers
  const totalFiles = uploadedFiles.length;
  const validFiles = uploadedFiles.filter((status) => status.isValid);
  const invalidFiles = uploadedFiles.filter((status) => !status.isValid);
  const validCount = validFiles.length;
  const invalidCount = invalidFiles.length;

  return (
    <div>
      {/* Notice - Info */}
      <div className="mb-4">
        <p
          className="text-sm mb-0"
          style={{ color: "var(--text-default-info)" }}
        >
          <span
            className="fr-icon-info-fill fr-icon--sm mr-2"
            aria-hidden="true"
          ></span>
          Les devis soumis restent strictement confidentiels.{" "}
          <Link
            href="/mentions-legales"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-default-info)" }}
            className="underline"
          >
            En savoir plus
          </Link>
          .
        </p>
      </div>

      {/* Zone d'upload */}
      <div
        className="border border-dashed rounded-lg transition-colors cursor-pointer"
        style={{
          borderColor: isDragging
            ? "var(--border-action-high-blue-france)"
            : "var(--border-action-high-blue-france)",
          backgroundColor: isDragging
            ? "var(--background-contrast-blue-france)"
            : "transparent",
        }}
        data-testid="upload-area"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        {/* Conteneur flex centré */}
        <div className="flex flex-col items-center justify-center p-8">
          {/* Bouton arrondi avec icône */}
          <div className="mb-4">
            <button
              type="button"
              className="rounded-full w-12 h-12 flex items-center justify-center fr-icon-upload-fill"
              style={{
                backgroundColor: "var(--background-action-high-blue-france)",
                color: "var(--text-inverted-blue-france)",
              }}
              onClick={handleUploadClick}
              data-testid="upload-button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--background-action-high-blue-france-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--background-action-high-blue-france)";
              }}
            ></button>
          </div>

          {/* Titre */}
          <div
            className="text-center text-[20px] font-medium mb-4"
            style={{ color: "var(--text-default-grey)" }}
          >
            {totalFiles > 0 ? (
              totalFiles === 1 ? (
                uploadedFiles[0].file.name
              ) : (
                `${totalFiles} fichiers sélectionnés`
              )
            ) : (
              <>
                Glissez et déposez vos devis ou{" "}
                <span className="underline cursor-pointer">
                  parcourez vos dossiers
                </span>
              </>
            )}
          </div>

          {/* Sous-titre */}
          <div
            className="text-[14px] text-center mb-4"
            style={{ color: "var(--text-mention-grey)" }}
          >
            {`Taille maximale : ${maxFileSize} Mo. Formats supportés : pdf ou image. ${MAXIMUM_FILES_COUNT} devis maximum`}
          </div>

          {/* Messages de succès */}
          {validCount > 0 && invalidCount <= 0 && !hasExceededLimit && (
            <div
              className="text-[14px] text-center mb-2"
              style={{ color: "var(--text-default-success)" }}
            >
              <span
                className="fr-icon-success-fill mr-2"
                aria-hidden="true"
              ></span>
              {validCount === 1
                ? "1 fichier correctement ajouté"
                : `${validCount} fichiers correctement ajoutés`}
            </div>
          )}

          {/* Messages d'erreur */}
          {(invalidCount > 0 || hasExceededLimit) && (
            <div
              className="text-[14px] text-center"
              style={{ color: "var(--text-default-error)" }}
            >
              <span
                className="fr-icon-error-fill mr-2"
                aria-hidden="true"
              ></span>
              {hasExceededLimit
                ? "Vous avez dépassé le nombre maximal de devis autorisés (20), certains n'ont pas été ajoutés."
                : totalFiles === 1
                  ? "Le devis comporte une erreur"
                  : `Sur ${totalFiles} devis importés, ${invalidCount} ${invalidCount === 1 ? "comporte" : "comportent"} des erreurs`}
            </div>
          )}
        </div>

        {/* Input file caché */}
        <input
          accept={[...ALLOWED_TYPES, ...ALLOWED_IMAGE_TYPES].join(",")}
          data-testid="file-upload"
          id="file-upload"
          name="file-upload"
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          multiple
        />
      </div>

      {/* Container des tags dynamiques */}
      <div className="flex flex-wrap gap-2 mb-4 mt-4">
        {uploadedFiles.map((fileStatus, index) =>
          fileStatus.isValid ? (
            <div
              key={index}
              className="fr-tag fr-tag--dismiss fr-background-contrast--blue-france fr-text-action-high--blue-france"
            >
              <span className="fr-tag__label">
                {fileStatus.file.name} - {formatFileSize(fileStatus.file.size)}
              </span>
              <button
                className="fr-tag__dismiss fr-ml-2v"
                aria-label={`Retirer ${fileStatus.file.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              >
                <span
                  className="fr-icon-close-line fr-icon--sm"
                  aria-hidden="true"
                ></span>
              </button>
            </div>
          ) : null
        )}
      </div>

      {/* Détail des erreurs de fichiers */}
      {invalidFiles.length > 0 && (
        <div className="mt-8">
          <div className="font-bold">
            {`${invalidFiles.length} ${invalidFiles.length === 1 ? "erreur détectée" : "erreurs détectées"}`}
          </div>
          <div
            className="text-[14px] mb-4"
            style={{ color: "var(--text-mention-grey)" }}
          >
            Vous pouvez les corriger ou lancer l'analyse avec les devis valides
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((fileStatus, index) =>
              !fileStatus.isValid ? (
                <div
                  key={index}
                  className="fr-tag fr-tag--dismiss fr-background-contrast--red-marianne fr-text-action-high--red-marianne"
                  data-testid={`file-error-${index}`}
                >
                  <span className="fr-tag__label">
                    {fileStatus.file.name} - {fileStatus.error}
                  </span>
                  <button
                    className="fr-tag__dismiss fr-ml-2v"
                    aria-label={`Retirer ${fileStatus.file.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <span
                      className="fr-icon-close-line fr-icon--sm"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMultiple;
