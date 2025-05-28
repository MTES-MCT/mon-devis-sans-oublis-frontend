import { ImageProps } from "next/image";
import { render, screen } from "@testing-library/react";

import Tile from "./Tile";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={props.alt}
      height={props.height}
      src={props.src as string}
      width={props.width}
    />
  ),
}));

jest.mock("../SvgLoader/SvgLoader", () => ({
  __esModule: true,
  default: ({ src, color }: { src: string; color: string }) => (
    <div data-testid="svg-loader" data-src={src} data-color={color} />
  ),
}));

describe("Tile Component", () => {
  const mockProps = {
    description: "Test description",
    href: "https://test.com",
    title: "Test title",
  };

  it("renders without image or icon", () => {
    render(<Tile {...mockProps} />);

    const titleLink = screen.getByRole("link", { name: mockProps.title });
    expect(titleLink).toHaveAttribute("href", mockProps.href);
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByTestId("svg-loader")).not.toBeInTheDocument();
  });

  it("renders with image", () => {
    const propsWithImage = {
      ...mockProps,
      image: "/test-image.jpg",
    };

    render(<Tile {...propsWithImage} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", propsWithImage.image);
    expect(image).toHaveAttribute("alt", propsWithImage.title);
    expect(image).toHaveAttribute("width", "80");
    expect(image).toHaveAttribute("height", "80");

    const body = screen.getByText(mockProps.description).parentElement
      ?.parentElement;
    expect(body).toHaveClass("justify-center", "items-center", "p-2");
  });

  it("renders with icon", () => {
    const propsWithIcon = {
      ...mockProps,
      icon: "tools-fill",
    };

    render(<Tile {...propsWithIcon} />);

    const svgLoader = screen.getByTestId("svg-loader");
    expect(svgLoader).toHaveAttribute("data-src", "/svg/design/tools-fill.svg");
    expect(svgLoader).toHaveAttribute(
      "data-color",
      "var(--background-action-high-blue-france)"
    );
  });

  it("applies correct classes based on image prop", () => {
    const propsWithImage = {
      ...mockProps,
      image: "/test-image.jpg",
    };

    const { rerender } = render(<Tile {...propsWithImage} />);

    const titleWithImage = screen.getByRole("link", { name: mockProps.title });
    expect(titleWithImage).toHaveClass("text-[var(--text-title-grey)]!");

    const descriptionWithImage = screen.getByText(mockProps.description);
    expect(descriptionWithImage).toHaveClass("text-center");

    rerender(<Tile {...mockProps} />);

    const titleWithoutImage = screen.getByRole("link", {
      name: mockProps.title,
    });
    expect(titleWithoutImage).not.toHaveClass("text-[var(--text-title-grey)]!");

    const descriptionWithoutImage = screen.getByText(mockProps.description);
    expect(descriptionWithoutImage).toHaveClass("self-start", "text-left");
  });
});
