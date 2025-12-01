import React from "react";
import { createPortal } from "react-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Modal, { ModalPosition } from "./Modal";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: jest.fn((element) => element),
}));

describe("Modal", () => {
  const backButtonLabel = "Back";
  const onClose = jest.fn();
  const children = (
    <>
      <button data-testid="first-button">First</button>
      <button data-testid="last-button">Last</button>
    </>
  );

  const renderModal = (
    isOpen: boolean,
    position: ModalPosition = ModalPosition.CENTER
  ) => {
    return render(
      <Modal
        backButtonLabel={backButtonLabel}
        isOpen={isOpen}
        onClose={onClose}
        position={position}
      >
        {children}
      </Modal>
    );
  };

  beforeEach(() => {
    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    const portalRoot = document.getElementById("modal-root");
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
    jest.clearAllMocks();
  });

  it("renders the modal when isOpen is true", async () => {
    renderModal(true);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    const closeButton = screen.getByTestId("modal-close-button");
    expect(closeButton).toBeInTheDocument();

    const firstButton = screen.getByTestId("first-button");
    const lastButton = screen.getByTestId("last-button");
    expect(firstButton).toBeInTheDocument();
    expect(lastButton).toBeInTheDocument();
  });

  it("does not render the modal when isOpen is false", () => {
    renderModal(false);

    const modalContent = screen.queryByTestId("modal-content");
    expect(modalContent).not.toBeInTheDocument();
  });

  it("closes the modal when clicking outside", async () => {
    renderModal(true);

    const modalOverlay = await screen.findByTestId("modal-overlay");
    expect(modalOverlay).toBeInTheDocument();

    await userEvent.click(modalOverlay);

    expect(onClose).toHaveBeenCalled();
  });

  it("does not close the modal when clicking inside", async () => {
    renderModal(true);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    await userEvent.click(modalContent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes the modal when pressing the Escape key", async () => {
    renderModal(true);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("handles tab navigation correctly", async () => {
    renderModal(true);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    const closeButton = screen.getByTestId("modal-close-button");
    const firstButton = screen.getByTestId("first-button");
    const lastButton = screen.getByTestId("last-button");

    closeButton.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(firstButton);
    await userEvent.tab();
    expect(document.activeElement).toBe(lastButton);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(firstButton);
  });

  it("renders in the right position", async () => {
    renderModal(true, ModalPosition.RIGHT);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    await waitFor(() => {
      expect(modalContent).toHaveClass("translate-x-0");
    });
  });

  it("sets aria-hidden and inert attributes correctly", async () => {
    renderModal(true);

    await screen.findByTestId("modal-content");

    const siblingElements = Array.from(document.body.children).filter(
      (child) => child.id !== "modal-root"
    );
    siblingElements.forEach((element) => {
      expect(element).toHaveAttribute("aria-hidden", "true");
      expect(element).toHaveAttribute("inert", "");
    });
  });

  it("unmounts correctly when isOpen becomes false", async () => {
    const { rerender } = renderModal(true);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    rerender(
      <Modal
        backButtonLabel={backButtonLabel}
        isOpen={false}
        onClose={onClose}
        position={ModalPosition.CENTER}
      >
        {children}
      </Modal>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
    });
  });

  it("cleans up event listeners when unmounted", async () => {
    const { unmount } = renderModal(true);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    unmount();

    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(escapeEvent);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not render modal if portalElement is null", () => {
    (createPortal as jest.Mock).mockImplementation(() => null);

    renderModal(true);

    const modalContent = screen.queryByTestId("modal-content");
    expect(modalContent).not.toBeInTheDocument();

    (createPortal as jest.Mock).mockImplementation((element) => element);
  });

  it("updates modal layout when isDesktop changes", async () => {
    // eslint-disable-next-line
    const { useIsDesktop } = require("@/hooks");
    const { rerender } = renderModal(true, ModalPosition.RIGHT);

    const modalContent = await screen.findByTestId("modal-content");
    expect(modalContent).toBeInTheDocument();

    (useIsDesktop as jest.Mock).mockImplementation(() => true);

    rerender(
      <Modal
        backButtonLabel={backButtonLabel}
        isOpen={true}
        onClose={onClose}
        position={ModalPosition.RIGHT}
      >
        {children}
      </Modal>
    );

    await waitFor(() => {
      expect(modalContent).toHaveClass("w-[480px]");
    });
  });

  it("hides modal when visibleClass is false", async () => {
    renderModal(false);

    await waitFor(() => {
      expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
    });
  });

  it("cleans up properly on unmount", async () => {
    const sibling = document.createElement("div");
    document.body.appendChild(sibling);

    const { unmount } = renderModal(true);

    await screen.findByTestId("modal-content");
    await waitFor(() => {
      expect(sibling).toHaveAttribute("aria-hidden", "true");
      expect(sibling).toHaveAttribute("inert", "");
    });

    renderModal(false);

    unmount();

    await waitFor(
      () => {
        expect(sibling).not.toHaveAttribute("aria-hidden");
        expect(sibling).not.toHaveAttribute("inert");
      },
      { timeout: 1000 }
    );

    document.body.removeChild(sibling);
  });

  it("returns null when not mounted", () => {
    jest.spyOn(React, "useEffect").mockImplementation(() => {});

    const { container } = render(
      <Modal
        backButtonLabel={backButtonLabel}
        isOpen={true}
        onClose={onClose}
        position={ModalPosition.CENTER}
      >
        {children}
      </Modal>
    );

    expect(container.firstChild).toBeNull();

    jest.restoreAllMocks();
  });

  it("handles mounting state correctly", async () => {
    const { rerender } = renderModal(false);

    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();

    rerender(
      <Modal
        backButtonLabel={backButtonLabel}
        isOpen={true}
        onClose={onClose}
        position={ModalPosition.CENTER}
      >
        {children}
      </Modal>
    );

    await waitFor(() => {
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    });
  });

  it("manages focus correctly", async () => {
    renderModal(true);

    const closeButton = screen.getByTestId("modal-close-button");
    const firstButton = screen.getByTestId("first-button");
    const lastButton = screen.getByTestId("last-button");

    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    await userEvent.tab();
    expect(document.activeElement).toBe(firstButton);
    await userEvent.tab();
    expect(document.activeElement).toBe(lastButton);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(firstButton);
  });

  it("properly cleans up sibling elements on unmount", async () => {
    const siblings = Array.from({ length: 3 }, () => {
      const el = document.createElement("div");
      document.body.appendChild(el);
      return el;
    });

    const { unmount } = renderModal(true);
    await screen.findByTestId("modal-content");

    siblings.forEach((sibling) => {
      expect(sibling).toHaveAttribute("aria-hidden", "true");
      expect(sibling).toHaveAttribute("inert", "");
    });

    unmount();

    await waitFor(() => {
      siblings.forEach((sibling) => {
        expect(sibling).not.toHaveAttribute("aria-hidden");
        expect(sibling).not.toHaveAttribute("inert");
      });
    });

    siblings.forEach((sibling) => document.body.removeChild(sibling));
  });

  it("handles initial mounting state", () => {
    const existingPortalRoot = document.getElementById("modal-root");
    if (existingPortalRoot) {
      document.body.removeChild(existingPortalRoot);
    }

    (createPortal as jest.Mock).mockImplementationOnce(() => null);

    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation at boundaries", async () => {
    renderModal(true);
    await screen.findByTestId("modal-content");

    const firstButton = screen.getByTestId("first-button");
    const lastButton = screen.getByTestId("last-button");

    firstButton.focus();
    fireEvent.keyDown(firstButton, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(firstButton);

    lastButton.focus();
    fireEvent.keyDown(lastButton, { key: "Tab" });
    expect(document.activeElement).toBe(lastButton);
  });

  it("handles aria-hidden cleanup correctly", async () => {
    const elements = Array.from({ length: 3 }, () => {
      const el = document.createElement("div");
      document.body.appendChild(el);
      return el;
    });

    elements[0].setAttribute("aria-hidden", "true");
    elements[1].setAttribute("aria-hidden", "false");

    const { unmount } = renderModal(true);
    await screen.findByTestId("modal-content");

    elements.forEach((el) => {
      expect(el).toHaveAttribute("aria-hidden", "true");
    });

    unmount();

    expect(elements[0]).toHaveAttribute("aria-hidden", "true");
    expect(elements[1]).toHaveAttribute("aria-hidden", "false");
    expect(elements[2]).not.toHaveAttribute("aria-hidden");

    elements.forEach((el) => document.body.removeChild(el));
  });

  it("handles null aria-hidden attribute correctly during cleanup", async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    const { unmount } = renderModal(true);
    await screen.findByTestId("modal-content");

    expect(element).toHaveAttribute("aria-hidden", "true");

    unmount();

    expect(element).not.toHaveAttribute("aria-hidden");

    document.body.removeChild(element);
  });
});
