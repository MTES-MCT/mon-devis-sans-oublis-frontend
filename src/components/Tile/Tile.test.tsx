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

  describe("Mode vertical (par défaut)", () => {
    it("renders without image or icon", () => {
      render(<Tile {...mockProps} />);

      const titleLink = screen.getByRole("link", { name: mockProps.title });
      expect(titleLink).toHaveAttribute("href", mockProps.href);
      expect(screen.getByText(mockProps.description)).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.queryByTestId("svg-loader")).not.toBeInTheDocument();

      // Vérifier que c'est bien en mode vertical par défaut
      const tile = titleLink.closest(".fr-tile");
      expect(tile).toHaveClass("fr-tile--vertical");
      expect(tile).not.toHaveClass("fr-tile--horizontal");
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

      // Vérifier qu'il n'y a pas de header en mode vertical
      const tile = image.closest(".fr-tile");
      expect(tile?.querySelector(".fr-tile__header")).not.toBeInTheDocument();
    });

    it("renders with icon", () => {
      const propsWithIcon = {
        ...mockProps,
        icon: "tools-fill",
      };

      render(<Tile {...propsWithIcon} />);

      const svgLoader = screen.getByTestId("svg-loader");
      expect(svgLoader).toHaveAttribute(
        "data-src",
        "/svg/design/tools-fill.svg"
      );
      expect(svgLoader).toHaveAttribute(
        "data-color",
        "var(--background-action-high-blue-france)"
      );

      // Vérifier qu'il n'y a qu'un seul SVG en mode vertical
      const svgLoaders = screen.getAllByTestId("svg-loader");
      expect(svgLoaders).toHaveLength(1);
    });

    it("applies correct classes based on image prop", () => {
      const propsWithImage = {
        ...mockProps,
        image: "/test-image.jpg",
      };

      const { rerender } = render(<Tile {...propsWithImage} />);

      const titleWithImage = screen.getByRole("link", {
        name: mockProps.title,
      });
      expect(titleWithImage).toHaveClass("text-[var(--text-title-grey)]!");

      const descriptionWithImage = screen.getByText(mockProps.description);
      expect(descriptionWithImage).toHaveClass("text-center");

      rerender(<Tile {...mockProps} />);

      const titleWithoutImage = screen.getByRole("link", {
        name: mockProps.title,
      });
      expect(titleWithoutImage).not.toHaveClass(
        "text-[var(--text-title-grey)]!"
      );

      const descriptionWithoutImage = screen.getByText(mockProps.description);
      expect(descriptionWithoutImage).toHaveClass("self-start", "text-left");
    });
  });

  describe("Mode horizontal", () => {
    it("renders horizontal tile", () => {
      const horizontalProps = {
        ...mockProps,
        horizontal: true,
      };

      render(<Tile {...horizontalProps} />);

      const tile = screen
        .getByRole("link", { name: mockProps.title })
        .closest(".fr-tile");
      expect(tile).toHaveClass("fr-tile--horizontal");
      expect(tile).not.toHaveClass("fr-tile--vertical");

      // Vérifier que la description est toujours affichée
      expect(screen.getByText(mockProps.description)).toBeInTheDocument();
      expect(screen.getByText(mockProps.description)).toHaveClass(
        "fr-tile__detail"
      );
    });

    it("renders horizontal tile with tag", () => {
      const horizontalPropsWithTag = {
        ...mockProps,
        horizontal: true,
        tag: "Test Tag",
      };

      render(<Tile {...horizontalPropsWithTag} />);

      const tag = screen.getByText("Test Tag");
      expect(tag).toHaveClass("fr-tag");
      expect(tag.closest(".fr-tile__start")).toBeInTheDocument();
    });

    it("renders horizontal tile with icon in header", () => {
      const horizontalPropsWithIcon = {
        ...mockProps,
        horizontal: true,
        icon: "tools-fill",
      };

      render(<Tile {...horizontalPropsWithIcon} />);

      const svgLoader = screen.getByTestId("svg-loader");
      expect(svgLoader).toHaveAttribute(
        "data-src",
        "/svg/design/tools-fill.svg"
      );

      // Vérifier que l'icône est dans le header
      const header = screen
        .getByTestId("svg-loader")
        .closest(".fr-tile__header");
      expect(header).toBeInTheDocument();
      expect(header?.querySelector(".fr-tile__pictogram")).toBeInTheDocument();
    });

    it("renders horizontal tile with image in header", () => {
      const horizontalPropsWithImage = {
        ...mockProps,
        horizontal: true,
        image: "/test-image.jpg",
      };

      render(<Tile {...horizontalPropsWithImage} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/test-image.jpg");

      // Vérifier que l'image est dans le header
      const header = image.closest(".fr-tile__header");
      expect(header).toBeInTheDocument();
      expect(header?.querySelector(".fr-tile__pictogram")).toBeInTheDocument();
    });

    it("does not render header without icon or image", () => {
      const horizontalProps = {
        ...mockProps,
        horizontal: true,
      };

      render(<Tile {...horizontalProps} />);

      // Pas de header si pas d'icône ou d'image
      const tile = screen
        .getByRole("link", { name: mockProps.title })
        .closest(".fr-tile");
      expect(tile?.querySelector(".fr-tile__header")).not.toBeInTheDocument();
    });

    it("does not show tag without tag prop", () => {
      const horizontalProps = {
        ...mockProps,
        horizontal: true,
      };

      render(<Tile {...horizontalProps} />);

      const tile = screen
        .getByRole("link", { name: mockProps.title })
        .closest(".fr-tile");
      expect(tile?.querySelector(".fr-tile__start")).not.toBeInTheDocument();
      expect(tile?.querySelector(".fr-tag")).not.toBeInTheDocument();
    });
  });

  describe("Accessibilité et structure", () => {
    it("has proper link structure", () => {
      render(<Tile {...mockProps} />);

      const titleLink = screen.getByRole("link", { name: mockProps.title });
      expect(titleLink).toHaveAttribute("href", mockProps.href);
      expect(titleLink.tagName).toBe("A");
    });

    it("has proper heading structure", () => {
      render(<Tile {...mockProps} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(mockProps.title);
      expect(heading).toHaveClass("fr-tile__title");
    });

    it("maintains enlarge-link functionality", () => {
      render(<Tile {...mockProps} />);

      const tile = screen
        .getByRole("link", { name: mockProps.title })
        .closest(".fr-tile");
      expect(tile).toHaveClass("fr-enlarge-link");
    });
  });
});
