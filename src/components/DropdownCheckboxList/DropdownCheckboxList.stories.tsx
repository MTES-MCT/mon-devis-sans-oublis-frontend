import type { Meta, StoryObj } from "@storybook/react";

import { DropdownCheckboxList } from "./DropdownCheckboxList";

const meta = {
  title: "Components/DropdownCheckboxList",
  component: DropdownCheckboxList,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownCheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

const simpleOptions = ["option1", "option2", "option3", "option4"];

const groupedOptions = [
  { id: "fruit1", label: "Pomme", group: "Fruits" },
  { id: "fruit2", label: "Banane", group: "Fruits" },
  { id: "fruit3", label: "Orange", group: "Fruits" },
  { id: "vegetable1", label: "Carotte", group: "Légumes" },
  { id: "vegetable2", label: "Poireau", group: "Légumes" },
  { id: "vegetable3", label: "Tomate", group: "Légumes" },
];

const optionsWithCustom = [
  { id: "option1", label: "Option 1" },
  { id: "option2", label: "Option 2" },
  { id: "option3", label: "Option 3" },
  { id: "option4", label: "Option 4" },
  { id: "custom", label: "Autre" },
];

export const MultipleSelect: Story = {
  args: {
    label: "Sélection multiple",
    options: simpleOptions,
    multiple: true,
    onChange: (values: string[]) => {
      console.log("Selected values:", values);
    },
  },
};

export const SingleSelect: Story = {
  args: {
    label: "Sélection unique",
    options: simpleOptions,
    multiple: false,
    onChange: (values: string[]) => {
      console.log("Selected values:", values);
    },
  },
};

export const GroupedMultipleSelect: Story = {
  args: {
    label: "Sélection multiple groupée",
    options: groupedOptions,
    multiple: true,
    onChange: (values: string[]) => {
      console.log("Selected values:", values);
    },
  },
};

export const GroupedSingleSelect: Story = {
  args: {
    label: "Sélection unique groupée",
    options: groupedOptions,
    multiple: false,
    onChange: (values: string[]) => {
      console.log("Selected values:", values);
    },
  },
};

export const WithPreselectedValues: Story = {
  args: {
    label: "Avec valeurs présélectionnées",
    options: simpleOptions,
    multiple: true,
    selectedValues: ["option1", "option3"],
    onChange: (values: string[]) => {
      console.log("Selected values:", values);
    },
  },
};

export const WithCustomInput: Story = {
  args: {
    label: "Avec input personnalisé",
    options: optionsWithCustom,
    multiple: false,
    customInput: {
      id: "custom",
      value: "",
      onChange: (value: string) => {
        console.log("Custom input value:", value);
      },
    },
    onChange: (values: string[]) => {
      console.log("Selected values:", values);
    },
  },
};
