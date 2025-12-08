import Image from "next/image";

import { Link } from "@/components";
import { richTextParser } from "@/utils";
import wording from "@/wording";

export default function ApiBlock() {
  return (
    <section className="fr-container-fluid fr-py-10w">
      <Image
        alt={wording.homepage.api_block.image.alt}
        className="shrink-0"
        height={32}
        src={wording.homepage.api_block.image.src}
        width={32}
      />
      <div className="fr-container">
        <h2>{richTextParser(wording.homepage.api_block.title)}</h2>
        <p className="fr-text--lead text-center">
          {wording.homepage.api_block.description}
        </p>
        <ul className="fr-btns-group">
        {wording.homepage.api_block.buttons.map((button, index) => (
            <li key={index}>
                <Link {...button} />
            </li>
        ))}
        </ul>
      </div>
    </section>
  );
}
