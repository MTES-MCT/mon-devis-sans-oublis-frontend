import type { Meta, StoryObj } from "@storybook/react";

import RoundCheckboxGroup, {
  CheckboxOption,
  RoundCheckboxGroupProps,
} from "./RoundCheckboxGroup";

const meta: Meta<typeof RoundCheckboxGroup> = {
  title: "Components/RoundCheckboxGroup",
  component: RoundCheckboxGroup,
  tags: ["autodocs"],
  argTypes: {
    onChange: {
      description: "Fonction appelée lors de la sélection d'une option",
    },
    options: {
      description: "Liste des options disponibles",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<RoundCheckboxGroupProps>;

const defaultOptions: CheckboxOption[] = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    onChange: (value: number) => {
      console.log("Selected value:", value);
    },
  },
};

export const WithPreselection: Story = {
  render: (args) => {
    const Wrapper = () => {
      return (
        <RoundCheckboxGroup
          {...args}
          defaultValue={3}
          options={defaultOptions}
          onChange={(value) => {
            console.log("Selected value:", value);
          }}
        />
      );
    };
    return <Wrapper />;
  },
};

export const SingleOption: Story = {
  args: {
    options: [{ value: 1 }],
    onChange: (value: number) => {
      console.log("Selected value:", value);
    },
  },
};
