"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Alert, AlertType, Notice, Upload } from "@/components";
import { Profile } from "@/types";
import wording from "@/wording";
import { quoteService } from "@/lib/client/apiWrapper";
import { typeRenovationStorage } from "@/lib/utils/typeRenovationStorage.utils";

export const FILE_ERROR = "file_error";

interface UploadClientProps {
  profile: string;
  onStateChange?: (canSubmit: boolean, isSubmitting: boolean) => void;
}

export default function UploadClient({
  profile,
  onStateChange,
}: UploadClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileUploadedError, setFileUploadedError] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  // Récupération des données metadata au montage
  useEffect(() => {
    const savedData = typeRenovationStorage.load();
    setSelectedAides(savedData.aides);
    setSelectedGestes(savedData.gestes);
  }, []);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    setFileError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || isPending) return;

    if (!file) {
      setFileError("Please upload a file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await quoteService.uploadQuoteCheck(
        file,
        { aides: selectedAides, gestes: selectedGestes },
        profile as Profile
      );

      startTransition(() => {
        router.push(`/${profile}/devis/${data.id}`);
      });
    } catch (error) {
      console.error("Error during upload:", error);
      setFileError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isPending,
    file,
    selectedAides,
    selectedGestes,
    profile,
    router,
    startTransition,
  ]);

  // Exposer la fonction handleSubmit et l'état au parent
  useEffect(() => {
    const canSubmit = !isSubmitting && !!file && !fileError;
    onStateChange?.(canSubmit, isSubmitting);
    window.uploadClientSubmit = handleSubmit;
  }, [file, fileError, isSubmitting, onStateChange, handleSubmit]);

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    if (error === FILE_ERROR) {
      const errorMessage = message
        ? decodeURIComponent(message)
        : wording.upload.error.notice.description;
      setFileUploadedError(errorMessage);
    }
  }, [router, profile, searchParams]);

  useEffect(() => {
    if (fileUploadedError) {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 0);
    }
  }, [fileUploadedError]);

  return (
    <>
      {fileUploadedError && (
        <div className="absolute top-[186px] left-0 right-0 z-50">
          <Notice
            buttonClose={true}
            className="fr-notice--alert"
            description={fileUploadedError}
            title={wording.upload.error.notice.title}
          />
        </div>
      )}

      <Upload
        maxFileSize={50}
        onFileUpload={handleFileUpload}
        setError={setFileError}
      />
      <Alert
        className="fr-mb-8w fr-mt-4w"
        description={wording.upload.alert.description}
        moreDescription={wording.upload.alert.more_info}
        type={AlertType.INFO}
      />
    </>
  );
}
