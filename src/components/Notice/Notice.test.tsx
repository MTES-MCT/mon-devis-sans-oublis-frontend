import { render, screen, fireEvent } from "@testing-library/react";

import Notice from "./Notice";

describe("Notice", () => {
  it("renders with required props", () => {
    render(
      <Notice className="fr-notice--info" description="Test description" />
    );
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders with title", () => {
    render(
      <Notice
        className="fr-notice--info"
        title="Test title"
        description="Test description"
      />
    );
    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(
      <Notice className="fr-notice--info" description="Test description" />
    );
    const notice = screen.getByText("Test description").closest(".fr-notice");
    expect(notice).toHaveClass("fr-notice--info");
  });

  it("renders with close button and can be closed", () => {
    render(
      <Notice
        buttonClose={true}
        className="fr-notice--info"
        description="Test description"
      />
    );

    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("applies warning-icon class when className includes warning", () => {
    render(
      <Notice
        className="fr-notice--warning"
        description="Test description"
        title="Warning Title"
      />
    );

    const title = screen.getByText("Warning Title");
    expect(title).toHaveClass("fr-notice__title fr-icon-edit-box-fill");
  });

  it("does not apply warning-icon class for non-warning notices", () => {
    render(
      <Notice
        className="fr-notice--info"
        description="Test description"
        title="Info Title"
      />
    );

    const title = screen.getByText("Info Title");
    expect(title).not.toHaveClass("warning-icon");
  });
});
