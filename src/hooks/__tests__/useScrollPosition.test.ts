import { renderHook, act } from "@testing-library/react";

import { useScrollPosition } from "../useScrollPosition";

describe("useScrollPosition Hook", () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    window.scrollY = 0;
  });

  it("returns true initially (default threshold)", () => {
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current).toBe(true);
  });

  it("returns false when scrolled past threshold", () => {
    const { result } = renderHook(() => useScrollPosition(0.5));

    act(() => {
      window.scrollY = 1000;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("returns true when scrolled back above threshold", () => {
    const { result } = renderHook(() => useScrollPosition(0.5));

    act(() => {
      window.scrollY = 1000;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("cleans up scroll event listener on unmount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollPosition());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
