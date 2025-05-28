import { render, screen } from "@testing-library/react";

import richTextParser from "../richTextParser";

describe("richTextParser", () => {
  it("renders plain text without any formatting", () => {
    const { container } = render(<>{richTextParser("Simple text")}</>);
    expect(container).toHaveTextContent("Simple text");
  });

  it("renders bold text correctly", () => {
    render(<>{richTextParser("This is <strong>bold</strong> text")}</>);

    const boldElement = screen.getByText("bold");
    expect(boldElement).toHaveClass("font-bold");
    expect(screen.getByText(/This is/)).toBeInTheDocument();
    expect(screen.getByText(/text/)).toBeInTheDocument();
  });

  it("renders links correctly", () => {
    render(
      <>{richTextParser("<a href='https://example.com'>Link text</a>")}</>
    );

    const link = screen.getByRole("link", { name: "Link text" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders links with target and rel attributes", () => {
    render(
      <>
        {richTextParser(
          "<a href='https://example.com' target='_blank'>External link</a>"
        )}
      </>
    );

    const link = screen.getByRole("link", { name: "External link" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders line breaks correctly", () => {
    const { container } = render(<>{richTextParser("Line 1<br>Line 2")}</>);

    expect(container.querySelector("br")).toBeInTheDocument();
    expect(container).toHaveTextContent("Line 1");
    expect(container).toHaveTextContent("Line 2");
  });

  it("handles multiple formatting elements together", () => {
    const { container } = render(
      <>
        {richTextParser(
          "Start <strong>bold</strong> <a href='https://example.com'>link</a><br>new line"
        )}
      </>
    );

    expect(screen.getByText("bold")).toHaveClass("font-bold");
    const link = screen.getByText("link");
    expect(link.closest("a")).toHaveAttribute("href", "https://example.com");
    expect(container).toHaveTextContent("new line");
  });

  it("preserves custom link attributes", () => {
    render(
      <>
        {richTextParser(
          "<a href='https://example.com' target='_self' rel='nofollow'>Custom link</a>"
        )}
      </>
    );

    const link = screen.getByRole("link", { name: "Custom link" });
    expect(link).toHaveAttribute("target", "_self");
    expect(link).toHaveAttribute("rel", "nofollow");
  });
});
