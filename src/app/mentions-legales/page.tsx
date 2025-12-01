import { Notice } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function MentionsLegales() {
  return (
    <>
      <Notice
        className="fr-notice--info"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />

      <section className="fr-container-fluid fr-py-10w">
        <div className="fr-container [&_h2]:text-[var(--text-title-grey)]! [&_h2]:mt-10!">
          <h1 className="fr-mb-6w text-[var(--text-title-grey)]!">
            {wording.legal_notice.title}
          </h1>
          <h2>{wording.legal_notice.editor}</h2>
          <p>{wording.legal_notice.editor_description}</p>
          <p>{wording.legal_notice.editor_description_2}</p>
          <p>{wording.legal_notice.editor_address}</p>
          <p>{wording.legal_notice.editor_address_2}</p>
          <h2>{wording.legal_notice.publication_director}</h2>
          <p>{wording.legal_notice.publication_director_description}</p>
          <h2>{wording.legal_notice.hosting_provider}</h2>
          <p>
            {richTextParser(wording.legal_notice.hosting_provider_description)}
          </p>
          <h2>{wording.legal_notice.terms_of_use}</h2>
          <p>{richTextParser(wording.legal_notice.terms_of_use_description)}</p>
          <p>{wording.legal_notice.terms_of_use_description_2}</p>
          <h2>{wording.legal_notice.statistics}</h2>
          <p>{wording.legal_notice.statistics_description}</p>
          <h2>{wording.legal_notice.processing_quote}</h2>
          <p>{wording.legal_notice.processing_quote_description}</p>
          <p className="fr-mb-1w">
            {richTextParser(
              wording.legal_notice.processing_quote_description_step_1
            )}
          </p>
          <p className="fr-mb-1w">
            {richTextParser(
              wording.legal_notice.processing_quote_description_step_2
            )}
          </p>
          <p className="fr-mb-1w">
            {richTextParser(
              wording.legal_notice.processing_quote_description_step_3
            )}
          </p>
          <p className="fr-mb-1w">
            {richTextParser(
              wording.legal_notice.processing_quote_description_step_4
            )}
          </p>
          <h2>{wording.legal_notice.share_corrections}</h2>
          <p>{wording.legal_notice.share_corrections_description}</p>
          <h2>{wording.legal_notice.access_data}</h2>
          <p className="fr-mb-1w">
            {wording.legal_notice.access_data_description}
          </p>
          <p>{wording.legal_notice.access_data_description_2}</p>
        </div>
      </section>
    </>
  );
}
