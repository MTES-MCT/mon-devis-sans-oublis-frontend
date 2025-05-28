import type { Meta, StoryObj } from "@storybook/react";

import Link, { LinkSize, LinkVariant } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    href: {
      control: "text",
      description: "The URL the link points to",
    },
    label: {
      control: "text",
      description: "The text content of the link",
    },
    icon: {
      control: "text",
      description: "Optional icon class to be displayed",
    },
    size: {
      control: "radio",
      options: Object.values(LinkSize),
      description: "The size of the link",
    },
    variant: {
      control: "radio",
      options: Object.values(LinkVariant),
      description: "The visual style variant of the link",
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof Link>;

export const Primary: Story = {
  args: {
    href: "/example",
    label: "Primary Link",
    variant: LinkVariant.PRIMARY,
    size: LinkSize.MEDIUM,
  },
};

export const Secondary: Story = {
  args: {
    href: "/example",
    label: "Secondary Link",
    variant: LinkVariant.SECONDARY,
    size: LinkSize.MEDIUM,
  },
};

export const Teriary: Story = {
  args: {
    href: "/example",
    label: "Tertiary Link",
    variant: LinkVariant.TERTIARY,
    size: LinkSize.MEDIUM,
  },
};

export const Disabled: Story = {
  args: {
    href: "/example",
    label: "Disabled Link",
    variant: LinkVariant.DISABLED,
    size: LinkSize.MEDIUM,
  },
};

export const LargeLink: Story = {
  args: {
    href: "/example",
    label: "Large Link",
    variant: LinkVariant.PRIMARY,
    size: LinkSize.LARGE,
  },
};

export const SmallLink: Story = {
  args: {
    href: "/example",
    label: "Small Link",
    variant: LinkVariant.PRIMARY,
    size: LinkSize.SMALL,
  },
};

export const LinkWithIcon: Story = {
  args: {
    href: "/example",
    label: "Link with Icon",
    icon: "fr-icon-arrow-right-line",
    variant: LinkVariant.PRIMARY,
    size: LinkSize.MEDIUM,
  },
};

export const SecondaryLinkWithIcon: Story = {
  args: {
    href: "/example",
    label: "Secondary Link with Icon",
    icon: "fr-icon-arrow-right-line",
    variant: LinkVariant.SECONDARY,
    size: LinkSize.MEDIUM,
  },
};
