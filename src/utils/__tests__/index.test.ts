import { formatDateToFrench, initDsfr, richTextParser } from "../index";

// Mock des modules importés
jest.mock("../date", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../dsfr", () => ({
  initDsfr: jest.fn(),
}));

jest.mock("../richTextParser", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Utils exports", () => {
  it("should export formatDateToFrench function", () => {
    expect(formatDateToFrench).toBeDefined();
    expect(typeof formatDateToFrench).toBe("function");
  });

  it("should export initDsfr function", () => {
    expect(initDsfr).toBeDefined();
    expect(typeof initDsfr).toBe("function");
  });

  it("should export richTextParser function", () => {
    expect(richTextParser).toBeDefined();
    expect(typeof richTextParser).toBe("function");
  });
});
