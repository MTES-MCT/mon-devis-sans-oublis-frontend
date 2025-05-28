import Image from "next/image";

import SVGLoader from "../SvgLoader/SvgLoader";

export interface TileProps {
  description: string;
  href: string;
  icon?: string;
  image?: string;
  title: string;
}

const Tile: React.FC<TileProps> = ({
  description,
  href,
  icon,
  image,
  title,
}) => {
  const iconPaths: Record<string, string> = {
    "compasses-2-fill": "/svg/design/compasses-2-fill.svg",
    "customer-service-fill": "/svg/business/customer-service-fill.svg",
    "home-4-fill": "/svg/buildings/home-4-fill.svg",
    "tools-fill": "/svg/design/tools-fill.svg",
  };

  const src = icon ? iconPaths[icon] : undefined;

  return (
    <div
      className="fr-tile fr-tile--sm fr-tile--vertical fr-enlarge-link w-full"
      id="tile-6661"
    >
      <div
        className={`fr-tile__body flex flex-col ${
          image ? "justify-center items-center p-2" : ""
        }`}
      >
        {image && <Image alt={title} height={80} src={image} width={80} />}
        {src && (
          <SVGLoader
            color="var(--background-action-high-blue-france)"
            src={src}
          />
        )}
        <div className="fr-tile__content fr-mt-2w">
          <h3
            className={`fr-tile__title fr-text--lg ${
              image ? "self-center" : "self-start"
            }`}
          >
            <a
              className={image ? "text-[var(--text-title-grey)]!" : ""}
              href={href}
            >
              {title}
            </a>
          </h3>
          <p
            className={`fr-tile__detail fr-text--md fr-mt-1w ${
              image ? "text-center" : "self-start text-left"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tile;
