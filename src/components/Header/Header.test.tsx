import { render, screen } from "@testing-library/react";

import Header from "./Header";

describe("Header", () => {
  const defaultProps = {
    affiliatedMinistry: "Ministry of Testing",
    buttons: [
      {
        href: "/test-link",
        icon: "fr-icon-test",
        label: "Test Button",
      },
    ],
    organizationDescription: "Test Description",
    organizationLink: "/org-link",
    organizationName: "Test Organization",
  };

  it("renders header with all required props", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("Ministry of Testing")).toBeInTheDocument();
    expect(screen.getByText("Test Organization")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    const button = screen.getByRole("link", { name: "Test Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/test-link");
    expect(button).toHaveClass("fr-btn", "fr-icon-test");
  });

  it("renders beta badge when beta prop is provided", () => {
    render(<Header {...defaultProps} beta="Beta" />);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("does not render beta badge when beta prop is not provided", () => {
    render(<Header {...defaultProps} />);
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });

  it("renders multiple buttons when provided", () => {
    const propsWithMultipleButtons = {
      ...defaultProps,
      buttons: [
        {
          href: "/link-1",
          icon: "fr-icon-1",
          label: "Button 1",
        },
        {
          href: "/link-2",
          icon: "fr-icon-2",
          label: "Button 2",
        },
      ],
    };

    render(<Header {...propsWithMultipleButtons} />);

    const buttons = screen.getAllByRole("link");
    expect(buttons).toHaveLength(3);

    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
  });

  it("renders organization link with correct title", () => {
    render(<Header {...defaultProps} />);

    const orgLink = screen.getByTitle(
      "Accueil - Test Organization - Ministry of Testing"
    );
    expect(orgLink).toBeInTheDocument();
    expect(orgLink).toHaveAttribute("href", "/org-link");
  });
});
