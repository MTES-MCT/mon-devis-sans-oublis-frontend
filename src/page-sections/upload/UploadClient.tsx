"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Alert,
  AlertType,
  DropdownCheckboxList,
  Link,
  LinkVariant,
  Notice,
  Upload,
} from "@/components";
import { Metadata, Profile } from "@/types";
import wording from "@/wording";
import { quoteService } from "@/lib/client/apiWrapper";

export const FILE_ERROR = "file_error";

export default function UploadClient({
  metadata,
  profile,
}: {
  metadata: Metadata;
  profile: string;
}) {
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

  const handleFileUpload = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    setFileError(null);
  }, []);

  const handleAidesChange = (values: string[]) => {
    setSelectedAides(values);
  };

  const handleGestesChange = (values: string[]) => {
    setSelectedGestes(values);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (isSubmitting || isPending) return;

    if (!file) {
      setFileError("Please upload a file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await quoteService.uploadQuote(
        file,
        { aides: selectedAides, gestes: selectedGestes },
        profile as Profile
      );

      startTransition(() => {
        if (profile === Profile.CONSEILLER) {
          router.push(`/${profile}/televersement/${data.id}/modifier`);
        } else {
          router.push(`/${profile}/televersement/${data.id}`);
        }
      });
    } catch (error) {
      console.error("Error during upload:", error);
      setFileError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    if (error === FILE_ERROR) {
      const errorMessage = message
        ? decodeURIComponent(message)
        : wording.upload.error.notice.description;
      setFileUploadedError(errorMessage);
      router.replace(`/${profile}/televersement`);
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
      <>
        <Upload
          maxFileSize={50} // TODO: get from API
          onFileUpload={handleFileUpload}
          setError={setFileError}
        />
        <Alert
          className="fr-mb-8w fr-mt-4w"
          description={wording.upload.alert.description}
          moreDescription={wording.upload.alert.more_info}
          type={AlertType.INFO}
        />
        <h2>{wording.upload.subtitle}</h2>
        {metadata.gestes && (
          <DropdownCheckboxList
            label={wording.upload.select_gestes}
            multiple={true}
            onChange={handleGestesChange}
            optionnal={true}
            options={metadata.gestes.flatMap((group) =>
              group.values.map((value) => ({
                id: value,
                label: value,
                group: group.group,
              }))
            )}
          />
        )}
        {metadata.aides && (
          <DropdownCheckboxList
            label={wording.upload.select_aides}
            multiple={true}
            onChange={handleAidesChange}
            optionnal={true}
            options={metadata.aides}
          />
        )}
        <div className="fr-mt-8w flex justify-center">
          <ul className="fr-btns-group fr-btns-group--inline-sm">
            <li>
              <Link
                href={wording.upload.link_back.href}
                label={wording.upload.link_back.label}
                variant={LinkVariant.SECONDARY}
              />
            </li>
            <li>
              <button
                className="fr-btn fr-text--lg"
                disabled={isSubmitting || !file || fileError ? true : false}
                onClick={handleSubmit}
              >
                {isSubmitting
                  ? wording.upload.button_send_quote
                  : wording.upload.button_check_quote}
              </button>
            </li>
          </ul>
        </div>
      </>
    </>
  );
}
