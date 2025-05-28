export enum BadgeSize {
  X_SMALL = "x-small",
  SMALL = "small",
  MEDIUM = "medium",
}

export enum BadgeVariant {
  BLUE_DARK = "blue-dark",
  BLUE_LIGHT = "blue-light",
  GREEN = "green",
  GREEN_LIGHT = "green-light",
  GREY = "grey",
  ORANGE_LIGHT = "orange-light",
}

export interface BadgeProps {
  className?: string;
  icon?: string;
  label: string;
  size?: BadgeSize;
  variant: BadgeVariant;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  icon,
  label,
  size = BadgeSize.MEDIUM,
  variant,
}) => {
  const baseClasses =
    "rounded-sm font-bold px-1.5 py-0.5 uppercase h-fit w-fit whitespace-nowrap";

  const sizeClasses = {
    [BadgeSize.X_SMALL]: "text-xs",
    [BadgeSize.SMALL]: "text-sm",
    [BadgeSize.MEDIUM]: "text-md",
  };

  const variantClasses = {
    [BadgeVariant.BLUE_LIGHT]:
      "bg-(--background-alt-green-archipel)! text-(--text-default-info)!",
    [BadgeVariant.BLUE_DARK]:
      "bg-(--background-action-high-blue-france)! text-(--text-inverted-grey)!",
    [BadgeVariant.GREEN]:
      "bg-(--background-alt-green-emeraude)! text-(--text-default-success)!",
    [BadgeVariant.GREEN_LIGHT]:
      "bg-(--background-contrast-success)! text-(--text-default-success)!",
    [BadgeVariant.GREY]:
      "bg-(--background-alt-grey-hover)! text-(--text-default-grey)!",
    [BadgeVariant.ORANGE_LIGHT]: "bg-[#ffe9e6]! text-(--text-default-warning)!",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} flex flex-row`}
    >
      {icon && (
        <span className={`${icon} fr-icon--sm aria-hidden='true mr-1`} />
      )}
      {label}
    </span>
  );
};

export default Badge;
