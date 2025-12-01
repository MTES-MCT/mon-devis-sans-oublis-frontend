import { render, screen } from "@testing-library/react";

import CardImage, { CardImageProps } from "./CardImage";

describe("CardImage Component", () => {
  const baseProps: CardImageProps = {
    description: "This is a test description.",
    image: "/test-image.webp",
    title: "Test Title",
  };

  test("renders correctly with all props", () => {
    render(<CardImage {...baseProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("This is a test description.")).toBeInTheDocument();

    const image = screen.getByAltText("Test Title");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
    expect(image.getAttribute("src")).toContain(
      encodeURIComponent("/test-image.webp")
    );
  });

  test("handles missing description gracefully", () => {
    render(
      <CardImage title="Test Title" image="/test-image.webp" description="" />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(
      screen.queryByText("This is a test description.")
    ).not.toBeInTheDocument();
  });
});
