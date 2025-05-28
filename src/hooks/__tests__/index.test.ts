import {
  useConseillerRoutes,
  useGoBackToUpload,
  useIsDesktop,
  useScrollPosition,
} from "../index";

describe("hooks index", () => {
  it("should export all hooks", () => {
    expect(useConseillerRoutes).toBeDefined();
    expect(useGoBackToUpload).toBeDefined();
    expect(useIsDesktop).toBeDefined();
    expect(useScrollPosition).toBeDefined();
  });
});
