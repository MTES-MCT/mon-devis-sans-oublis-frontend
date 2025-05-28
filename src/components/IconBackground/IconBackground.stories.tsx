import type { Meta, StoryObj } from "@storybook/react";
import IconBackground, { IconBackgroundVariant } from "./IconBackground";

const meta = {
  title: "Components/IconBackground",
  component: IconBackground,
  tags: ["autodocs"],
} satisfies Meta<typeof IconBackground>;

export default meta;
type Story = StoryObj<typeof IconBackground>;

export const Blue: Story = {
  args: {
    icon: "fr-icon-arrow-right-line",
    variant: IconBackgroundVariant.BLUE,
  },
};

export const BlueLight: Story = {
  args: {
    icon: "fr-icon-calendar-line",
    variant: IconBackgroundVariant.BLUE_LIGHT,
  },
};

export const White: Story = {
  args: {
    icon: "fr-icon-home-4-fill",
    variant: IconBackgroundVariant.WHITE,
  },
};

export const IconGrid: Story = {
  decorators: [
    () => (
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-4">
          <IconBackground
            icon="fr-icon-user-line"
            variant={IconBackgroundVariant.BLUE}
          />
        </div>
        <div className="fr-col-4">
          <IconBackground
            icon="fr-icon-calendar-line"
            variant={IconBackgroundVariant.BLUE_LIGHT}
          />
        </div>
        <div className="fr-col-4">
          <IconBackground
            icon="fr-icon-mail-line"
            variant={IconBackgroundVariant.WHITE}
          />
        </div>
      </div>
    ),
  ],
};
