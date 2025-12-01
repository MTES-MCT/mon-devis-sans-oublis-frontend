import { Card } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function AboutUs() {
  return (
    <section className="fr-container-fluid fr-py-10w bg-[var(--background-default-grey-hover)]">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters flex flex-wrap">
          <div className="fr-col-12 fr-col-md-6 flex">
            <Card
              image={wording.homepage.about_us.who_are_we.image}
              title={wording.homepage.about_us.who_are_we.title}
            >
              <p className="text-[var(--text-mention-grey)]">
                {richTextParser(
                  wording.homepage.about_us.who_are_we.description
                )}
              </p>
            </Card>
          </div>
          <div className="fr-col-12 fr-col-md-6 flex">
            <Card title={wording.homepage.about_us.our_missions.title}>
              <div className="[&_p]:m-0">
                {wording.homepage.about_us.our_missions.missions.map(
                  (mission, index) => (
                    <div className="flex flex-row gap-2 mt-6" key={index}>
                      <span
                        className={`${mission.icon} text-[var(--background-action-high-blue-france)] mt-0.5`}
                        style={{ marginLeft: -2 }}
                      />
                      <div className="flex flex-col">
                        <p className="font-bold text-[var(--text-title-grey)] m-0! p-0!">
                          {mission.title}
                        </p>
                        <p className="text-[var(--text-mention-grey)] m-0! pt-2">
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
