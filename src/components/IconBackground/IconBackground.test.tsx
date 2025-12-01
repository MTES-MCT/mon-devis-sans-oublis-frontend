import React from "react";
import { render } from "@testing-library/react";
import IconBackground, {
  IconBackgroundProps,
  IconBackgroundVariant,
} from "./IconBackground";

describe("IconBackground", () => {
  const renderComponent = (props: IconBackgroundProps) =>
    render(<IconBackground {...props} />);

  test("renders with the BLUE variant", () => {
    const { container } = renderComponent({
      icon: "test-icon",
      variant: IconBackgroundVariant.BLUE,
    });

    const element = container.firstChild;
    expect(element).toHaveClass("test-icon");
    expect(element).toHaveClass(
      "bg-[var(--background-action-high-blue-france)] text-white"
    );
  });

  test("renders with the BLUE_LIGHT variant", () => {
    const { container } = renderComponent({
      icon: "test-icon",
      variant: IconBackgroundVariant.BLUE_LIGHT,
    });

    const element = container.firstChild;
    expect(element).toHaveClass("test-icon");
    expect(element).toHaveClass(
      "bg-[var(--background-contrast-info)] text-[var(--background-action-high-blue-france)]"
    );
  });

  test("renders with the WHITE variant", () => {
    const { container } = renderComponent({
      icon: "test-icon",
      variant: IconBackgroundVariant.WHITE,
    });

    const element = container.firstChild;
    expect(element).toHaveClass("test-icon");
    expect(element).toHaveClass("bg-white");
    expect(element).toHaveClass(
      "text-[var(--background-action-high-blue-france)]"
    );
    expect(element).toHaveClass("border-blue"); // Check for border-blue
  });

  test("applies the correct icon class", () => {
    const { container } = renderComponent({
      icon: "custom-icon",
      variant: IconBackgroundVariant.WHITE,
    });

    const element = container.firstChild;
    expect(element).toHaveClass("custom-icon");
  });
});
