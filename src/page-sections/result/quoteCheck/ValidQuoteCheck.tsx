import {
  Alert,
  AlertType,
  Badge,
  BadgeSize,
  BadgeVariant,
  Confetti,
} from "@/components";
import QuoteLaunchAnalysisCard from "@/components/QuoteLaunchAnalysisCard/QuoteLaunchAnalysisCard";
import wording from "@/wording";

interface ValidQuoteCheckProps {
  analysisDate: string | null;
  uploadedFileName: string;
}

export default function ValidQuoteCheck({
  analysisDate,
  uploadedFileName,
}: ValidQuoteCheckProps) {
  return (
    <>
      <Confetti />
      <section className="fr-container fr-gap-8">
        <span className="flex flex-col md:flex-row items-center justify-between fr-mb-2w">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center">
              <h1 className="mb-0! text-center md:text-left">
                {wording.page_upload_id.title}
              </h1>
            </div>
          </div>
          {analysisDate !== null && (
            <p className="bg-[var(--background-default-grey-hover)] mt-2! md:mt-0! mb-0! p-2 rounded-sm text-sm!">
              {wording.page_upload_id.analysis_date.replace(
                "{date}",
                analysisDate
              )}
            </p>
          )}
        </span>
        <div className="flex gap-4 fr-mb-4w justify-center md:justify-start">
          {uploadedFileName && (
            <Badge
              label={uploadedFileName}
              size={BadgeSize.SMALL}
              variant={BadgeVariant.BLUE_DARK}
            />
          )}
        </div>
        <Alert
          className="fr-pr-2w font-bold w-fit"
          description={wording.page_upload_id.quotation_alert_ok}
          type={AlertType.SUCCESS}
        />
      </section>
      <section className="fr-container fr-mt-10w">
        <QuoteLaunchAnalysisCard className="mb-16 mt-8" />
      </section>
    </>
  );
}
