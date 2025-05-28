import { render, screen } from "@testing-library/react";

import Card, { CardProps } from "./Card";

describe("Card Component", () => {
  const baseProps: CardProps = {
    title: "Test Card",
    children: <p>Card content</p>,
  };

  test("renders correctly with default props", () => {
    render(<Card {...baseProps} />);

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  test("does not render an image when the image prop is not provided", () => {
    render(<Card {...baseProps} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("renders dynamic children correctly", () => {
    render(
      <Card {...baseProps}>
        <span>Dynamic Child</span>
      </Card>
    );

    expect(screen.getByText("Dynamic Child")).toBeInTheDocument();
  });
});
