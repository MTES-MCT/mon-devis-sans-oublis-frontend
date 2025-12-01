export enum IconBackgroundVariant {
  BLUE = "blue",
  BLUE_LIGHT = "blue-light",
  WHITE = "white",
}

export interface IconBackgroundProps {
  icon: string;
  variant: IconBackgroundVariant;
}

const IconBackground: React.FC<IconBackgroundProps> = ({ icon, variant }) => {
  const variantClasses = {
    [IconBackgroundVariant.BLUE]:
      "bg-[var(--background-action-high-blue-france)] text-white",
    [IconBackgroundVariant.BLUE_LIGHT]:
      "bg-[var(--background-contrast-info)] text-[var(--background-action-high-blue-france)]",
    [IconBackgroundVariant.WHITE]:
      "bg-white text-[var(--background-action-high-blue-france)] border-blue",
  };

  return (
    <div
      className={`${icon} ${variantClasses[variant]} rounded-lg h-12 w-12 flex items-center justify-center`}
    />
  );
};

export default IconBackground;
