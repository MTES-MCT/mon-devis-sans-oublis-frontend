import Image from "next/image";

import { Badge, BadgeVariant, BlockNumber, CardImage, Link } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function ExplanationCards() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2>{wording.homepage.explanation_cards.title_1}</h2>
        <h5 className="fr-mb-1w fr-mt-1w md:fr-mb-0 md:fr-mt-0 ">{wording.homepage.explanation_cards.subtitle_1}</h5>
        <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
          {wording.homepage.explanation_cards.badges_1.map((badge, index) => (
            <li key={index}>
              <Badge
                label={badge.label}
                variant={BadgeVariant.BLUE_DARK}
              />
            </li>
          ))}
        </ul>
        <div className="fr-grid-row fr-grid-row--gutters flex flex-col md:flex-row">
          {wording.homepage.explanation_cards.image_cards.map((card, index) => (
            <div className="fr-col-12 fr-col-md-4 flex-1" key={index}>
              <CardImage
                description={card.description}
                image={card.image}
                title={card.title}
              />
            </div>
          ))}
        </div>
        <h2 className="fr-mt-8w fr-mb-5w">
          {wording.homepage.explanation_cards.title_3}
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <Image
            alt={wording.homepage.explanation_cards.image.alt}
            className="w-auto lg:h-[420px] md:h-[380px] h-[224px] object-contain"
            height={0}
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 380px, 224px"
            src={wording.homepage.explanation_cards.image.src}
            width={0}
          />
          <div className="flex flex-col">
            {wording.homepage.explanation_cards.number_blocks.map(
              (block, index) => (
                <BlockNumber
                  className="fr-mb-2w"
                  key={index}
                  number={block.number}
                  title={richTextParser(block.title)}
                />
              )
            )}
            <p className="bg-[var(--background-alt-blue-france)] pl-2 p-4">
              <span className="fr-icon-restart-line mr-2 ml-0 text-[var(--text-title-blue-france)]" />
              {wording.homepage.explanation_cards.correction}
            </p>
            <div className="flex items-end md:mt-auto mt-6 justify-center md:justify-start">
              <Link {...wording.homepage.check_quote_button} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
