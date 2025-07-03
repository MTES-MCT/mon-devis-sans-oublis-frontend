import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { useIsConseiller, useUserProfile } from "@/hooks";
import { Profile } from "@/types";
import QuoteErrorSharingCard from "./QuoteErrorSharingCard";
import { QUOTE_ERROR_SHARING_WORDING } from "./QuoteErrorSharingCard.wording";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.Mock;
const mockUseIsConseiller = useIsConseiller as jest.Mock;
const mockUseUserProfile = useUserProfile as jest.Mock;

describe("QuoteErrorSharingCard - copyUrlToClipboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  it("doit copier l'URL du dossier conseiller", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/conseiller/dossier/123");
    mockUseIsConseiller.mockReturnValue(true);
    mockUseUserProfile.mockReturnValue(Profile.CONSEILLER);

    // Act
    render(<QuoteErrorSharingCard />);
    const copyButton = screen.getByText(
      QUOTE_ERROR_SHARING_WORDING.button_copy_url
    );
    fireEvent.click(copyButton);

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/conseiller/dossier/123`
    );
  });

  it("doit copier l'URL du devis seul pour un conseiller sur un devis dans un dossier", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/conseiller/dossier/123/devis/456");
    mockUseIsConseiller.mockReturnValue(true);
    mockUseUserProfile.mockReturnValue(Profile.CONSEILLER);

    // Act
    render(<QuoteErrorSharingCard />);
    const copyButton = screen.getByText(
      QUOTE_ERROR_SHARING_WORDING.button_copy_url
    );
    fireEvent.click(copyButton);

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/conseiller/devis/456`
    );
  });

  it("doit copier l'URL du dossier artisan telle quelle", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/artisan/dossier/123");
    mockUseIsConseiller.mockReturnValue(false);
    mockUseUserProfile.mockReturnValue(Profile.ARTISAN);

    // Act
    render(<QuoteErrorSharingCard />);
    const copyButton = screen.getByText(
      QUOTE_ERROR_SHARING_WORDING.button_copy_url
    );
    fireEvent.click(copyButton);

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/artisan/dossier/123`
    );
  });

  it("doit copier l'URL du devis particulier", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/particulier/devis/456");
    mockUseIsConseiller.mockReturnValue(false);
    mockUseUserProfile.mockReturnValue(Profile.PARTICULIER);

    // Act
    render(<QuoteErrorSharingCard />);
    const copyButton = screen.getByText(
      QUOTE_ERROR_SHARING_WORDING.button_copy_url
    );
    fireEvent.click(copyButton);

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/particulier/devis/456`
    );
  });

  it("doit gérer le cas sans profil (fallback)", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/dossier/123/devis/456");
    mockUseIsConseiller.mockReturnValue(false);
    mockUseUserProfile.mockReturnValue(null);

    // Act
    render(<QuoteErrorSharingCard />);
    const copyButton = screen.getByText(
      QUOTE_ERROR_SHARING_WORDING.button_copy_url
    );
    fireEvent.click(copyButton);

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/devis/456`
    );
  });

  it("doit changer le texte du bouton après copie", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/conseiller/dossier/123");
    mockUseIsConseiller.mockReturnValue(true);
    mockUseUserProfile.mockReturnValue(Profile.CONSEILLER);

    // Act
    render(<QuoteErrorSharingCard />);
    const copyButton = screen.getByText(
      QUOTE_ERROR_SHARING_WORDING.button_copy_url
    );
    fireEvent.click(copyButton);

    // Assert
    expect(
      screen.getByText(QUOTE_ERROR_SHARING_WORDING.button_copied_url)
    ).toBeInTheDocument();
  });
});
