describe("env schema validation", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("ne jette pas d’erreur si toutes les variables obligatoires sont valides", () => {
    process.env = {
      ...process.env,
      NEXT_PUBLIC_API_AUTH: "https://api.example.com",
      NEXT_PUBLIC_API_QUOTE_CHECKS: "https://api.example.com/checks",
      NEXT_PUBLIC_API_QUOTE_CHECKS_DELETE_ERROR_DETAIL_REASONS:
        "https://api.example.com/delete",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID: "https://api.example.com/id",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID:
        "https://api.example.com/details",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID_FEEDBACKS:
        "https://api.example.com/feedbacks",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID_FEEDBACKS:
        "https://api.example.com/detail-feedbacks",
      NEXT_PUBLIC_API_QUOTE_CHECKS_METADATA: "https://api.example.com/meta",
      NEXT_PUBLIC_API_STATS: "https://api.example.com/stats",
      NODE_ENV: "development",

      // optionnels
      NEXT_PUBLIC_MATOMO_SITE_ID: "123",
      NEXT_PUBLIC_MATOMO_URL: "https://matomo.example.com",
      NEXT_PUBLIC_SENTRY_DSN: "https://sentry.io/abc",
      NEXT_PUBLIC_SENTRY_ORG: "org",
      NEXT_PUBLIC_SENTRY_PROJECT: "proj",
      NEXT_PUBLIC_SENTRY_URL: "https://sentry.io",
    };

    expect(() => {
      require("./env");
    }).not.toThrow();
  });

  it("jette une erreur si une variable obligatoire est absente", () => {
    process.env = {
      NODE_ENV: "development",
    } as any;

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      require("./env");
    }).toThrow("Invalid environment variables");

    consoleSpy.mockRestore();
  });

  it("accepte les variables optionnelles manquantes", () => {
    process.env = {
      ...process.env,
      NEXT_PUBLIC_API_AUTH: "https://api.example.com",
      NEXT_PUBLIC_API_QUOTE_CHECKS: "https://api.example.com/checks",
      NEXT_PUBLIC_API_QUOTE_CHECKS_DELETE_ERROR_DETAIL_REASONS:
        "https://api.example.com/delete",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID: "https://api.example.com/id",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID:
        "https://api.example.com/details",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID_FEEDBACKS:
        "https://api.example.com/feedbacks",
      NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID_FEEDBACKS:
        "https://api.example.com/detail-feedbacks",
      NEXT_PUBLIC_API_QUOTE_CHECKS_METADATA: "https://api.example.com/meta",
      NEXT_PUBLIC_API_STATS: "https://api.example.com/stats",
      NODE_ENV: "development",
      // pas de sentry ni matomo
    };

    expect(() => {
      require("./env");
    }).not.toThrow();
  });
});
