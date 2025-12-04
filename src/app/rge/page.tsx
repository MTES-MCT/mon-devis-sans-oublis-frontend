import { Notice } from "@/components";
import RgePageClient from "@/page-sections/rge/RgePageClient";
import wording from "@/wording";

export default function Rge() {
  return (
    <>
      <Notice
        className="fr-notice--alert"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />
      <RgePageClient />
    </>
  );
}
