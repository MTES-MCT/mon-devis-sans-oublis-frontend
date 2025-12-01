import { Tile } from "@/components";
import wording from "@/wording";

export default function WhoAreYou() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2>{wording.homepage.section_who_are_you.title}</h2>
        <p className="fr-text--lead text-center">
          {wording.homepage.section_who_are_you.description}
        </p>
        <ul className="fr-raw-list fr-grid-row fr-grid-row--gutters fr-grid-row--center items-stretch">
          {wording.homepage.section_who_are_you.cards.map((card, index) => (
            <li className="fr-col-12 fr-col-md-6 fr-col-lg-3 flex" key={index}>
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
    </section>
  );
}
