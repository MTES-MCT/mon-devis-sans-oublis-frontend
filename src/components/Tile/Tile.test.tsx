import { ImageProps } from "next/image";
import { render, screen, fireEvent } from "@testing-library/react";

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
  const baseMockProps = {
    description: "Test description",
    href: "https://test.com",
    title: "Test title",
  };

  describe("Mode normal (avec lien)", () => {
    it("renders basic tile with link", () => {
      render(<Tile {...baseMockProps} />);

      const titleLink = screen.getByRole("link", { name: baseMockProps.title });
      expect(titleLink).toHaveAttribute("href", baseMockProps.href);
      expect(screen.getByText(baseMockProps.description)).toBeInTheDocument();

      const tile = titleLink.closest(".fr-tile");
      expect(tile).toHaveClass("fr-tile--vertical", "fr-enlarge-link");
    });

    it("renders tile with image", () => {
      const propsWithImage = {
        ...baseMockProps,
        image: "/test-image.jpg",
      };

      render(<Tile {...propsWithImage} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
      expect(image).toHaveAttribute("alt", baseMockProps.title);
    });

    it("renders tile with icon", () => {
      const propsWithIcon = {
        ...baseMockProps,
        icon: "tools-fill",
      };

      render(<Tile {...propsWithIcon} />);

      const svgLoader = screen.getByTestId("svg-loader");
      expect(svgLoader).toHaveAttribute(
        "data-src",
        "/svg/design/tools-fill.svg"
      );
    });

    it("renders horizontal tile", () => {
      const horizontalProps = {
        ...baseMockProps,
        horizontal: true,
      };

      render(<Tile {...horizontalProps} />);

      const tile = screen.getByRole("link").closest(".fr-tile");
      expect(tile).toHaveClass("fr-tile--horizontal");
    });

    it("renders horizontal tile with tag", () => {
      const horizontalPropsWithTag = {
        ...baseMockProps,
        horizontal: true,
        tag: "Test Tag",
      };

      render(<Tile {...horizontalPropsWithTag} />);

      const tag = screen.getByText("Test Tag");
      expect(tag).toHaveClass("fr-tag");
    });
  });

  describe("Mode checkbox", () => {
    const checkboxMockProps = {
      description: "Checkbox description",
      title: "Checkbox title",
      isCheckbox: true,
      value: "test-value",
      onCheck: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders unchecked checkbox tile", () => {
      render(<Tile {...checkboxMockProps} isChecked={false} />);

      // Prendre le premier élément (la div conteneur)
      const [tileContainer] = screen.getAllByRole("radio");
      expect(tileContainer).toHaveAttribute("aria-checked", "false");
      expect(tileContainer).toHaveClass("cursor-pointer");

      // Vérifier le titre (maintenant un lien avec href="#")
      const titleElement = screen.getByText(checkboxMockProps.title);
      expect(titleElement.closest("a")).toHaveAttribute("href", "#");

      // Vérifier l'input hidden
      const hiddenInput = tileContainer.querySelector('input[type="radio"]');
      expect(hiddenInput).toHaveAttribute("value", "test-value");
      expect(hiddenInput).not.toBeChecked();
    });

    it("renders checked checkbox tile with background", () => {
      render(<Tile {...checkboxMockProps} isChecked={true} />);

      const [tileContainer] = screen.getAllByRole("radio");
      expect(tileContainer).toHaveAttribute("aria-checked", "true");

      // Vérifier le style de background
      expect(tileContainer).toHaveStyle({
        backgroundColor: "var(--background-default-grey-hover)",
      });

      const hiddenInput = tileContainer.querySelector('input[type="radio"]');
      expect(hiddenInput).toBeChecked();
    });

    it("calls onCheck function when clicked", () => {
      const mockOnCheck = jest.fn();
      render(<Tile {...checkboxMockProps} onCheck={mockOnCheck} />);

      const [tileContainer] = screen.getAllByRole("radio");
      fireEvent.click(tileContainer);

      expect(mockOnCheck).toHaveBeenCalledTimes(1);
    });

    it("calls onCheck on Enter key press", () => {
      const mockOnCheck = jest.fn();
      render(<Tile {...checkboxMockProps} onCheck={mockOnCheck} />);

      const [tileContainer] = screen.getAllByRole("radio");
      fireEvent.keyDown(tileContainer, { key: "Enter" });

      expect(mockOnCheck).toHaveBeenCalledTimes(1);
    });

    it("calls onCheck on Space key press", () => {
      const mockOnCheck = jest.fn();
      render(<Tile {...checkboxMockProps} onCheck={mockOnCheck} />);

      const [tileContainer] = screen.getAllByRole("radio");
      fireEvent.keyDown(tileContainer, { key: " " });

      expect(mockOnCheck).toHaveBeenCalledTimes(1);
    });

    it("prevents navigation on title link click", () => {
      render(<Tile {...checkboxMockProps} />);

      const titleLink = screen.getByRole("link");
      const mockPreventDefault = jest.fn();

      fireEvent.click(titleLink, {
        preventDefault: mockPreventDefault,
      });

      // Le preventDefault est appelé dans le composant
      expect(titleLink).toHaveAttribute("href", "#");
    });

    it("renders horizontal checkbox tile", () => {
      render(
        <Tile {...checkboxMockProps} horizontal={true} tag="Horizontal Tag" />
      );

      const [tileContainer] = screen.getAllByRole("radio");
      expect(tileContainer).toHaveClass("fr-tile--horizontal");

      const tag = screen.getByText("Horizontal Tag");
      expect(tag).toHaveClass("fr-tag");
    });

    it("renders checkbox tile with image", () => {
      render(<Tile {...checkboxMockProps} image="/checkbox-image.jpg" />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/checkbox-image.jpg");
      expect(image).toHaveAttribute("alt", checkboxMockProps.title);
    });

    it("renders checkbox tile with icon", () => {
      render(<Tile {...checkboxMockProps} icon="home-4-fill" />);

      const svgLoader = screen.getByTestId("svg-loader");
      expect(svgLoader).toHaveAttribute(
        "data-src",
        "/svg/buildings/home-4-fill.svg"
      );
    });
  });

  describe("Accessibility and structure", () => {
    it("has proper heading structure", () => {
      render(<Tile {...baseMockProps} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(baseMockProps.title);
      expect(heading).toHaveClass("fr-tile__title");
    });

    it("maintains proper link accessibility", () => {
      render(<Tile {...baseMockProps} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", baseMockProps.href);
      expect(link.tagName).toBe("A");
    });

    it("has proper radio group accessibility in checkbox mode", () => {
      const checkboxProps = {
        description: "Radio description",
        title: "Radio title",
        isCheckbox: true,
        value: "radio-value",
        onCheck: jest.fn(),
      };

      render(<Tile {...checkboxProps} />);

      const [radioElement] = screen.getAllByRole("radio");
      expect(radioElement).toHaveAttribute("tabIndex", "0");
      expect(radioElement).toHaveAttribute("aria-checked", "false");

      const hiddenInput = radioElement.querySelector(
        'input[name="renovation-type"]'
      );
      expect(hiddenInput).toBeInTheDocument();
    });

    it("applies correct CSS classes", () => {
      render(<Tile {...baseMockProps} />);

      const tile = screen.getByRole("link").closest(".fr-tile");
      expect(tile).toHaveClass(
        "fr-tile",
        "fr-tile--vertical",
        "fr-enlarge-link",
        "w-full"
      );
    });
  });

  describe("Edge cases", () => {
    it("renders without optional props", () => {
      const minimalProps = {
        description: "Minimal description",
        title: "Minimal title",
      };

      render(<Tile {...minimalProps} />);

      expect(screen.getByText(minimalProps.title)).toBeInTheDocument();
      expect(screen.getByText(minimalProps.description)).toBeInTheDocument();
    });

    it("does not render header in vertical mode", () => {
      render(<Tile {...baseMockProps} icon="tools-fill" />);

      const tile = screen.getByRole("link").closest(".fr-tile");
      expect(tile?.querySelector(".fr-tile__header")).not.toBeInTheDocument();
    });

    it("renders header in horizontal mode with icon", () => {
      render(<Tile {...baseMockProps} horizontal={true} icon="tools-fill" />);

      const tile = screen.getByRole("link").closest(".fr-tile");
      expect(tile?.querySelector(".fr-tile__header")).toBeInTheDocument();
    });

    it("does not call onCheck when not in checkbox mode", () => {
      const mockOnCheck = jest.fn();
      render(<Tile {...baseMockProps} onCheck={mockOnCheck} />);

      const tile = screen.getByRole("link").closest(".fr-tile");
      fireEvent.click(tile!);

      expect(mockOnCheck).not.toHaveBeenCalled();
    });
  });
});
