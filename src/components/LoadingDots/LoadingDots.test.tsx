import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LoadingDots from "./LoadingDots";

jest.useFakeTimers();

describe("LoadingDots Component", () => {
  let clearIntervalSpy: jest.SpyInstance;

  beforeEach(() => {
    clearIntervalSpy = jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.clearAllTimers();
    clearIntervalSpy.mockRestore();
  });

  it("renders the title correctly", () => {
    render(<LoadingDots title="Loading" />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows dots animating over time", () => {
    render(<LoadingDots title="Loading" />);
    const dotsContainer = screen.getByText("Loading")
      .nextSibling as HTMLElement;

    expect(dotsContainer).toHaveTextContent("");

    // Simulate 500ms intervals for 3 cycles
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent(".");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent("..");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent("...");

    // Should reset after 3 dots
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent("");
  });

  it("clears interval on unmount", () => {
    const { unmount } = render(<LoadingDots title="Unmount Test" />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
