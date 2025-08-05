"use client";

import { default as NextLink } from "next/link";

export enum LinkSize {
  MEDIUM = "medium",
  LARGE = "large",
  SMALL = "small",
}

export enum LinkVariant {
  DISABLED = "disabled",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
}

export interface LinkProps {
  className?: string;
  href: string;
  icon?: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  size?: LinkSize;
  variant?: LinkVariant;
  target?: "_blank" | "_self";
}

const Link: React.FC<LinkProps> = ({
  href,
  icon,
  label,
  onClick,
  onSubmit,
  size = LinkSize.MEDIUM,
  variant = LinkVariant.PRIMARY,
  target,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (variant === LinkVariant.DISABLED) {
      event.preventDefault();
      return;
    }

    if (onSubmit) {
      event.preventDefault();
      onSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }

    if (onClick) {
      onClick(event);
    }
  };

  const classNames = [
    "fr-btn",
    `fr-btn--${variant}`,
    size === LinkSize.LARGE && "fr-btn--lg",
    size === LinkSize.SMALL && "fr-btn--sm",
    variant === LinkVariant.DISABLED &&
      "bg-gray-300 text-gray-500 cursor-not-allowed",
    (variant === LinkVariant.SECONDARY || variant === LinkVariant.TERTIARY) &&
      "bg-white! hover:bg-gray-100! active:bg-gray-200!",
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === LinkVariant.DISABLED) {
    return (
      <span className={classNames}>
        <span>{label}</span>
        {icon && <span className={`fr-btn--icon-right ${icon}`} />}
      </span>
    );
  }

  return (
    <NextLink
      className={classNames}
      href={href}
      onClick={handleClick}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      <span>{label}</span>
      {icon && <span className={`fr-btn--icon-right ${icon}`} />}
    </NextLink>
  );
};

Link.displayName = "Link";
export default Link;
