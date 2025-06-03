import { Tile } from "@/components";
import wording from "@/wording";

export default function Bienvenue() {
  return (
    <div className="fr-container fr-mt-8v fr-mb-8v">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-lg-10">
          <h1 className="fr-h2 fr-mb-6v">
            Pouvez-vous nous en dire plus sur vous ?
          </h1>

          <div className="fr-mb-8v">
            <ul className="fr-raw-list fr-grid-row fr-grid-row--gutters">
              {wording.homepage.section_who_are_you.cards.map((card, index) => (
                <li className="fr-col-12 fr-col-md-6 fr-col-lg-4" key={index}>
                  <Tile
                    description={card.description}
                    image={card.image}
                    href={card.url}
                    title={card.title}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
