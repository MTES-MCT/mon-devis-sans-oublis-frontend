import { renderHook } from "@testing-library/react";
import { useParams } from "next/navigation";
import { useUserProfile, useIsConseiller } from "../useUserProfile";
import { Profile } from "@/types";

// Mock de Next.js navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

const mockUseParams = useParams as jest.Mock;

describe("useUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retourne null quand il n'y a pas de profil dans l'URL", () => {
    mockUseParams.mockReturnValue({});

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBeNull();
  });

  it("retourne null quand le profil est undefined", () => {
    mockUseParams.mockReturnValue({ profile: undefined });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBeNull();
  });

  it("retourne Profile.ARTISAN pour un profil artisan valide", () => {
    mockUseParams.mockReturnValue({ profile: "artisan" });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBe(Profile.ARTISAN);
  });

  it("retourne Profile.CONSEILLER pour un profil conseiller valide", () => {
    mockUseParams.mockReturnValue({ profile: "conseiller" });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBe(Profile.CONSEILLER);
  });

  it("retourne Profile.PARTICULIER pour un profil particulier valide", () => {
    mockUseParams.mockReturnValue({ profile: "particulier" });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBe(Profile.PARTICULIER);
  });

  it("retourne null pour un profil invalide", () => {
    mockUseParams.mockReturnValue({ profile: "invalid-profile" });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBeNull();
  });

  it("retourne null pour une chaîne vide", () => {
    mockUseParams.mockReturnValue({ profile: "" });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current).toBeNull();
  });
});

describe("useIsConseiller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retourne true quand le profil est conseiller", () => {
    mockUseParams.mockReturnValue({ profile: "conseiller" });

    const { result } = renderHook(() => useIsConseiller());

    expect(result.current).toBe(true);
  });

  it("retourne false quand le profil est artisan", () => {
    mockUseParams.mockReturnValue({ profile: "artisan" });

    const { result } = renderHook(() => useIsConseiller());

    expect(result.current).toBe(false);
  });

  it("retourne false quand le profil est particulier", () => {
    mockUseParams.mockReturnValue({ profile: "particulier" });

    const { result } = renderHook(() => useIsConseiller());

    expect(result.current).toBe(false);
  });

  it("retourne false quand il n'y a pas de profil", () => {
    mockUseParams.mockReturnValue({});

    const { result } = renderHook(() => useIsConseiller());

    expect(result.current).toBe(false);
  });

  it("retourne false quand le profil est invalide", () => {
    mockUseParams.mockReturnValue({ profile: "invalid-profile" });

    const { result } = renderHook(() => useIsConseiller());

    expect(result.current).toBe(false);
  });

  it("retourne false quand useParams retourne null", () => {
    mockUseParams.mockReturnValue(null);

    const { result } = renderHook(() => useIsConseiller());

    expect(result.current).toBe(false);
  });
});
