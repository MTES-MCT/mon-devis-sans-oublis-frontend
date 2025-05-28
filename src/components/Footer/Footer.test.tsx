import { render, screen } from "@testing-library/react";

import Footer from "./Footer";

describe("Footer", () => {
  const defaultProps = {
    affiliatedMinistry: "Ministry of Testing",
    buttons: [
      {
        href: "/test-link",
        label: "Test Button",
      },
    ],
    organizationDescription: "Test Description",
    organizationLink: "/org-link",
    organizationName: "Test Organization",
  };

  it("renders footer with all required props", () => {
    render(<Footer {...defaultProps} />);

    expect(screen.getByText("Ministry of Testing")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    const button = screen.getByRole("link", { name: "Test Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/test-link");
  });

  it("renders multiple buttons when provided", () => {
    const propsWithMultipleButtons = {
      ...defaultProps,
      buttons: [
        {
          href: "/link-1",
          label: "Button 1",
        },
        {
          href: "/link-2",
          label: "Button 2",
        },
      ],
    };

    render(<Footer {...propsWithMultipleButtons} />);

    const buttons = screen.getAllByRole("link");
    expect(buttons).toHaveLength(4);

    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
  });

  it("renders organization link with correct title", () => {
    render(<Footer {...defaultProps} />);

    const orgLink = screen.getByTitle(
      "Accueil - Test Organization - Ministry of Testing"
    );
    expect(orgLink).toBeInTheDocument();
    expect(orgLink).toHaveAttribute("href", "/org-link");
  });

  it("renders bottom copy line from wording", () => {
    render(<Footer {...defaultProps} />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<Footer {...defaultProps} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveAttribute("id", "footer-7361");
  });
});
