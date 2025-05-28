import { usePathname } from "next/navigation";
import { renderHook } from "@testing-library/react";

import { useGoBackToUpload } from "../useGoBackToUpload";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("useGoBackToUpload", () => {
  it("returns empty string when pathname is null", () => {
    (usePathname as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useGoBackToUpload());

    expect(result.current).toBe("");
  });

  it("returns first three segments of the path", () => {
    (usePathname as jest.Mock).mockReturnValue(
      "/segment1/segment2/segment3/segment4"
    );

    const { result } = renderHook(() => useGoBackToUpload());

    expect(result.current).toBe("/segment1/segment2");
  });

  it("returns full path when less than three segments", () => {
    (usePathname as jest.Mock).mockReturnValue("/segment1/segment2/segment3");

    const { result } = renderHook(() => useGoBackToUpload());

    expect(result.current).toBe("/segment1/segment2");
  });

  it("returns root path when only root is provided", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    const { result } = renderHook(() => useGoBackToUpload());

    expect(result.current).toBe("/");
  });

  it("handles empty string pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("");

    const { result } = renderHook(() => useGoBackToUpload());

    expect(result.current).toBe("");
  });
});
