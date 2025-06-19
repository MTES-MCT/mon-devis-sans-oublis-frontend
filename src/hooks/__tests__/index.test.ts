import { useConseillerRoutes, useIsDesktop, useScrollPosition } from "../index";

describe("hooks index", () => {
  it("should export all hooks", () => {
    expect(useConseillerRoutes).toBeDefined();
    expect(useIsDesktop).toBeDefined();
    expect(useScrollPosition).toBeDefined();
  });
});
