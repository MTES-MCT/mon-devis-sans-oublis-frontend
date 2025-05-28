import type { Meta, StoryObj } from "@storybook/react";

import { CheckboxGroup } from "./CheckboxGroup";

const meta = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { id: "checkbox-1", label: "Option 1", checked: false },
  { id: "checkbox-2", label: "Option 2", checked: false },
  { id: "checkbox-3", label: "Option 3", checked: false },
];

export const Default: Story = {
  args: {
    legend: "Select your options",
    options: defaultOptions,
    onChange: (id: string, checked: boolean) => {
      console.log(`Checkbox ${id} changed to ${checked}`);
    },
  },
};

export const SingleOption: Story = {
  args: {
    legend: "Single checkbox group",
    options: [{ id: "single", label: "Single option", checked: false }],
    onChange: (id: string, checked: boolean) => {
      console.log(`Checkbox ${id} changed to ${checked}`);
    },
  },
};
