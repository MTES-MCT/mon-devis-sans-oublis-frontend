import Image from "next/image";

import { Badge, BadgeVariant, BlockNumber, CardImage, Link } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function LastUpdates() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2>{wording.homepage.last_updates.title}</h2>
        <div className="fr-grid-row fr-grid-row--gutters flex flex-col md:flex-row">
          {wording.homepage.last_updates.last_update_cards.map((update, index) => (
            <div className="fr-col-12 fr-col-md-4 flex-1" key={index}>
              <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
                {update.badges.map((badge, index) => (
                  <li key={index}>
                    <Badge
                      icon={badge.icon}
                      label={badge.label}
                      variant={badge.variant as BadgeVariant}
                    />
                  </li>
                ))}
              </ul>
              <CardImage
                description={richTextParser(update.description)}
                image={update.image}
                title={update.title}
              />
              <ul className="fr-raw-list fr-badges-group fr-mb-3w flex flex-wrap gap-4">
                {update.buttons.map((button, index) => (
                  <li key={index}>
                    <Link
                      icon={button.icon}
                      href={button.href}
                      label={button.label}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <h2>{wording.homepage.last_updates.previous.title}</h2>
      <div className="fr-grid-row fr-grid-row--gutters flex flex-col md:flex-row">
        {wording.homepage.last_updates.previous.previous_update_cards.map((update, index) => (
          <div className="fr-col-12 fr-col-md-4 flex-1" key={index}>
            <CardImage
              description={richTextParser(update.description)}
              image={update.image}
              title={update.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
