import Image from "next/image";

import { richTextParser } from "@/utils";
import wording from "@/wording";
import Link from "next/link";

export default function ApiBlock() {
  return (
    <section className="fr-container-fluid fr-py-10w bg-[var(--background-alt-blue-france)]">
      <div className="fr-container">
        <div className="flex flex-col items-center gap-8 md:flex-row py-8 px-36">
          <div className="flex items-center justify-center rounded-lg bg-[var(--background-default-grey)] p-12">
            <Image
              alt={wording.homepage.api_block.image.alt}
              height={160}
              src={wording.homepage.api_block.image.src}
              width={160}
            />
          </div>
          <div className="flex-1">
            <h5 className="fr-mb-2w" style={{ textAlign: "left" }}>
              {richTextParser(wording.homepage.api_block.title)}
            </h5>
            <p className="fr-mb-3w">{wording.homepage.api_block.description}</p>
            <ul className="fr-raw-list flex flex-wrap gap-4">
              {wording.homepage.api_block.buttons.map((button, index) => (
                <li key={index}>
                  <Link
                    role="button"
                    className={
                      `fr-btn fr-btn--` +
                      (index === 0 ? "secondary" : "tertiary") +
                      ` fr-btn--icon-right ` +
                      button.icon
                    }
                    href={button.href}
                    {...(button.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {button.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
