describe("dsfr", () => {
  let originalWindow: typeof global.window;

  beforeEach(() => {
    originalWindow = global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
    jest.resetModules();
  });

  it("should not initialize DSFR when window is undefined", async () => {
    delete (global as { window?: typeof global.window }).window;

    const { initDsfr } = await import("../dsfr");
    await initDsfr();
  });

  it("should initialize DSFR when window is defined", async () => {
    jest.mock("@gouvfr/dsfr/dist/dsfr.module.min.js", () => ({}));
    jest.mock("@gouvfr/dsfr/dist/dsfr.nomodule.min.js", () => ({}));

    const { initDsfr } = await import("../dsfr");
    await initDsfr();
  });
});
