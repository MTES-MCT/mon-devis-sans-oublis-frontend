import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RoundCheckboxGroup, { CheckboxOption } from "./RoundCheckboxGroup";
import { Rating } from "@/types";
import wording from "@/wording";

jest.mock("@/wording", () => ({
  __esModule: true,
  default: {
    components: {
      round_checkbox_group: {
        insufficient: "Insuffisant",
        satisfactory: "Satisfaisant",
      },
    },
  },
}));

enum MockRating {
  ONE = "1",
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
}

describe("RoundCheckboxGroup", () => {
  const mockOptions: CheckboxOption[] = [
    { value: MockRating.ONE as unknown as Rating },
    { value: MockRating.TWO as unknown as Rating },
    { value: MockRating.THREE as unknown as Rating },
    { value: MockRating.FOUR as unknown as Rating },
    { value: MockRating.FIVE as unknown as Rating },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all options", () => {
    render(
      <RoundCheckboxGroup options={mockOptions} onChange={mockOnChange} />
    );

    expect(
      screen.getByText(wording.components.round_checkbox_group.insufficient)
    ).toBeInTheDocument();
    expect(
      screen.getByText(wording.components.round_checkbox_group.satisfactory)
    ).toBeInTheDocument();

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(mockOptions.length);

    radioButtons.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it("renders with default value selected", () => {
    render(
      <RoundCheckboxGroup
        options={mockOptions}
        onChange={mockOnChange}
        defaultValue={MockRating.THREE as unknown as Rating}
      />
    );

    const radioButtons = screen.getAllByRole("radio");

    expect(radioButtons[2]).toBeChecked();
  });

  it("calls onChange when an option is selected", () => {
    render(
      <RoundCheckboxGroup options={mockOptions} onChange={mockOnChange} />
    );

    const radioButtons = screen.getAllByRole("radio");

    fireEvent.click(radioButtons[2]);
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.THREE);
    expect(radioButtons[2]).toBeChecked();
  });

  it("handles keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <RoundCheckboxGroup options={mockOptions} onChange={mockOnChange} />
    );

    const radioButtons = screen.getAllByRole("radio");

    await user.tab();
    expect(radioButtons[0]).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.TWO);
    expect(radioButtons[1]).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.THREE);
    expect(radioButtons[2]).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.TWO);
    expect(radioButtons[1]).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.ONE);
    expect(radioButtons[0]).toHaveFocus();
  });

  it("handles keyboard selection with Enter and Space", async () => {
    const user = userEvent.setup();

    render(
      <RoundCheckboxGroup options={mockOptions} onChange={mockOnChange} />
    );

    const radioButtons = screen.getAllByRole("radio");

    await user.tab();
    expect(radioButtons[0]).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.ONE);
    expect(radioButtons[0]).toBeChecked();

    await user.keyboard("{ArrowRight}");

    await user.keyboard(" ");
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.TWO);
    expect(radioButtons[1]).toBeChecked();
  });

  it("respects boundary conditions for keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <RoundCheckboxGroup options={mockOptions} onChange={mockOnChange} />
    );

    const radioButtons = screen.getAllByRole("radio");

    await user.tab();

    await user.keyboard("{ArrowLeft}");
    expect(radioButtons[0]).toHaveFocus();
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.ONE);

    for (let i = 0; i < mockOptions.length - 1; i++) {
      await user.keyboard("{ArrowRight}");
    }
    expect(radioButtons[mockOptions.length - 1]).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(radioButtons[mockOptions.length - 1]).toHaveFocus();
    expect(mockOnChange).toHaveBeenCalledWith(MockRating.FIVE);
  });

  it("has correct accessibility attributes", () => {
    render(
      <RoundCheckboxGroup options={mockOptions} onChange={mockOnChange} />
    );

    const radiogroup = screen.getByRole("radiogroup");
    expect(radiogroup).toHaveAttribute("aria-label", "Niveau de satisfaction");

    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio, index) => {
      expect(radio).toHaveAttribute(
        "aria-label",
        `Note ${index + 1} sur ${mockOptions.length}`
      );
      expect(radio).toHaveAttribute(
        "aria-describedby",
        "scale-start scale-end"
      );
      expect(radio).toHaveAttribute("aria-checked", "false");
    });

    expect(
      screen.getByText(wording.components.round_checkbox_group.insufficient)
    ).toHaveAttribute("id", "scale-start");
    expect(
      screen.getByText(wording.components.round_checkbox_group.satisfactory)
    ).toHaveAttribute("id", "scale-end");
  });
});
