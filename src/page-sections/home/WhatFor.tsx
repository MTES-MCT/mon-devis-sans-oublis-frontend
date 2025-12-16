import { CardImage, ActionCard } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function WhatFor() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2>{wording.homepage.what_for.title}</h2>
        <div className="fr-mb-2w fr-mt-1w fr-col-6 fr-col-offset-3 text-center">
          <p>{wording.homepage.what_for.subtitle}</p>
          {wording.homepage.what_for.badges.map((badge, index) => (
            <p
              className="fr-badge fr-badge--info fr-badge--no-icon fr-mr-4v"
              key={index}
            >
              {badge.label}
            </p>
          ))}
        </div>
        <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4"></ul>
        <div className="fr-grid-row fr-grid-row--gutters flex flex-col items-stretch md:flex-row">
          {wording.homepage.what_for.image_cards.map((card, index) => (
            <div className="fr-col-12 fr-col-md-4 flex flex-1" key={index}>
              <CardImage
                description={richTextParser(card.description)}
                image={card.image}
                title={card.title}
              />
            </div>
          ))}
          <div className="fr-col-12 fr-col-md-4 flex flex-1">
            <ActionCard
              buttonHref={wording.homepage.check_quote_button.href}
              buttonLabel={wording.homepage.check_quote_button.label}
              description={richTextParser(
                wording.homepage.what_for.text_card.description
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
