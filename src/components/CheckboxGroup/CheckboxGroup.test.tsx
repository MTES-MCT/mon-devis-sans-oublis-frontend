import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import CheckboxGroup, { CheckboxOption } from "./CheckboxGroup";

describe("CheckboxGroup", () => {
  const mockOptions: CheckboxOption[] = [
    { id: "option1", label: "Option 1", checked: false },
    { id: "option2", label: "Option 2", checked: true },
    { id: "option3", label: "Option 3", checked: false },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all options", () => {
    render(<CheckboxGroup options={mockOptions} onChange={mockOnChange} />);

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 3")).toBeInTheDocument();

    expect(screen.getByLabelText("Option 1")).not.toBeChecked();
    expect(screen.getByLabelText("Option 2")).toBeChecked();
    expect(screen.getByLabelText("Option 3")).not.toBeChecked();
  });

  it("renders with legend when provided", () => {
    const legend = "Test Legend";
    render(
      <CheckboxGroup
        options={mockOptions}
        onChange={mockOnChange}
        legend={legend}
      />
    );

    expect(screen.getByText(legend)).toBeInTheDocument();
  });

  it("calls onChange when a checkbox is clicked", () => {
    render(<CheckboxGroup options={mockOptions} onChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText("Option 1"));
    expect(mockOnChange).toHaveBeenCalledWith("option1", true);

    fireEvent.click(screen.getByLabelText("Option 2"));
    expect(mockOnChange).toHaveBeenCalledWith("option2", false);
  });

  it("applies border styling to all but the last option", () => {
    render(<CheckboxGroup options={mockOptions} onChange={mockOnChange} />);

    const fieldsetElements = screen
      .getAllByRole("checkbox")
      .map((checkbox) => checkbox.closest(".fr-fieldset__element"));

    expect(fieldsetElements[0]).toHaveClass("border-bottom-grey");
    expect(fieldsetElements[1]).toHaveClass("border-bottom-grey");
    expect(fieldsetElements[2]).not.toHaveClass("border-bottom-grey");
  });

  it("renders with ReactNode labels", () => {
    const mockOptionsWithReactNode: CheckboxOption[] = [
      {
        id: "option1",
        label: <span data-testid="react-node-label">React Node Label</span>,
        checked: false,
      },
      { id: "option2", label: "Option 2", checked: true },
    ];

    render(
      <CheckboxGroup
        options={mockOptionsWithReactNode}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId("react-node-label")).toBeInTheDocument();
    expect(screen.getByText("React Node Label")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(
      <CheckboxGroup
        options={mockOptions}
        onChange={mockOnChange}
        legend="Test Legend"
      />
    );

    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute(
      "aria-labelledby",
      "checkboxes-legend checkboxes-messages"
    );
    expect(fieldset).toHaveAttribute("id", "checkboxes");

    const legend = screen.getByText("Test Legend");
    expect(legend).toHaveAttribute("id", "checkboxes-legend");

    mockOptions.forEach((option) => {
      const checkbox = screen.getByLabelText(option.label as string);
      expect(checkbox).toHaveAttribute(
        "aria-describedby",
        `${option.id}-messages`
      );
      expect(checkbox).toHaveAttribute("id", option.id);
      expect(checkbox).toHaveAttribute("name", option.id);
    });

    const messagesGroup = screen.getByTestId("checkboxes-messages-assertive");
    expect(messagesGroup).toHaveAttribute("aria-live", "assertive");
    expect(messagesGroup).toHaveAttribute("id", "checkboxes-messages");
  });

  it("renders correctly without legend", () => {
    render(<CheckboxGroup options={mockOptions} onChange={mockOnChange} />);

    expect(screen.queryByRole("legend")).not.toBeInTheDocument();
  });

  it("renders correctly with empty options array", () => {
    render(<CheckboxGroup options={[]} onChange={mockOnChange} />);

    expect(screen.getByRole("group")).toBeInTheDocument();

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders correctly with a single option", () => {
    const singleOption = [mockOptions[0]];

    render(<CheckboxGroup options={singleOption} onChange={mockOnChange} />);

    expect(screen.getAllByRole("checkbox")).toHaveLength(1);

    const fieldsetElement = screen
      .getByRole("checkbox")
      .closest(".fr-fieldset__element");
    expect(fieldsetElement).not.toHaveClass("border-bottom-grey");
  });
});
