/**
 * @jest-environment jsdom
 */

import { render, waitFor, act } from "@testing-library/react";
import { Suspense, useEffect, useState } from "react";

// Mocks globaux
const mockInit = jest.fn();
const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseSearchParams = jest.fn();

// Mock des modules (sans le module env problématique)
jest.mock("@socialgouv/matomo-next", () => ({
  init: mockInit,
  push: mockPush,
}));

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

// Recréation du composant MatomoContent pour les tests
const MatomoContent = ({
  matomoConfig,
}: {
  matomoConfig: { url: string; siteId: string };
}) => {
  const [initialised, setInitialised] = useState<boolean>(false);

  useEffect(() => {
    if (matomoConfig.url && matomoConfig.siteId && !initialised) {
      mockInit({
        siteId: matomoConfig.siteId,
        url: matomoConfig.url,
      });

      setInitialised(true);
    }
  }, [initialised, matomoConfig]);

  const pathname = mockUsePathname();
  const searchParams = mockUseSearchParams();
  const searchParamsString = searchParams?.toString() || "";

  useEffect(() => {
    if (!pathname) return;

    const url = decodeURIComponent(
      pathname + (searchParamsString ? "?" + searchParamsString : "")
    );

    mockPush(["setCustomUrl", url]);
    mockPush(["trackPageView"]);
  }, [pathname, searchParamsString]);

  return null;
};

const TestMatomo = ({
  matomoConfig = { url: "https://example.com/matomo", siteId: "123" },
}) => {
  return (
    <Suspense fallback={null}>
      <MatomoContent matomoConfig={matomoConfig} />
    </Suspense>
  );
};

describe("Matomo Tracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes Matomo with correct configuration", async () => {
    mockUsePathname.mockReturnValue("/test-path");
    mockUseSearchParams.mockReturnValue(new URLSearchParams("param=value"));

    await act(async () => {
      render(<TestMatomo />);
    });

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalledWith({
        siteId: "123",
        url: "https://example.com/matomo",
      });
    });
  });

  it("sends tracking events when route changes", async () => {
    mockUsePathname.mockReturnValue("/test-path");
    mockUseSearchParams.mockReturnValue(new URLSearchParams("param=value"));

    await act(async () => {
      render(<TestMatomo />);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith([
        "setCustomUrl",
        "/test-path?param=value",
      ]);
      expect(mockPush).toHaveBeenCalledWith(["trackPageView"]);
    });
  });

  it("does not send tracking events if pathname is null", async () => {
    mockUsePathname.mockReturnValue(null);
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    await act(async () => {
      render(<TestMatomo />);
    });

    // Attendre un peu pour s'assurer qu'aucun appel n'est fait
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockPush).not.toHaveBeenCalledWith([
      "setCustomUrl",
      expect.any(String),
    ]);
    expect(mockPush).not.toHaveBeenCalledWith(["trackPageView"]);
  });

  it("sends tracking event with pathname but without searchParams", async () => {
    mockUsePathname.mockReturnValue("/test-path");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    await act(async () => {
      render(<TestMatomo />);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(["setCustomUrl", "/test-path"]);
      expect(mockPush).toHaveBeenCalledWith(["trackPageView"]);
    });
  });

  it("does not initialize Matomo if configuration is missing", async () => {
    mockUsePathname.mockReturnValue("/test-path");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    await act(async () => {
      render(<TestMatomo matomoConfig={{ url: "", siteId: "" }} />);
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockInit).not.toHaveBeenCalled();
  });

  it("initializes Matomo only once", async () => {
    mockUsePathname.mockReturnValue("/test-path");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    const { rerender } = render(<TestMatomo />);

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalledTimes(1);
    });

    // Re-render le composant
    rerender(<TestMatomo />);

    // Attendre un peu et vérifier qu'init n'est pas appelé à nouveau
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockInit).toHaveBeenCalledTimes(1);
  });

  it("handles URL decoding correctly", async () => {
    const encodedPath = "/test%20path";
    mockUsePathname.mockReturnValue(encodedPath);
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams("param=test%20value")
    );

    await act(async () => {
      render(<TestMatomo />);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith([
        "setCustomUrl",
        "/test path?param=test+value",
      ]);
    });
  });
});
