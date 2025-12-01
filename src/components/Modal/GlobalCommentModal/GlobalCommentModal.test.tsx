import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import GlobalCommentModal from "./GlobalCommentModal";

jest.mock("../Modal", () => {
  return {
    __esModule: true,
    ModalPosition: { CENTER: "center", RIGHT: "right" },
    default: ({
      children,
      isOpen,
      onClose,
    }: // eslint-disable-next-line
    any) => {
      if (!isOpen) return null;
      return (
        <div data-testid="mock-modal">
          <button onClick={onClose} data-testid="modal-close-button">
            Close
          </button>
          <div>{children}</div>
        </div>
      );
    },
  };
});

describe("GlobalCommentModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmitComment = jest.fn();

  const defaultProps = {
    initialComment: "",
    isOpen: true,
    onClose: mockOnClose,
    onSubmitComment: mockOnSubmitComment,
    quoteCheckId: "quote-123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all props", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    expect(
      screen.getByText("Ajouter un commentaire global")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Votre commentaire sera visible lors du partage de la page."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Commentaire/)).toBeInTheDocument();
    expect(screen.getByText("0/1000 caractères")).toBeInTheDocument();
  });

  it("allows comment editing", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/Commentaire/);
    fireEvent.change(textarea, { target: { value: "Nouveau commentaire" } });

    expect(textarea).toHaveValue("Nouveau commentaire");
    expect(screen.getByText(/1[89].*\/1000 caractères/)).toBeInTheDocument();
  });

  it("disables save button when comment is empty", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
  });

  it("enables save button when comment is not empty", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/Commentaire/);
    fireEvent.change(textarea, { target: { value: "Nouveau commentaire" } });

    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).not.toBeDisabled();
  });

  it("calls onSubmitComment with comment when saving", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/Commentaire/);
    fireEvent.change(textarea, { target: { value: "Nouveau commentaire" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(mockOnSubmitComment).toHaveBeenCalledWith("Nouveau commentaire");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("works correctly when onClose is undefined", () => {
    const propsWithoutOnClose = {
      ...defaultProps,
      onClose: undefined,
    };

    render(<GlobalCommentModal {...propsWithoutOnClose} />);

    const textarea = screen.getByLabelText(/Commentaire/);
    fireEvent.change(textarea, { target: { value: "Nouveau commentaire" } });

    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(mockOnSubmitComment).toHaveBeenCalledWith("Nouveau commentaire");
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Annuler" }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmitComment).not.toHaveBeenCalled();
  });

  it("resets comment when modal is reopened", async () => {
    const { rerender } = render(
      <GlobalCommentModal {...defaultProps} isOpen={false} />
    );

    rerender(<GlobalCommentModal {...defaultProps} isOpen={true} />);

    await waitFor(() => {
      const textarea = screen.getByLabelText(/Commentaire/);
      expect(textarea).toHaveValue("");
    });
  });

  it("renders with initial comment when provided", () => {
    render(
      <GlobalCommentModal
        {...defaultProps}
        initialComment="Commentaire initial"
      />
    );

    const textarea = screen.getByLabelText(/Commentaire/);
    expect(textarea).toHaveValue("");
  });

  it("limits comment to 1000 characters", () => {
    render(<GlobalCommentModal {...defaultProps} />);

    const textarea = screen.getByLabelText(/Commentaire/);
    const longComment = "a".repeat(1010);

    fireEvent.change(textarea, { target: { value: longComment } });

    expect(textarea).toHaveAttribute("maxLength", "1000");
  });

  it("uses default empty string when initialComment is undefined", () => {
    const propsWithoutInitialComment = {
      isOpen: defaultProps.isOpen,
      onClose: defaultProps.onClose,
      onSubmitComment: defaultProps.onSubmitComment,
      quoteCheckId: defaultProps.quoteCheckId,
      // initialComment est intentionnellement omis
    };

    render(<GlobalCommentModal {...propsWithoutInitialComment} />);

    const textarea = screen.getByLabelText(/Commentaire/);
    expect(textarea).toHaveValue("");

    expect(screen.getByText("0/1000 caractères")).toBeInTheDocument();
  });
});
