import { render, screen } from "@testing-library/react";

import BlockNumber, { BlockNumberSize, BlockNumberProps } from "./BlockNumber";

describe("BlockNumber Component", () => {
  const baseProps: BlockNumberProps = {
    number: 1,
    title: "Test Title",
  };

  test("renders correctly with default props", () => {
    render(<BlockNumber {...baseProps} />);

    // Default size should be LARGE
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  test("renders correctly with size MEDIUM", () => {
    render(<BlockNumber {...baseProps} size={BlockNumberSize.MEDIUM} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("1")).toHaveClass("fr-m-0");
    expect(screen.getByText("Test Title")).toHaveClass("fr-mb-1w");
  });

  test("renders description when provided", () => {
    render(<BlockNumber {...baseProps} description="This is a description." />);

    expect(screen.getByText("This is a description.")).toBeInTheDocument();
    expect(screen.getByText("This is a description.")).toHaveClass("hidden");
  });

  test("applies additional className when provided", () => {
    render(<BlockNumber {...baseProps} className="custom-class" />);

    const container = screen.getByText("1.").closest("div");

    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-row");
    expect(container).toHaveClass("gap-4");
  });

  test("handles missing description gracefully", () => {
    render(<BlockNumber {...baseProps} />);

    expect(screen.queryByText("hidden")).not.toBeInTheDocument();
  });

  test("renders correctly with dynamic title", () => {
    render(<BlockNumber {...baseProps} title={<span>Dynamic Title</span>} />);

    expect(screen.getByText("Dynamic Title")).toBeInTheDocument();
  });
});
