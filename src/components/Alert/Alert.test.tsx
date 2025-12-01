import { render, screen, fireEvent } from "@testing-library/react";

import Alert, { AlertType } from "./Alert";
import wording from "@/wording";

describe("Alert Component", () => {
  const defaultProps = {
    description: "This is an alert message",
    moreDescription: "Here is some more information about the alert",
    type: AlertType.INFO,
  };

  describe("Rendering", () => {
    it("renders info alert with correct styling", () => {
      render(<Alert {...defaultProps} />);
      const alertElement = screen
        .getByText(/this is an alert message/i)
        .closest("div");
      expect(alertElement).toHaveClass("fr-alert", "fr-alert--info");
    });

    it("renders success alert with correct styling", () => {
      render(<Alert {...defaultProps} type={AlertType.SUCCESS} />);
      const alertElement = screen
        .getByText(/this is an alert message/i)
        .closest("div");
      expect(alertElement).toHaveClass("fr-alert", "fr-alert--success");
    });

    it("renders description text", () => {
      render(<Alert {...defaultProps} />);
      expect(screen.getByText(/this is an alert message/i)).toBeInTheDocument();
    });

    it("applies custom className if provided", () => {
      const customClass = "custom-alert-class";
      render(<Alert {...defaultProps} className={customClass} />);
      const alertElement = screen
        .getByText(/this is an alert message/i)
        .closest("div");
      expect(alertElement).toHaveClass(customClass);
    });
  });

  describe("More Description Toggle", () => {
    it("does not show more description toggle when moreDescription is not provided", () => {
      render(<Alert {...defaultProps} moreDescription={undefined} />);
      expect(
        screen.queryByText(wording.components.alert.see_more)
      ).not.toBeInTheDocument();
    });

    it("shows more description toggle when moreDescription is provided", () => {
      render(<Alert {...defaultProps} />);
      expect(
        screen.getByText(wording.components.alert.see_more)
      ).toBeInTheDocument();
    });

    it("hides more description by default", () => {
      render(<Alert {...defaultProps} />);
      expect(
        screen.queryByText(/here is some more information/i)
      ).not.toBeInTheDocument();
    });

    it("toggles more description visibility when clicked", () => {
      render(<Alert {...defaultProps} />);

      // Initial state - more description is hidden
      const toggleButton = screen.getByText(wording.components.alert.see_more);
      expect(
        screen.queryByText(/here is some more information/i)
      ).not.toBeInTheDocument();

      // Click to show more
      fireEvent.click(toggleButton);
      expect(
        screen.getByText(/here is some more information/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(wording.components.alert.see_less)
      ).toBeInTheDocument();

      // Click to hide
      fireEvent.click(screen.getByText(wording.components.alert.see_less));
      expect(
        screen.queryByText(/here is some more information/i)
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(wording.components.alert.see_more)
      ).toBeInTheDocument();
    });

    it("has correct styling for toggle button", () => {
      render(<Alert {...defaultProps} />);
      const toggleButton = screen.getByText(wording.components.alert.see_more);
      expect(toggleButton).toHaveClass(
        "text-[var(--text-default-grey)]",
        "cursor-pointer",
        "underline"
      );
    });
  });
});
