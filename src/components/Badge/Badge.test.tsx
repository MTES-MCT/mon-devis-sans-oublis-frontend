import { render, screen } from "@testing-library/react";

import Badge, { BadgeVariant } from "./Badge";

describe("Badge Component", () => {
  const defaultProps = {
    label: "Beta",
  };

  it("renders with the provided label", () => {
    render(<Badge variant={BadgeVariant.BLUE_DARK} {...defaultProps} />);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders with different label lengths", () => {
    const { rerender } = render(
      <Badge label="A" variant={BadgeVariant.BLUE_DARK} />
    );
    expect(screen.getByText("A")).toBeInTheDocument();

    rerender(
      <Badge label="Very Long Label" variant={BadgeVariant.BLUE_DARK} />
    );
    expect(screen.getByText("Very Long Label")).toBeInTheDocument();
  });

  it("handles special characters", () => {
    render(<Badge label="Test & Demo" variant={BadgeVariant.BLUE_DARK} />);
    expect(screen.getByText("Test & Demo")).toBeInTheDocument();
  });

  it("is visually uppercase", () => {
    const { container } = render(
      <Badge label="test" variant={BadgeVariant.BLUE_DARK} />
    );
    const badge = container.firstChild;
    expect(badge).toHaveClass("uppercase");
  });

  it("renders with the BLUE_DARK variant", () => {
    render(<Badge label="Blue Dark Badge" variant={BadgeVariant.BLUE_DARK} />);
    const badge = screen.getByText("Blue Dark Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-(--background-action-high-blue-france)!");
    expect(badge).toHaveClass("text-(--text-inverted-grey)!");
  });

  it("renders with the GREY variant", () => {
    render(<Badge label="Grey Badge" variant={BadgeVariant.GREY} />);
    const badge = screen.getByText("Grey Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-(--background-alt-grey-hover)!");
    expect(badge).toHaveClass("text-(--text-default-grey)!");
  });

  it("renders with the GREEN variant", () => {
    render(<Badge label="Green Badge" variant={BadgeVariant.GREEN} />);
    const badge = screen.getByText("Green Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-(--background-alt-green-emeraude)!");
    expect(badge).toHaveClass("text-(--text-default-success)!");
  });

  it("renders with the BLUE_LIGHT variant", () => {
    render(
      <Badge label="Blue Light Badge" variant={BadgeVariant.BLUE_LIGHT} />
    );
    const badge = screen.getByText("Blue Light Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-(--background-alt-green-archipel)!");
    expect(badge).toHaveClass("text-(--text-default-info)!");
  });
});
