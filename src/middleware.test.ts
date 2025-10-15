import { NextRequest, NextResponse } from "next/server";
import { middleware } from "./middleware";

describe("middleware", () => {
  describe("Query parameters preservation", () => {
    it("should preserve query parameters when redirecting /devis/:id", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/devis/abc123?mtm_campaign=api&foo=bar")
      );

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(307); // Temporary redirect
      const location = response?.headers.get("location");
      expect(location).toContain("/particulier/devis/abc123");
      expect(location).toContain("mtm_campaign=api");
      expect(location).toContain("foo=bar");
    });

    it("should preserve query parameters when redirecting /dossier/:id", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/dossier/xyz789?mtm_campaign=api")
      );

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(307);
      const location = response?.headers.get("location");
      expect(location).toContain("/particulier/dossier/xyz789");
      expect(location).toContain("mtm_campaign=api");
    });

    it("should not redirect URLs that already have a profile prefix", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/artisan/devis/abc123?mtm_campaign=api")
      );

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(200); // No redirect
    });
  });

  describe("Path matching", () => {
    it("should redirect /devis/:id to /particulier/devis/:id", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/devis/abc123")
      );

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const location = response?.headers.get("location");
      expect(location).toBe("/particulier/devis/abc123");
    });

    it("should redirect /dossier/:id to /particulier/dossier/:id", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/dossier/xyz789")
      );

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const location = response?.headers.get("location");
      expect(location).toBe("/particulier/dossier/xyz789");
    });

    it("should not redirect paths with more than one segment after /devis", () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/devis/abc123/something")
      );

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response?.status).toBe(200); // No redirect
    });
  });
});
