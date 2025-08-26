import formatDateToFrench from "../date";

describe("formatDateToFrench", () => {
  it("should format a valid ISO date to French format", () => {
    const isoDate = "2020-01-01";
    expect(formatDateToFrench(isoDate)).toBe("1 janvier 2020");
  });

  it("should correctly format another valid ISO date", () => {
    const isoDate = "2023-12-25";
    expect(formatDateToFrench(isoDate)).toBe("25 décembre 2023");
  });

  it("should throw an error for an invalid date string", () => {
    const invalidDate = "not-a-date";
    expect(() => formatDateToFrench(invalidDate)).toThrow(
      "Invalid date format: 'not-a-date'"
    );
  });
});
