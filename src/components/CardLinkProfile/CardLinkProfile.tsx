"use client";

import Link from "next/link";

import IconBackground, {
  IconBackgroundVariant,
} from "../IconBackground/IconBackground";

export interface CardLinkProfileProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const CardLinkProfile: React.FC<CardLinkProfileProps> = ({
  href,
  icon,
  title,
  description,
}) => {
  return (
    <Link
      className="fr-btn rounded-lg p-4! w-full! flex justify-between"
      href={href}
      style={{
        backgroundColor: "var(--background-default-grey-hover)",
        transition: "background-color 0.1s",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor =
          "var(--background-default-grey-active)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor =
          "var(--background-default-grey-hover)")
      }
      onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#cecece")}
      onMouseUp={(e) =>
        (e.currentTarget.style.backgroundColor =
          "var(--background-default-grey-active)")
      }
    >
      <div className="flex items-center">
        <IconBackground
          icon={`fr-icon-${icon}`}
          variant={IconBackgroundVariant.WHITE}
        />
        <div className="flex flex-col mx-6 text-[var(--text-default-grey)]">
          <div className="text-[20px] font-bold leading-8 text-left underline-offset-[from-font] decoration-skip-ink-none">
            {title}
          </div>
          <div className="text-base font-normal leading-6 text-left underline-offset-[from-font] decoration-skip-ink-none">
            {description}
          </div>
        </div>
      </div>
      <IconBackground
        icon={"fr-icon-arrow-right-line"}
        variant={IconBackgroundVariant.BLUE}
      />
    </Link>
  );
};

export default CardLinkProfile;
