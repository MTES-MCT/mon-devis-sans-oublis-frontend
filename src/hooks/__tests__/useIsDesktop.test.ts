import { renderHook, act } from "@testing-library/react";

import { useIsDesktop } from "../useIsDesktop";

describe("useIsDesktop Hook", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
  });

  it("returns true when window width is above default breakpoint (768px)", () => {
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);
  });

  it("returns false when window width is below default breakpoint (768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 600,
    });

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
  });

  it("returns true when window width is above custom breakpoint", () => {
    const { result } = renderHook(() => useIsDesktop(900));

    expect(result.current).toBe(true);
  });

  it("returns false when window width is below custom breakpoint", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 800,
    });

    const { result } = renderHook(() => useIsDesktop(900));

    expect(result.current).toBe(false);
  });

  it("updates value when window is resized", () => {
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 700,
      });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 900,
      });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(true);
  });

  it("cleans up resize event listener on unmount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useIsDesktop());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
