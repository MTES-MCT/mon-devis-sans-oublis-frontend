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

  it("renders links with single quotes correctly", () => {
    render(
      <>{richTextParser("<a href='https://example.com'>Link text</a>")}</>
    );

    const link = screen.getByRole("link", { name: "Link text" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders links with double quotes correctly", () => {
    render(
      <>{richTextParser('<a href="https://example.com">Link text</a>')}</>
    );

    const link = screen.getByRole("link", { name: "Link text" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders links with additional attributes", () => {
    render(
      <>
        {richTextParser(
          '<a href="https://example.com" class="custom-class">External link</a>'
        )}
      </>
    );

    const link = screen.getByRole("link", { name: "External link" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders line breaks correctly", () => {
    const { container } = render(<>{richTextParser("Line 1<br>Line 2")}</>);

    expect(container.querySelector("br")).toBeInTheDocument();
    expect(container).toHaveTextContent("Line 1");
    expect(container).toHaveTextContent("Line 2");
  });

  it("renders self-closing line breaks correctly", () => {
    const { container } = render(<>{richTextParser("Line 1<br/>Line 2")}</>);

    expect(container.querySelector("br")).toBeInTheDocument();
    expect(container).toHaveTextContent("Line 1");
    expect(container).toHaveTextContent("Line 2");
  });

  it("handles multiple formatting elements together", () => {
    const { container } = render(
      <>
        {richTextParser(
          'Start <strong>bold</strong> <a href="https://example.com">link</a><br>new line'
        )}
      </>
    );

    expect(screen.getByText("bold")).toHaveClass("font-bold");
    const link = screen.getByText("link");
    expect(link.closest("a")).toHaveAttribute("href", "https://example.com");
    expect(container).toHaveTextContent("new line");
  });

  it("handles the real-world RGE solution example", () => {
    const solution =
      'La structure est bien habilitée, mais le numéro RGE pour ce geste (N°E-E178489) n\'est pas mentionné sur le devis. Vous pouvez utiliser notre outil de vérification RGE pour le retrouver sur <a href="https://staging.mon-devis-sans-oublis.beta.gouv.fr/rge">https://staging.mon-devis-sans-oublis.beta.gouv.fr/rge</a>.';

    render(<>{richTextParser(solution)}</>);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://staging.mon-devis-sans-oublis.beta.gouv.fr/rge"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent(
      "https://staging.mon-devis-sans-oublis.beta.gouv.fr/rge"
    );
  });

  it("handles mixed quote styles in the same text", () => {
    render(
      <>
        {richTextParser(
          "Link 1: <a href=\"https://example1.com\">First</a> and Link 2: <a href='https://example2.com'>Second</a>"
        )}
      </>
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "https://example1.com");
    expect(links[1]).toHaveAttribute("href", "https://example2.com");
    expect(links).toHaveLength(2);
  });
});
