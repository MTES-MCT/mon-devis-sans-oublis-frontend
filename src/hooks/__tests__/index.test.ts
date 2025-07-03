import {
  useIsConseiller,
  useUserProfile,
  useIsDesktop,
  useScrollPosition,
} from "../index";

describe("hooks index", () => {
  it("should export all hooks", () => {
    expect(useUserProfile).toBeDefined();
    expect(useIsConseiller).toBeDefined();
    expect(useIsDesktop).toBeDefined();
    expect(useScrollPosition).toBeDefined();
  });
});
