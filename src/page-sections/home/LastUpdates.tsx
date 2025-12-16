import { UpdateCard } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";
import Image from "next/image";

export default function LastUpdates() {
  return (
    <section className="fr-container-fluid fr-py-10w bg-[var(--background-alt-blue-france)]">
      <div className="fr-container">
        <h2 className="fr-mb-6w" style={{ textAlign: "left" }}>
          {wording.homepage.last_updates.title}
        </h2>
        <div className="flex flex-col gap-6">
          {wording.homepage.last_updates.last_update_cards.map(
            (update, index) => (
              <UpdateCard
                key={index}
                badges={update.badges}
                buttons={update.buttons}
                description={richTextParser(update.description)}
                image={update.image}
                title={update.title}
              />
            )
          )}
        </div>
      </div>
      <div className="fr-container fr-mt-6w">
        <h4 className="fr-mb-6w" style={{ textAlign: "left" }}>
          {wording.homepage.last_updates.previous.title}
        </h4>
        <div className="fr-grid-row fr-grid-row--gutters flex flex-col md:flex-row ">
          {wording.homepage.last_updates.previous.previous_update_cards.map(
            (update, index) => (
              <div className="fr-col-12 fr-col-md-6 flex-1" key={index}>
                <div className="flex items-center gap-6 rounded-lg border border-[var(--border-default-grey)] bg-white p-8">
                  <Image
                    alt={update.title}
                    height={80}
                    src={update.image}
                    width={80}
                  />
                  <div>
                    <h6 className="fr-mb-1w">{update.title}</h6>
                    <p className="fr-mb-0">{update.description}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
