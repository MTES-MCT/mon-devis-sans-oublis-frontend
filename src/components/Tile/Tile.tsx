import Image from "next/image";

import SVGLoader from "../SvgLoader/SvgLoader";

export interface TileProps {
  description: string;
  href?: string;
  icon?: string;
  image?: string;
  title: string;
  horizontal?: boolean;
  tag?: string;
  isCheckbox?: boolean;
  isChecked?: boolean;
  onCheck?: () => void;
  value?: string;
}

const Tile: React.FC<TileProps> = ({
  description,
  href,
  icon,
  image,
  title,
  horizontal = false,
  tag,
  isCheckbox = false,
  isChecked = false,
  onCheck,
  value,
}) => {
  const iconPaths: Record<string, string> = {
    "compasses-2-fill": "/svg/design/compasses-2-fill.svg",
    "customer-service-fill": "/svg/business/customer-service-fill.svg",
    "home-4-fill": "/svg/buildings/home-4-fill.svg",
    "tools-fill": "/svg/design/tools-fill.svg",
  };

  const src = icon ? iconPaths[icon] : undefined;

  const handleClick = () => {
    if (isCheckbox && onCheck) {
      onCheck();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isCheckbox && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onCheck?.();
    }
  };

  // Mode checkbox avec hover
  if (isCheckbox) {
    return (
      <div
        className={`fr-tile ${horizontal ? "fr-tile--horizontal" : "fr-tile--vertical"} fr-enlarge-link w-full cursor-pointer transition-colors duration-200 hover:!bg-[var(--background-default-grey-hover)]`}
        style={{
          backgroundColor: isChecked
            ? "var(--background-default-grey-hover)"
            : "var(--background-default-grey)",
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="radio"
        aria-checked={isChecked}
        tabIndex={0}
      >
        <input
          type="radio"
          name="renovation-type"
          value={value}
          checked={isChecked}
          onChange={() => {}}
          className="sr-only"
        />

        <div
          className={
            horizontal
              ? "fr-tile__body"
              : `fr-tile__body flex flex-col ${image ? "justify-center items-center p-2" : ""}`
          }
        >
          {!horizontal && image && (
            <Image alt={title} height={80} src={image} width={80} />
          )}
          {!horizontal && src && (
            <SVGLoader
              color="var(--background-action-high-blue-france)"
              src={src}
            />
          )}

          <div
            className={
              horizontal ? "fr-tile__content" : "fr-tile__content fr-mt-2w"
            }
          >
            <h3
              className={`fr-tile__title fr-text--lg ${image && !horizontal ? "self-center" : horizontal ? "" : "self-start"}`}
            >
              <a href="#" onClick={(e) => e.preventDefault()}>
                {title}
              </a>
            </h3>

            {!horizontal && (
              <p
                className={`fr-tile__detail fr-text--md fr-mt-1w ${image ? "text-center" : "self-start text-left"}`}
              >
                {description}
              </p>
            )}

            {horizontal && (
              <>
                <p className="fr-tile__detail">{description}</p>
                {tag && (
                  <div className="fr-tile__start">
                    <p className="fr-tag">{tag}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {horizontal && (src || image) && (
          <div className="fr-tile__header">
            <div className="fr-tile__pictogram">
              {src && (
                <SVGLoader
                  color="var(--background-action-high-blue-france)"
                  src={src}
                />
              )}
              {image && (
                <Image alt={title} height={80} src={image} width={80} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode normal avec lien
  return (
    <div
      className={`fr-tile ${horizontal ? "fr-tile--horizontal" : "fr-tile--vertical"} fr-enlarge-link w-full`}
    >
      <div
        className={
          horizontal
            ? "fr-tile__body"
            : `fr-tile__body flex flex-col ${image ? "justify-center items-center p-2" : ""}`
        }
      >
        {!horizontal && image && (
          <Image alt={title} height={80} src={image} width={80} />
        )}
        {!horizontal && src && (
          <SVGLoader
            color="var(--background-action-high-blue-france)"
            src={src}
          />
        )}

        <div
          className={
            horizontal ? "fr-tile__content" : "fr-tile__content fr-mt-2w"
          }
        >
          <h3
            className={`fr-tile__title fr-text--lg ${image && !horizontal ? "self-center" : horizontal ? "" : "self-start"}`}
          >
            <a href={href}>{title}</a>
          </h3>

          {!horizontal && (
            <p
              className={`fr-tile__detail fr-text--md fr-mt-1w ${image ? "text-center" : "self-start text-left"}`}
            >
              {description}
            </p>
          )}

          {horizontal && (
            <>
              <p className="fr-tile__detail">{description}</p>
              {tag && (
                <div className="fr-tile__start">
                  <p className="fr-tag">{tag}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {horizontal && (src || image) && (
        <div className="fr-tile__header">
          <div className="fr-tile__pictogram">
            {src && (
              <SVGLoader
                color="var(--background-action-high-blue-france)"
                src={src}
              />
            )}
            {image && <Image alt={title} height={80} src={image} width={80} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tile;
