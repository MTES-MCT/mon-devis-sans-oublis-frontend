import Image from "next/image";

import { Badge, BadgeVariant, BlockNumber, CardImage, Link } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function WhatFor() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2>{wording.homepage.what_for.title}</h2>
        <h5 className="fr-mb-1w fr-mt-1w md:fr-mb-0 md:fr-mt-0">{wording.homepage.what_for.subtitle}</h5>
        <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
          {wording.homepage.what_for.badges.map((badge, index) => (
            <li key={index}>
              <Badge
                label={badge.label}
                variant={BadgeVariant.BLUE_DARK}
              />
            </li>
          ))}
        </ul>
        <div className="fr-grid-row fr-grid-row--gutters flex flex-col md:flex-row">
          {wording.homepage.what_for.image_cards.map((card, index) => (
            <div className="fr-col-12 fr-col-md-4 flex-1" key={index}>
              <CardImage
                description={richTextParser(card.description)}
                image={card.image}
                title={card.title}
              />
            </div>
          ))}
          <div className="fr-col-12 fr-col-md-4 flex-1" key={wording.homepage.what_for.image_cards.length}>
            {richTextParser(wording.homepage.what_for.text_card.description)}
          </div>
        </div>
      </div>
    </section>
  );
}
