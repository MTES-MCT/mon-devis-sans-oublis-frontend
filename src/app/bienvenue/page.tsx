import { CardLinkProfile, Notice, Tile } from "@/components";
import wording from "@/wording";

export default function Bienvenue() {
  const { cards, subtitle, title } = wording.welcome.section_who_are_you;

  return (
    <>
      <Notice
        className="fr-notice--info"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />
      <section className="fr-container-fluid fr-py-10w [&>div>h1]:text-center [&>div>p]:text-center">
        <div className="fr-container">
          <h1>{title}</h1>
          <p className="fr-text--lead">{subtitle}</p>
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
              <ul className="fr-mt-2w fr-mb-6w fr-raw-list space-y-4">
                {cards.map((card, index) => (
                  <li key={index}>
                    <div className="block md:hidden">
                      <Tile
                        description={card.description}
                        href={card.href}
                        icon={card.icon}
                        title={card.title}
                      />
                    </div>
                    <div className="hidden md:block">
                      <CardLinkProfile
                        description={card.description}
                        href={card.href}
                        icon={card.icon}
                        title={card.title}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
