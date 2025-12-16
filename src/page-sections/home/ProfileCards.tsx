import { Badge, BadgeVariant } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function ProfileCards() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2 className="text-center">
          {richTextParser(wording.homepage.profile_cards.title)}
        </h2>
        <div className="fr-grid-row fr-grid-row--gutters">
          {wording.homepage.profile_cards.cards.map((card, card_index) => (
            <div className="fr-col-12 fr-col-md-6" key={card_index}>
              <div
                className="h-full rounded-lg border border-[var(--border-default-grey)] p-8"
                style={{ backgroundColor: "#ffffff" }}
              >
                <ul className="fr-raw-list fr-badges-group fr-badges-group--sm fr-mb-2w flex flex-wrap gap-2">
                  {card.badges.map((badge, index) => (
                    <li key={index}>
                      <p
                        className={`fr-badge ${badge.variant} fr-badge--no-icon`}
                      >
                        {badge.label}
                      </p>
                    </li>
                  ))}
                </ul>
                <h5
                  className="fr-mb-2w"
                  style={{ color: "var(--text-action-high-blue-france)" }}
                >
                  {card.title}
                </h5>
                <p className="fr-mb-3w">{card.subtitle}</p>
                <ul className="fr-raw-list flex flex-col gap-2">
                  {card.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span
                        className="fr-icon-check-line mt-1 text-[var(--text-default-success)]"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
