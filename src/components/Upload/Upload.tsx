"use client";

import { useState, useRef } from "react";

import wording from "@/wording";

const ALLOWED_TYPES = ["application/pdf", "image/*"];

export interface UploadProps {
  maxFileSize: number; // in MB
  onFileUpload: (file: File) => void;
  setError: (error: string | null) => void;
}

const Upload: React.FC<UploadProps> = ({
  maxFileSize,
  onFileUpload,
  setError,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // TODO: Fetch file types from API
  const fileTypes = "PDF ou image";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateFile(files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      validateFile(event.dataTransfer.files[0]);
    }
  };

  const validateFile = (file: File) => {
    setUploadedFile(file);

    if (file.size > maxFileSize * 1024 * 1024) {
      const error = wording.components.upload.error_file_size
        .replace("{fileTypes}", fileTypes)
        .replace("{maxFileSize}", maxFileSize.toString());
      setLocalError(error);
      setError(error);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (
        !ALLOWED_TYPES.some((type) =>
          file.type.startsWith(type.replace(/\/\*$/, "/"))
        )
      ) {
        const error = wording.components.upload.error_file_type.replace(
          "{fileTypes}",
          fileTypes
        );
        setLocalError(error);
        setError(error);
        return;
      }

      setLocalError(null);
      setError(null);
      onFileUpload(file);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      className={`fr-upload-group border-blue rounded-lg p-4 cursor-pointer transition ${
        isDragging ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"
      }`}
      data-testid="upload-area"
      onClick={() => inputRef.current?.click()}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="fr-label cursor-pointer" htmlFor="file-upload">
        {wording.components.upload.label}
        <span data-testid="upload-description" className="fr-hint-text">
          {wording.components.upload.description
            .replace("{fileTypes}", fileTypes)
            .replace("{maxFileSize}", maxFileSize.toString())}
        </span>
      </label>
      <span className="flex flex-row gap-2 items-center mt-4 pb-0! mb-0!">
        <p
          className="mb-0! rounded-lg p-2 text-sm!"
          data-testid="upload-button"
          onMouseDown={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--background-contrast-grey-active)")
          }
          onMouseUp={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--background-contrast-grey-hover)")
          }
          style={{
            backgroundColor: isHovered
              ? "var(--background-contrast-grey-hover)"
              : "var(--background-contrast-grey)",
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          {wording.components.upload.select_file}
        </p>
        <p data-testid="upload-file-name" className="text-sm! mb-0!">
          {uploadedFile
            ? uploadedFile.name
            : wording.components.upload.none_selected_file}
        </p>
      </span>
      <input
        accept='{ALLOWED_TYPES.join(",")}'
        data-testid="file-upload"
        id="file-upload"
        name="file-upload"
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
      {localError && (
        <p
          className="fr-error-text"
          data-testid="upload-error-message"
          id="file-upload-with-error-desc-error"
        >
          {localError}
        </p>
      )}
    </div>
  );
};

export default Upload;
