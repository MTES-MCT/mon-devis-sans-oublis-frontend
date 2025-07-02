import { usePathname } from "next/navigation";
import { renderHook } from "@testing-library/react";

import { useConseillerRoutes } from "../useConseillerRoutes";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("useConseillerRoutes", () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns isConseillerAndEdit true when path includes both conseiller", () => {
    mockUsePathname.mockReturnValue("/conseiller/123");

    const { result } = renderHook(() => useConseillerRoutes());

    expect(result.current.isConseillerAndEdit).toBe(true);
  });

  it("returns both false when path does not include conseiller", () => {
    mockUsePathname.mockReturnValue("/autre/chemin");

    const { result } = renderHook(() => useConseillerRoutes());

    expect(result.current.isConseillerAndEdit).toBe(false);
  });

  it("handles null pathname gracefully", () => {
    mockUsePathname.mockReturnValue(null);

    const { result } = renderHook(() => useConseillerRoutes());

    expect(result.current.isConseillerAndEdit).toBe(false);
  });
});
