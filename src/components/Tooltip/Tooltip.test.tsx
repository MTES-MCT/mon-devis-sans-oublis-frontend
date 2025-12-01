import { render, screen, fireEvent } from "@testing-library/react";

import Tooltip from "./Tooltip";

describe("Tooltip Component", () => {
  const defaultProps = {
    icon: "test-icon-class",
    text: "Tooltip content",
    className: "custom-class",
  };

  it("should not display tooltip by default", () => {
    render(<Tooltip {...defaultProps} />);

    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();
  });

  it("should display tooltip on icon hover", () => {
    render(<Tooltip {...defaultProps} />);

    const icon = screen.getByTestId("tooltip-trigger");

    fireEvent.mouseEnter(icon);
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });

  it("should hide tooltip when mouse leaves icon", () => {
    render(<Tooltip {...defaultProps} />);

    const icon = screen.getByTestId("tooltip-trigger");

    fireEvent.mouseEnter(icon);
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();

    fireEvent.mouseLeave(icon);
    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();
  });

  it("should keep tooltip visible when mouse is over it", () => {
    render(<Tooltip {...defaultProps} />);

    const icon = screen.getByTestId("tooltip-trigger");

    fireEvent.mouseEnter(icon);
    const tooltip = screen.getByText(defaultProps.text);

    fireEvent.mouseEnter(tooltip);
    expect(tooltip).toBeInTheDocument();
  });

  it("should hide tooltip when mouse leaves both icon and tooltip", () => {
    render(<Tooltip {...defaultProps} />);

    const icon = screen.getByTestId("tooltip-trigger");

    fireEvent.mouseEnter(icon);
    const tooltip = screen.getByText(defaultProps.text);

    fireEvent.mouseEnter(tooltip);
    fireEvent.mouseLeave(tooltip);
    fireEvent.mouseLeave(icon);

    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();
  });

  it("should add custom classes to icon and tooltip", () => {
    render(<Tooltip {...defaultProps} />);

    const icon = screen.getByTestId("tooltip-trigger");

    expect(icon).toHaveClass(defaultProps.icon);
    fireEvent.mouseEnter(icon);

    const tooltip = screen.getByText(defaultProps.text);
    expect(tooltip).toHaveClass(defaultProps.className);
  });
});
