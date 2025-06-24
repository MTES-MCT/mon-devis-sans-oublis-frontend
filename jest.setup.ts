import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Fix pour l'erreur TextEncoder avec Next.js 15
Object.assign(global, { TextDecoder, TextEncoder });

// Mock global des server actions
jest.mock("@/actions/errorDetails.actions", () => ({
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
  usePathname: () => "/",
  useParams: () => ({}),
}));

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
