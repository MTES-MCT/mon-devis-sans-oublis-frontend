import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DropdownCheckboxList, type Option } from "./DropdownCheckboxList";

describe("DropdownCheckboxList", () => {
  const defaultProps = {
    label: "Test Dropdown",
    multiple: true,
    onChange: jest.fn(),
    options: ["Option 1", "Option 2", "Option 3"],
    selectedValues: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with basic props", () => {
    render(<DropdownCheckboxList {...defaultProps} />);
    expect(screen.getByText("Test Dropdown")).toBeInTheDocument();
    expect(screen.getByText("Sélectionner une option")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("handles multiple selection correctly", async () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const option1 = screen.getByLabelText("Option 1");
    const option2 = screen.getByLabelText("Option 2");

    await userEvent.click(option1);
    await userEvent.click(option2);

    expect(defaultProps.onChange).toHaveBeenLastCalledWith([
      "Option 1",
      "Option 2",
    ]);
    expect(screen.getByText("2 éléments sélectionnés")).toBeInTheDocument();
  });

  it("handles single selection correctly", async () => {
    render(<DropdownCheckboxList {...defaultProps} multiple={false} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const option1 = screen.getByLabelText("Option 1");
    await userEvent.click(option1);

    expect(defaultProps.onChange).toHaveBeenLastCalledWith(["Option 1"]);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("handles custom input correctly", async () => {
    const customInput = {
      id: "custom",
      value: "",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [
      { id: "Option 1", label: "Option 1" },
      { id: "Option 2", label: "Option 2" },
      { id: "Option 3", label: "Option 3" },
      { id: "custom", label: "custom" },
    ];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={optionsWithCustom}
        customInput={customInput}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customInputElement = screen.getByTestId("custom-reason-input");
    fireEvent.change(customInputElement, {
      target: { value: "Custom reason" },
    });

    expect(customInput.onChange).toHaveBeenCalledWith("Custom reason");
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.arrayContaining(["custom"])
    );
  });

  it("closes dropdown when clicking outside", async () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation", async () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Test Escape key
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    // Reopen dropdown
    await userEvent.click(button);

    // Test Enter key on button
    fireEvent.keyDown(button, { key: "Enter" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    // Test Space key on button
    fireEvent.keyDown(button, { key: " " });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("handles optional flag correctly", () => {
    render(<DropdownCheckboxList {...defaultProps} optionnal={true} />);
    expect(screen.getByText("Optionnel")).toBeInTheDocument();
  });

  it("handles custom input deselection", async () => {
    const customInput = {
      id: "custom",
      value: "Initial value",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [
      { id: "Option 1", label: "Option 1" },
      { id: "custom", label: "custom" },
    ];

    const onChangeMock = jest.fn();

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={optionsWithCustom}
        customInput={customInput}
        selectedValues={["custom"]}
        onChange={onChangeMock}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customCheckbox = screen.getByRole("checkbox", {
      name: "Initial value",
    });
    await userEvent.click(customCheckbox);

    expect(customInput.onChange).toHaveBeenCalledWith("");
    expect(onChangeMock).toHaveBeenCalledWith([]);
  });

  it("handles empty input in custom field", async () => {
    const customInput = {
      id: "custom",
      value: "Initial value",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [{ id: "custom", label: "custom" }];

    const onChangeMock = jest.fn();

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={optionsWithCustom}
        customInput={customInput}
        selectedValues={["custom"]}
        onChange={onChangeMock}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customCheckbox = screen.getByRole("checkbox", {
      name: "Initial value",
    });
    await userEvent.click(customCheckbox);

    const customInputElement = screen.getByTestId("custom-reason-input");
    await userEvent.clear(customInputElement);

    expect(onChangeMock).toHaveBeenCalledWith([]);
  });

  it("handles Tab key navigation", async () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Test Tab key on first item
    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    firstCheckbox.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    // Reopen dropdown
    await userEvent.click(button);

    // Test Tab key on last item
    const lastCheckbox =
      screen.getAllByRole("checkbox")[
        screen.getAllByRole("checkbox").length - 1
      ];
    lastCheckbox.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("handles custom input click event", async () => {
    const customInput = {
      id: "custom",
      value: "",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [{ id: "custom", label: "custom" }];

    const onChangeMock = jest.fn();

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={optionsWithCustom}
        customInput={customInput}
        onChange={onChangeMock}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customInputElement = screen.getByTestId("custom-reason-input");
    await userEvent.click(customInputElement);

    expect(onChangeMock).toHaveBeenCalledWith(["custom"]);
  });

  it("handles single selection with custom input", async () => {
    const customInput = {
      id: "custom",
      value: "",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [
      { id: "Option 1", label: "Option 1" },
      { id: "custom", label: "custom" },
    ];

    const onChangeMock = jest.fn();

    render(
      <DropdownCheckboxList
        {...defaultProps}
        multiple={false}
        options={optionsWithCustom}
        customInput={customInput}
        onChange={onChangeMock}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customInputElement = screen.getByTestId("custom-reason-input");
    await userEvent.click(customInputElement);
    fireEvent.change(customInputElement, { target: { value: "test" } });

    expect(onChangeMock).toHaveBeenCalledWith(["custom"]);
    expect(customInput.onChange).toHaveBeenCalledWith("test");
  });

  it("handles custom input with empty string", async () => {
    const customInput = {
      id: "custom",
      value: "test",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [{ id: "custom", label: "custom" }];

    const onChangeMock = jest.fn();

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={optionsWithCustom}
        customInput={customInput}
        onChange={onChangeMock}
        selectedValues={["custom"]}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customInputElement = screen.getByTestId("custom-reason-input");
    fireEvent.change(customInputElement, { target: { value: "  " } });

    expect(onChangeMock).toHaveBeenCalledWith([]);
  });

  it("handles keyboard navigation with no open dropdown", () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("focuses custom input after selection", async () => {
    const customInput = {
      id: "custom",
      value: "",
      onChange: jest.fn(),
    };

    const optionsWithCustom: Option[] = [{ id: "custom", label: "custom" }];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={optionsWithCustom}
        customInput={customInput}
      />
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const customCheckbox = screen.getByRole("checkbox");
    await userEvent.click(customCheckbox);

    const customInputElement = screen.getByTestId("custom-reason-input");
    expect(document.activeElement).toBe(customInputElement);
  });

  it("handles button keyboard events correctly", () => {
    render(<DropdownCheckboxList {...defaultProps} />);

    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "Enter" });
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(button, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("handles default group correctly", () => {
    const options: Option[] = [
      { id: "opt1", label: "Option 1" },
      { id: "opt2", label: "Option 2", group: "Group 1" },
    ];

    render(<DropdownCheckboxList {...defaultProps} options={options} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("handles empty options array", () => {
    render(<DropdownCheckboxList {...defaultProps} options={[]} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Sélectionner une option")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("handles undefined selectedValues", () => {
    render(
      <DropdownCheckboxList {...defaultProps} selectedValues={undefined} />
    );

    expect(screen.getByText("Sélectionner une option")).toBeInTheDocument();
  });

  it("handles no checkboxes in dropdown", async () => {
    render(<DropdownCheckboxList {...defaultProps} options={[]} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const dropdownContent = screen.getByRole("listbox");
    dropdownContent.focus();

    fireEvent.keyDown(document, { key: "Tab" });

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("handles getDisplayLabel with string options", () => {
    const stringOptions = ["Option 1", "Option 2"];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        multiple={false}
        options={stringOptions}
        selectedValues={["Option 1"]}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Option 1");
  });

  it("handles getDisplayLabel with Option type", () => {
    const optionsWithLabels: Option[] = [
      { id: "id1", label: "Label 1" },
      { id: "id2", label: "Label 2" },
    ];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        multiple={false}
        options={optionsWithLabels}
        selectedValues={["id1"]}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Label 1");
  });

  it("handles getDisplayLabel with non-existent id", () => {
    const options: Option[] = [{ id: "id1", label: "Label 1" }];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        multiple={false}
        options={options}
        selectedValues={["nonexistent"]}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("nonexistent");
  });

  it("handles grouped options in getDisplayLabel", () => {
    const groupedOptions: Option[] = [
      { id: "opt1", label: "Option 1", group: "Group 1" },
      { id: "opt2", label: "Option 2", group: "Group 1" },
      { id: "opt3", label: "Option 3", group: "Group 2" },
    ];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={groupedOptions}
        selectedValues={["opt1"]}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("Option 1");
  });

  it("handles non-existent ID in getDisplayLabel for grouped options", () => {
    const groupedOptions: Option[] = [
      { id: "opt1", label: "Option 1", group: "Group 1" },
      { id: "opt2", label: "Option 2", group: "Group 1" },
    ];

    render(
      <DropdownCheckboxList
        {...defaultProps}
        options={groupedOptions}
        selectedValues={["nonexistent"]}
      />
    );

    expect(screen.getByRole("button")).toHaveTextContent("nonexistent");
  });
});
