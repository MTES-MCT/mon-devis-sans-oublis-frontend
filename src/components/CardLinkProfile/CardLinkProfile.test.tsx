import { render, screen, fireEvent } from "@testing-library/react";

import CardLinkProfile from "./CardLinkProfile";
import { IconBackgroundVariant } from "../IconBackground/IconBackground";

// Mock the IconBackground component
jest.mock("../IconBackground/IconBackground", () => {
  return {
    __esModule: true,
    IconBackgroundVariant: {
      BLUE: "blue",
      BLUE_LIGHT: "blue-light",
      WHITE: "white",
    },
    default: ({ icon, variant }: { icon: string; variant: string }) => (
      <div
        data-testid="icon-background"
        data-icon={icon}
        data-variant={variant}
      />
    ),
  };
});

beforeAll(() => {
  document.documentElement.style.setProperty(
    "--background-default-grey-hover",
    "#f0f0f0"
  );
  document.documentElement.style.setProperty(
    "--background-default-grey-active",
    "#d0d0d0"
  );
});

describe("CardLinkProfile", () => {
  const defaultProps = {
    href: "/test-link",
    icon: "test-icon",
    title: "Test Title",
    description: "Test Description",
  };

  test("renders correctly with title, description, and icon", () => {
    render(<CardLinkProfile {...defaultProps} />);

    const link = screen.getByRole("link", { name: /test title/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", defaultProps.href);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();

    const iconBackgrounds = screen.getAllByTestId("icon-background");
    expect(iconBackgrounds).toHaveLength(2);
    expect(iconBackgrounds[0]).toHaveAttribute(
      "data-icon",
      `fr-icon-${defaultProps.icon}`
    );
    expect(iconBackgrounds[0]).toHaveAttribute(
      "data-variant",
      IconBackgroundVariant.WHITE
    );
    expect(iconBackgrounds[1]).toHaveAttribute(
      "data-icon",
      "fr-icon-arrow-right-line"
    );
    expect(iconBackgrounds[1]).toHaveAttribute(
      "data-variant",
      IconBackgroundVariant.BLUE
    );
  });

  test("applies hover and click styles correctly", () => {
    render(<CardLinkProfile {...defaultProps} />);

    const link = screen.getByRole("link", { name: /test title/i });

    // Check initial style
    expect(link).toHaveStyle({
      backgroundColor: "var(--background-default-grey-hover)",
    });

    // Simulate mouse over
    fireEvent.mouseOver(link);
    expect(link).toHaveStyle({
      backgroundColor: "var(--background-default-grey-active)",
    });

    // Simulate mouse out
    fireEvent.mouseOut(link);
    expect(link).toHaveStyle({
      backgroundColor: "var(--background-default-grey-hover)",
    });

    // Simulate mouse down
    fireEvent.mouseDown(link);
    expect(link).toHaveStyle({ backgroundColor: "#cecece" });

    // Simulate mouse up
    fireEvent.mouseUp(link);
    expect(link).toHaveStyle({
      backgroundColor: "var(--background-default-grey-active)",
    });
  });
});
