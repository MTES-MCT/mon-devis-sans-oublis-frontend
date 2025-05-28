import { render, screen, waitFor } from "@testing-library/react";

import SVGLoader from "./SvgLoader";

const mockSvgContent = '<svg><path d="M10 10"></path></svg>';
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(mockSvgContent),
  } as Response)
);

describe("SVGLoader Component", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders SVG content with default props", async () => {
    render(<SVGLoader src="/test.svg" />);

    await waitFor(() => {
      const svgContainer = screen.getByTestId("svg-container");
      expect(svgContainer).toHaveClass("inline-block");
      expect(svgContainer).toHaveStyle({
        color: "currentColor",
        height: "56px",
        width: "56px",
      });
    });

    expect(global.fetch).toHaveBeenCalledWith("/test.svg");
  });

  it("renders SVG content with custom props", async () => {
    const customProps = {
      color: "red",
      height: 100,
      src: "/custom.svg",
      width: 100,
    };

    render(<SVGLoader {...customProps} />);

    await waitFor(() => {
      const svgContainer = screen.getByTestId("svg-container");
      expect(svgContainer).toHaveStyle({
        color: "red",
        height: "100px",
        width: "100px",
      });
    });

    expect(global.fetch).toHaveBeenCalledWith("/custom.svg");
  });

  it("returns null when src is undefined", () => {
    render(<SVGLoader src={undefined} />);
    expect(screen.queryByTestId("svg-container")).not.toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    render(<SVGLoader src="/error.svg" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur de chargement du SVG :",
        expect.any(Error)
      );
    });

    expect(screen.queryByTestId("svg-container")).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("replaces fill attributes with currentColor", async () => {
    const svgWithFill = '<svg><path fill="blue" d="M10 10"></path></svg>';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(svgWithFill),
    });

    render(<SVGLoader src="/test.svg" />);

    await waitFor(() => {
      const svgContainer = screen.getByTestId("svg-container");
      expect(svgContainer.innerHTML).toBe(
        '<svg><path fill="currentColor" d="M10 10"></path></svg>'
      );
    });
  });
});
