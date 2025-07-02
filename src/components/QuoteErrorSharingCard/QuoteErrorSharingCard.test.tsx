import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { useConseillerRoutes, useUserProfile } from "@/hooks";
import { Profile } from "@/types";
import QuoteErrorSharingCard from "./QuoteErrorSharingCard";
import { QUOTE_ERROR_SHARING_WORDING } from "./QuoteErrorSharingCard.wording";

const mockUsePathname = usePathname as jest.Mock;
const mockUseConseillerRoutes = useConseillerRoutes as jest.Mock;
const mockUseUserProfile = useUserProfile as jest.Mock;

describe("QuoteErrorSharingCard - copyUrlToClipboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("doit copier l'URL du dossier conseiller", async () => {
    // Arrange
    mockUsePathname.mockReturnValue("/conseiller/dossier/123");
    mockUseConseillerRoutes.mockReturnValue({ isConseillerAndEdit: true });
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
    mockUseConseillerRoutes.mockReturnValue({ isConseillerAndEdit: true });
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
    mockUseConseillerRoutes.mockReturnValue({ isConseillerAndEdit: false });
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
    mockUseConseillerRoutes.mockReturnValue({ isConseillerAndEdit: false });
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
    mockUseConseillerRoutes.mockReturnValue({ isConseillerAndEdit: false });
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
    mockUseConseillerRoutes.mockReturnValue({ isConseillerAndEdit: false });
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
