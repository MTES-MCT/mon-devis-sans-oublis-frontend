import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Link, { LinkSize, LinkVariant } from "./Link";

describe("Link", () => {
  const mockOnClick = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
    mockOnSubmit.mockClear();
  });

  it("renders with default props", () => {
    render(<Link href="/test" label="Test Link" />);
    expect(screen.getByText("Test Link")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <Link href="/test" label="Test Link" size={LinkSize.LARGE} />
    );
    expect(screen.getByText("Test Link").closest("a")).toHaveClass(
      "fr-btn--lg"
    );

    rerender(<Link href="/test" label="Test Link" size={LinkSize.SMALL} />);
    expect(screen.getByText("Test Link").closest("a")).toHaveClass(
      "fr-btn--sm"
    );
  });

  it("renders with different variants", () => {
    const { rerender } = render(
      <Link href="/test" label="Test Link" variant={LinkVariant.SECONDARY} />
    );
    const link = screen.getByText("Test Link").closest("a");
    expect(link).toHaveClass("fr-btn--secondary");
    expect(link).toHaveClass("bg-white!");

    rerender(
      <Link href="/test" label="Test Link" variant={LinkVariant.DISABLED} />
    );
    const disabledLink = screen.getByText("Test Link").closest("a");
    expect(disabledLink).toHaveClass(
      "bg-gray-300",
      "text-gray-500",
      "cursor-not-allowed"
    );
  });

  it("handles click events", async () => {
    render(<Link href="/test" label="Test Link" onClick={mockOnClick} />);
    await userEvent.click(screen.getByText("Test Link"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("handles submit events", async () => {
    render(<Link href="/test" label="Test Link" onSubmit={mockOnSubmit} />);
    await userEvent.click(screen.getByText("Test Link"));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("prevents navigation and callbacks when disabled", async () => {
    render(
      <Link
        href="/test"
        label="Test Link"
        variant={LinkVariant.DISABLED}
        onClick={mockOnClick}
        onSubmit={mockOnSubmit}
      />
    );
    await userEvent.click(screen.getByText("Test Link"));
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("renders with icon", () => {
    render(<Link href="/test" label="Test Link" icon="fr-icon-test" />);
    const iconElement = screen.getByText("Test Link")
      .nextElementSibling as HTMLElement;
    expect(iconElement).toHaveClass("fr-btn--icon-right", "fr-icon-test");
  });

  it("sets empty href when disabled", () => {
    render(
      <Link href="/test" label="Test Link" variant={LinkVariant.DISABLED} />
    );
    const link = screen.getByText("Test Link").closest("a");
    expect(link).toHaveAttribute("href", "");
  });
});
