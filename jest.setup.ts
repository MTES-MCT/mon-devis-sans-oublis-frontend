import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Fix pour l'erreur TextEncoder avec Next.js 15
Object.assign(global, { TextDecoder, TextEncoder });

// Mock des variables d'environnement
process.env.NEXT_PUBLIC_API_URL = "https://api.test.example.com";
process.env.NEXT_PUBLIC_MATOMO_SITE_ID = "1";
process.env.NEXT_PUBLIC_MATOMO_URL = "https://matomo.test.example.com";
process.env.NEXT_PUBLIC_SENTRY_DSN = "https://test@sentry.io/123";

// Mock global des server actions
jest.mock("@/actions/quoteCheck.errorDetails.actions", () => ({
  deleteErrorDetail: jest.fn().mockResolvedValue(true),
  updateErrorDetail: jest.fn().mockResolvedValue(true),
}));

// Mock global de Next.js cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn(),
}));

// Mock global de Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: jest.fn(() => "/"),
  useParams: () => ({}),
}));

// Mock global des hooks personnalisés
jest.mock("@/hooks", () => ({
  useIsDesktop: jest.fn(() => true),
  useUserProfile: jest.fn(() => null),
  useIsConseiller: jest.fn(() => null),
  useScrollPosition: jest.fn(() => true),
  useDeleteErrorReasons: jest.fn(() => ({ reasons: [], loading: false })),
  useCrisp: jest.fn(() => ({
    isLoaded: false,
    openChat: jest.fn(),
    sendMessage: jest.fn(),
    promptUser: jest.fn(),
    triggerEvent: jest.fn(),
  })),
  useMatomo: jest.fn(() => ({
    trackEvent: jest.fn(),
    trackPageView: jest.fn(),
    enableHeatmaps: jest.fn(),
    isEnabled: false,
  })),
}));

// Mock global de navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
