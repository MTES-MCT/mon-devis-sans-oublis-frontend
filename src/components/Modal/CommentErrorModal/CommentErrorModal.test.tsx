import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommentErrorModal from "./CommentErrorModal";
import { Category } from "@/types";

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: jest.fn((element) => element),
}));

jest.mock("@/wording", () => ({
  components: {
    global_error_feedbacks_modal: {
      back_button_label: "Fermer",
    },
    quote_error_card: {
      title_gestes: "Descriptif technique des gestes",
      title_admin: "Mentions administratives",
    },
  },
}));

describe("CommentErrorModal", () => {
  const defaultProps = {
    errorCategory: Category.GESTES,
    errorDetailsId: "error-123",
    errorTitle: "Erreur de test",
    initialComment: null,
    isOpen: true,
    onAddErrorComment: jest.fn(),
    onClose: jest.fn(),
    onDeleteErrorComment: jest.fn(),
    quoteCheckId: "quote-123",
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

  it("renders correctly when open", async () => {
    render(<CommentErrorModal {...defaultProps} />);

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    expect(screen.getByTestId("comment-error-title")).toBeInTheDocument();
    expect(screen.getByLabelText("Commentaire")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-comment-button")).toBeDisabled();
  });

  it("does not render when closed", () => {
    render(<CommentErrorModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
  });

  it("displays initial comment when provided", () => {
    const initialComment = "Commentaire initial";
    render(
      <CommentErrorModal {...defaultProps} initialComment={initialComment} />
    );

    const textarea = screen.getByLabelText("Commentaire");
    expect(textarea).toHaveValue(initialComment);
    expect(screen.getByTitle("Supprimer le commentaire")).toBeInTheDocument();
  });

  it("enables save button when comment is modified", async () => {
    render(<CommentErrorModal {...defaultProps} />);

    const textarea = screen.getByLabelText("Commentaire");
    await userEvent.type(textarea, "Nouveau commentaire");

    expect(screen.getByTestId("confirm-comment-button")).not.toBeDisabled();
  });

  it("calls onAddErrorComment with trimmed comment when save button is clicked", async () => {
    render(<CommentErrorModal {...defaultProps} />);

    const textarea = screen.getByLabelText("Commentaire");
    await userEvent.type(textarea, "  Nouveau commentaire  ");

    const saveButton = screen.getByTestId("confirm-comment-button");
    await userEvent.click(saveButton);

    expect(defaultProps.onAddErrorComment).toHaveBeenCalledWith(
      "quote-123",
      "error-123",
      "Nouveau commentaire"
    );
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onDeleteErrorComment when comment is empty and save button is clicked", async () => {
    const initialComment = "Commentaire initial";
    render(
      <CommentErrorModal {...defaultProps} initialComment={initialComment} />
    );

    const textarea = screen.getByLabelText("Commentaire");
    await userEvent.clear(textarea);

    const saveButton = screen.getByTestId("confirm-comment-button");
    await userEvent.click(saveButton);

    expect(defaultProps.onDeleteErrorComment).toHaveBeenCalledWith(
      "quote-123",
      "error-123"
    );
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("clears comment when delete button is clicked", async () => {
    const initialComment = "Commentaire initial";
    render(
      <CommentErrorModal {...defaultProps} initialComment={initialComment} />
    );

    const deleteButton = screen.getByTitle("Supprimer le commentaire");
    await userEvent.click(deleteButton);

    const textarea = screen.getByLabelText("Commentaire");
    expect(textarea).toHaveValue("");
    expect(screen.getByTestId("confirm-comment-button")).not.toBeDisabled();
  });

  it("calls onClose when cancel button is clicked", async () => {
    render(<CommentErrorModal {...defaultProps} />);

    const cancelButton = screen.getByText("Annuler");
    await userEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("submits form when Ctrl+Enter is pressed", async () => {
    render(<CommentErrorModal {...defaultProps} />);

    const textarea = screen.getByLabelText("Commentaire");
    await userEvent.type(textarea, "Nouveau commentaire");

    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });

    expect(defaultProps.onAddErrorComment).toHaveBeenCalledWith(
      "quote-123",
      "error-123",
      "Nouveau commentaire"
    );
  });

  it("submits form when Meta+Enter is pressed", async () => {
    render(<CommentErrorModal {...defaultProps} />);

    const textarea = screen.getByLabelText("Commentaire");
    await userEvent.type(textarea, "Nouveau commentaire");

    fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });

    expect(defaultProps.onAddErrorComment).toHaveBeenCalledWith(
      "quote-123",
      "error-123",
      "Nouveau commentaire"
    );
  });

  it("displays error solution when provided", () => {
    const errorSolution = "Solution proposée";
    render(
      <CommentErrorModal {...defaultProps} errorSolution={errorSolution} />
    );

    expect(
      screen.getByText(
        "Détail de la correction proposée par Mon Devis Sans Oublis"
      )
    ).toBeInTheDocument();
    expect(screen.getByText(errorSolution)).toBeInTheDocument();
  });

  it("resets comment and isCommentModified when modal is opened", async () => {
    const checkModalState = async (comment: string) => {
      const textarea = screen.getByLabelText("Commentaire");
      expect(textarea).toHaveValue(comment);
    };

    const { rerender } = render(
      <CommentErrorModal {...defaultProps} isOpen={false} />
    );

    rerender(
      <CommentErrorModal
        {...defaultProps}
        isOpen={true}
        initialComment="Commentaire initial"
      />
    );

    await checkModalState("Commentaire initial");

    rerender(
      <CommentErrorModal
        {...defaultProps}
        isOpen={false}
        initialComment="Commentaire initial"
      />
    );
    rerender(
      <CommentErrorModal
        {...defaultProps}
        isOpen={true}
        initialComment="Commentaire initial"
      />
    );

    await checkModalState("Commentaire initial");
  });

  it("displays correct category title for GESTES", () => {
    render(
      <CommentErrorModal {...defaultProps} errorCategory={Category.GESTES} />
    );

    expect(
      screen.getByText("Descriptif technique des gestes")
    ).toBeInTheDocument();
  });

  it("displays correct category title for ADMIN", () => {
    render(
      <CommentErrorModal {...defaultProps} errorCategory={Category.ADMIN} />
    );

    expect(screen.getByText("Mentions administratives")).toBeInTheDocument();
  });
});
