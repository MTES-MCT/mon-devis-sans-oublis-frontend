import { Badge, BadgeVariant, CardImage } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function ProfileCards() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2>{richTextParser(wording.homepage.profile_cards.title)}</h2>
        <div className="fr-grid-row fr-grid-row--gutters flex flex-col md:flex-row">
          {wording.homepage.profile_cards.cards.map((card, card_index) => (
            <div className="fr-col-12 fr-col-md-6 flex-1" key={card_index}>
              <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
                {/* {card.badges.map((badge, index) => (
                  <li key={index}>
                    <Badge
                      label={badge.label}
                      variant={BadgeVariant[badge.variant]}
                    />
                  </li>
                ))} */}
              </ul>
              {/* <CardImage
                description={richTextParser(card.subtitle)}
                image={card.image}
                title={card.title}
              /> */}
              <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
                {card.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
