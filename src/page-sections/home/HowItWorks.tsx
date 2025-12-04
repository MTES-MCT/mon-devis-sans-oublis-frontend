import Image from "next/image";

import { Badge, BadgeVariant, BlockNumber, CardImage, Link } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function HowItWorks() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <div className="fr-container">
        <h2 className="fr-mt-8w fr-mb-5w">
          {wording.homepage.how_it_works.title}
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <Image
            alt={wording.homepage.how_it_works.image.alt}
            className="w-auto lg:h-[420px] md:h-[380px] h-[224px] object-contain"
            height={0}
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 380px, 224px"
            src={wording.homepage.how_it_works.image.src}
            width={0}
          />
          <div className="flex flex-col">
            {wording.homepage.how_it_works.number_blocks.map(
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
              {wording.homepage.how_it_works.correction}
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
