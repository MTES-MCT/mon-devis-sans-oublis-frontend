import React from "react";
import { ImageProps } from "next/image";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ErrorDetailsModal from "./ErrorDetailsModal";
import { useIsConseiller } from "@/hooks";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={props.alt}
      height={props.height}
      src={props.src as string}
      width={props.width}
    />
  ),
}));

jest.mock("../../Modal/Modal", () => {
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

describe("ErrorDetailsModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmitComment = jest.fn();

  const defaultProps = {
    errorDetailsId: "error-123",
    initialComment: "Initial comment",
    isOpen: true,
    onClose: mockOnClose,
    onSubmitComment: mockOnSubmitComment,
    problem: "Test problem",
    solution: "Test solution",
    title: "Test Error",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useIsConseiller as jest.Mock).mockReturnValue(true);
  });

  it("renders correctly with all props", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.getByText("Test problem")).toBeInTheDocument();
    expect(screen.getByText("Test solution")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial comment")).toBeInTheDocument();
  });

  it("renders correctly without problem and solution", () => {
    render(
      <ErrorDetailsModal {...defaultProps} problem={null} solution={null} />
    );

    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.queryByText("Test problem")).not.toBeInTheDocument();
    expect(screen.queryByText("Test solution")).not.toBeInTheDocument();
  });

  it("allows comment editing for conseiller", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    const textarea = screen.getByLabelText("Votre commentaire");
    fireEvent.change(textarea, { target: { value: "Updated comment" } });

    expect(textarea).toHaveValue("Updated comment");
    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).not.toBeDisabled();
  });

  it("disables save button when comment is not modified", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
  });

  it("shows delete button for conseiller with initial comment", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    expect(screen.getByTitle("Supprimer le commentaire")).toBeInTheDocument();
  });

  it("clears comment when delete button is clicked", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    fireEvent.click(screen.getByTitle("Supprimer le commentaire"));

    expect(screen.getByLabelText("Votre commentaire")).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "Supprimer" })
    ).not.toBeDisabled();
  });

  it("calls onSubmitComment with empty string when deleting comment", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    fireEvent.click(screen.getByTitle("Supprimer le commentaire"));
    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(mockOnSubmitComment).toHaveBeenCalledWith("", "error-123");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onSubmitComment with updated comment when saving", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    const textarea = screen.getByLabelText("Votre commentaire");
    fireEvent.change(textarea, { target: { value: "Updated comment" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(mockOnSubmitComment).toHaveBeenCalledWith(
      "Updated comment",
      "error-123"
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not call onSubmitComment when comment is empty and there was no initial comment", () => {
    render(<ErrorDetailsModal {...defaultProps} initialComment="" />);

    expect(
      screen.queryByLabelText("Votre commentaire")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Enregistrer" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("modal-close-button"));

    expect(mockOnSubmitComment).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("resets comment when modal is reopened", async () => {
    const { rerender } = render(
      <ErrorDetailsModal {...defaultProps} isOpen={false} />
    );

    rerender(<ErrorDetailsModal {...defaultProps} isOpen={true} />);

    await waitFor(() => {
      expect(screen.getByLabelText("Votre commentaire")).toHaveValue(
        "Initial comment"
      );
    });
  });

  it("renders in read-only mode for non-conseiller users", () => {
    (useIsConseiller as jest.Mock).mockReturnValue(false);

    render(<ErrorDetailsModal {...defaultProps} />);

    // Find the label element
    const label = screen.getByText("Commentaire de votre conseiller");
    expect(label).toBeInTheDocument();

    // Find the paragraph element that contains the comment
    const commentParagraph = screen.getByText("Initial comment");
    expect(commentParagraph).toBeInTheDocument();
    expect(commentParagraph.tagName).toBe("P");
    expect(commentParagraph).toHaveClass("whitespace-pre-wrap");

    // Verify that there's no editable textarea or save button
    expect(
      screen.queryByRole("button", { name: "Enregistrer" })
    ).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<ErrorDetailsModal {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Annuler" }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("uses default empty string for initialComment when undefined", () => {
    const propsWithoutInitialComment: Partial<typeof defaultProps> = {
      errorDetailsId: defaultProps.errorDetailsId,
      isOpen: defaultProps.isOpen,
      onClose: defaultProps.onClose,
      onSubmitComment: defaultProps.onSubmitComment,
      problem: defaultProps.problem,
      solution: defaultProps.solution,
      title: defaultProps.title,
      // initialComment est intentionnellement omis
    };

    // @ts-expect-error - Nous ignorons l'erreur TypeScript car nous voulons tester le comportement avec initialComment undefined
    render(<ErrorDetailsModal {...propsWithoutInitialComment} />);

    expect(
      screen.queryByLabelText("Votre commentaire")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Enregistrer" })
    ).not.toBeInTheDocument();
  });
});
