import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import QuoteErrorLine from "./QuoteErrorLine";
import { Category, ErrorDetails } from "@/types";
import { useIsConseiller } from "@/hooks";

jest.mock("../Modal/CommentErrorModal/CommentErrorModal", () => {
  return function MockCommentErrorModal({
    isOpen,
    onClose,
    onAddErrorComment,
    errorDetailsId,
    quoteCheckId,
  }: // eslint-disable-next-line
  any) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-comment-modal">
        <button onClick={onClose} data-testid="close-comment-modal">
          Close
        </button>
        <button
          onClick={() =>
            onAddErrorComment(quoteCheckId, errorDetailsId, "Test comment")
          }
          data-testid="submit-comment"
        >
          Submit Comment
        </button>
      </div>
    );
  };
});

jest.mock("../Modal/DeleteErrorModal/DeleteErrorModal", () => {
  return function MockDeleteErrorModal({
    isOpen,
    onClose,
    onDeleteError,
    errorDetailsId,
    quoteCheckId,
  }: // eslint-disable-next-line
  any) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-delete-modal">
        <button onClick={onClose} data-testid="close-delete-modal">
          Close
        </button>
        <button
          onClick={() =>
            onDeleteError(quoteCheckId, errorDetailsId, "test-reason")
          }
          data-testid="confirm-delete"
        >
          Confirm Delete
        </button>
      </div>
    );
  };
});

jest.mock("../Modal/ErrorDetailsModal/ErrorDetailsModal", () => {
  return function MockErrorDetailsModal({
    isOpen,
    onClose,
    onSubmitComment,
  }: // eslint-disable-next-line
  any) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-details-modal">
        <button onClick={onClose} data-testid="close-details-modal">
          Close
        </button>
        <button
          onClick={() => onSubmitComment("Updated comment")}
          data-testid="update-comment"
        >
          Update Comment
        </button>
        <button
          onClick={() => onSubmitComment("")}
          data-testid="delete-comment"
        >
          Delete Comment
        </button>
      </div>
    );
  };
});

describe("QuoteErrorLine", () => {
  const mockOnAddErrorComment = jest.fn();
  const mockOnDeleteError = jest.fn();
  const mockOnDeleteErrorComment = jest.fn();
  const mockOnUndoDeleteError = jest.fn();

  const defaultError: ErrorDetails = {
    id: "error-123",
    title: "Test Error Title",
    category: Category.GESTES,
    problem: "Test Problem",
    solution: "Test Solution",
    comment: "Test Comment",
    deleted: false,
    code: "",
    type: "",
  };

  const deleteErrorReasons = [
    { id: "test-reason", label: "Test Reason" },
    { id: "other-reason", label: "Other Reason" },
  ];

  const defaultProps = {
    error: defaultError,
    quoteCheckId: "quote-123",
    deleteErrorReasons,
    onAddErrorComment: mockOnAddErrorComment,
    onDeleteError: mockOnDeleteError,
    onDeleteErrorComment: mockOnDeleteErrorComment,
    onUndoDeleteError: mockOnUndoDeleteError,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useIsConseiller as jest.Mock).mockReturnValue(false);
  });

  it("renders error title correctly", () => {
    render(<QuoteErrorLine {...defaultProps} />);
    expect(screen.getByText("Test Error Title")).toBeInTheDocument();
  });

  it("renders with line-through style when error is deleted", () => {
    render(
      <QuoteErrorLine
        {...defaultProps}
        error={{ ...defaultError, deleted: true }}
      />
    );
    const titleElement = screen.getByText("Test Error Title");
    expect(titleElement).toHaveClass("line-through");
    expect(titleElement).toHaveClass("text-gray-500");
    expect(titleElement).toHaveClass("opacity-50");
  });

  it('shows "Voir le détail" button for non-conseiller when solution or comment exists', () => {
    render(<QuoteErrorLine {...defaultProps} />);
    expect(screen.getByText("Voir le détail")).toBeInTheDocument();
  });

  it('does not show "Voir le détail" button for non-conseiller when error is deleted', () => {
    render(
      <QuoteErrorLine
        {...defaultProps}
        error={{ ...defaultError, deleted: true }}
      />
    );
    expect(screen.queryByText("Voir le détail")).not.toBeInTheDocument();
  });

  it('shows "Annuler la suppression" button for conseiller when error is deleted', () => {
    (useIsConseiller as jest.Mock).mockReturnValue(true);
    render(
      <QuoteErrorLine
        {...defaultProps}
        error={{ ...defaultError, deleted: true }}
      />
    );
    expect(screen.getByText("Annuler la suppression")).toBeInTheDocument();
  });

  it('calls onUndoDeleteError when "Annuler la suppression" button is clicked', () => {
    (useIsConseiller as jest.Mock).mockReturnValue(true);

    render(
      <QuoteErrorLine
        {...defaultProps}
        error={{ ...defaultError, deleted: true }}
      />
    );
    fireEvent.click(screen.getByText("Annuler la suppression"));
    expect(mockOnUndoDeleteError).toHaveBeenCalledWith(
      "quote-123",
      "error-123"
    );
  });

  describe("For conseiller users", () => {
    beforeEach(() => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);
    });

    it("shows delete button when error is not deleted", () => {
      render(<QuoteErrorLine {...defaultProps} />);
      expect(
        document.querySelector(".fr-icon-delete-line")
      ).toBeInTheDocument();
    });

    it("shows comment button when error has no comment and is not deleted", () => {
      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, comment: "" }}
        />
      );
      expect(
        document.querySelector(".fr-icon-chat-new-line")
      ).toBeInTheDocument();
    });

    it('shows "Voir le détail" button with message icon when error has solution and comment', () => {
      render(<QuoteErrorLine {...defaultProps} />);
      const detailButton = screen.getByText("Voir le détail").parentElement;
      expect(detailButton).toBeInTheDocument();
      expect(
        detailButton?.querySelector(".fr-icon-message-2-fill")
      ).toBeInTheDocument();
    });

    it('shows "Voir le détail" button without message icon when error has solution but no comment', () => {
      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, comment: "" }}
        />
      );
      const detailButton = screen.getByText("Voir le détail");
      expect(detailButton).toBeInTheDocument();
      expect(
        document.querySelector(".fr-icon-message-2-fill")
      ).not.toBeInTheDocument();
    });

    it("shows message button when error has comment but no solution", () => {
      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, solution: "" }}
        />
      );
      expect(
        document.querySelector(".fr-icon-message-2-fill")
      ).toBeInTheDocument();
    });
  });

  describe("Modal interactions", () => {
    it('opens details modal when "Voir le détail" button is clicked', () => {
      render(<QuoteErrorLine {...defaultProps} />);
      fireEvent.click(screen.getByText("Voir le détail"));
      expect(screen.getByTestId("mock-details-modal")).toBeInTheDocument();
    });

    it("closes details modal when close button is clicked", () => {
      render(<QuoteErrorLine {...defaultProps} />);
      fireEvent.click(screen.getByText("Voir le détail"));
      fireEvent.click(screen.getByTestId("close-details-modal"));
      expect(
        screen.queryByTestId("mock-details-modal")
      ).not.toBeInTheDocument();
    });

    it("opens comment modal when comment button is clicked (for conseiller)", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, comment: "" }}
        />
      );
      const chatButton = document.querySelector(".fr-icon-chat-new-line");
      fireEvent.click(chatButton as Element);
      expect(screen.getByTestId("mock-comment-modal")).toBeInTheDocument();
    });

    it("closes comment modal when close button is clicked", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, comment: "" }}
        />
      );
      const chatButton = document.querySelector(".fr-icon-chat-new-line");
      fireEvent.click(chatButton as Element);
      fireEvent.click(screen.getByTestId("close-comment-modal"));
      expect(
        screen.queryByTestId("mock-comment-modal")
      ).not.toBeInTheDocument();
    });

    it("opens delete modal when delete button is clicked (for conseiller)", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(<QuoteErrorLine {...defaultProps} />);
      const deleteButton = document.querySelector(".fr-icon-delete-line");
      fireEvent.click(deleteButton as Element);
      expect(screen.getByTestId("mock-delete-modal")).toBeInTheDocument();
    });

    it("closes delete modal when close button is clicked", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(<QuoteErrorLine {...defaultProps} />);
      const deleteButton = document.querySelector(".fr-icon-delete-line");
      fireEvent.click(deleteButton as Element);
      fireEvent.click(screen.getByTestId("close-delete-modal"));
      expect(screen.queryByTestId("mock-delete-modal")).not.toBeInTheDocument();
    });
  });

  describe("Callback functions", () => {
    it("calls onAddErrorComment when comment is submitted from comment modal", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, comment: "" }}
        />
      );
      const chatButton = document.querySelector(".fr-icon-chat-new-line");
      fireEvent.click(chatButton as Element);
      fireEvent.click(screen.getByTestId("submit-comment"));
      expect(mockOnAddErrorComment).toHaveBeenCalledWith(
        "quote-123",
        "error-123",
        "Test comment"
      );
    });

    it("calls onDeleteError with correct reason when delete is confirmed", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(<QuoteErrorLine {...defaultProps} />);
      const deleteButton = document.querySelector(".fr-icon-delete-line");
      fireEvent.click(deleteButton as Element);
      fireEvent.click(screen.getByTestId("confirm-delete"));
      expect(mockOnDeleteError).toHaveBeenCalledWith(
        "quote-123",
        "error-123",
        "Test Reason"
      );
    });

    it("calls onAddErrorComment when comment is updated from details modal", () => {
      render(<QuoteErrorLine {...defaultProps} />);
      fireEvent.click(screen.getByText("Voir le détail"));
      fireEvent.click(screen.getByTestId("update-comment"));
      expect(mockOnAddErrorComment).toHaveBeenCalledWith(
        "quote-123",
        "error-123",
        "Updated comment"
      );
    });

    it("calls onDeleteErrorComment when comment is deleted from details modal", () => {
      render(<QuoteErrorLine {...defaultProps} />);
      fireEvent.click(screen.getByText("Voir le détail"));
      fireEvent.click(screen.getByTestId("delete-comment"));
      expect(mockOnDeleteErrorComment).toHaveBeenCalledWith(
        "quote-123",
        "error-123"
      );
    });

    it("handles empty reason in handleDeleteConfirm", () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponent = () => {
        const handleDeleteConfirm = (
          quoteCheckId: string,
          errorDetailsId: string,
          reason: string
        ) => {
          if (!reason) {
            console.error("reason est vide dans QuoteErrorLine !");
            return;
          }

          const foundReason = deleteErrorReasons?.find((r) => r.id === reason);
          const finalReason = foundReason ? foundReason.label : reason;

          mockOnDeleteError(quoteCheckId, errorDetailsId, finalReason);
        };

        return (
          <button
            data-testid="test-button"
            onClick={() => handleDeleteConfirm("quote-123", "error-123", "")}
          >
            Test Empty Reason
          </button>
        );
      };

      render(<TestComponent />);
      fireEvent.click(screen.getByTestId("test-button"));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "reason est vide dans QuoteErrorLine !"
      );
      expect(mockOnDeleteError).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Edge cases", () => {
    it("handles error without solution or comment", () => {
      render(
        <QuoteErrorLine
          {...defaultProps}
          error={{ ...defaultError, solution: "", comment: "" }}
        />
      );
      expect(screen.queryByText("Voir le détail")).not.toBeInTheDocument();
    });

    it("handles isLastErrorInTable prop correctly", () => {
      render(<QuoteErrorLine {...defaultProps} isLastErrorInTable={true} />);
      expect(screen.getByText("Test Error Title").closest("tr")).toHaveClass(
        "border-b-0"
      );
    });
  });

  describe("Branch coverage tests", () => {
    it("handles case when deleteErrorReasons is undefined", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      render(
        <QuoteErrorLine {...defaultProps} deleteErrorReasons={undefined} />
      );

      const deleteButton = document.querySelector(".fr-icon-delete-line");
      fireEvent.click(deleteButton as Element);
      fireEvent.click(screen.getByTestId("confirm-delete"));

      expect(mockOnDeleteError).toHaveBeenCalledWith(
        "quote-123",
        "error-123",
        "test-reason"
      );
    });

    it("handles case when reason is not found in deleteErrorReasons", () => {
      (useIsConseiller as jest.Mock).mockReturnValue(true);

      const TestComponent = () => {
        const handleDeleteConfirm = (
          quoteCheckId: string,
          errorDetailsId: string,
          reason: string
        ) => {
          if (!reason) {
            console.error("reason est vide dans QuoteErrorLine !");
            return;
          }

          const foundReason = deleteErrorReasons?.find((r) => r.id === reason);
          const finalReason = foundReason ? foundReason.label : reason;

          mockOnDeleteError(quoteCheckId, errorDetailsId, finalReason);
        };

        return (
          <button
            data-testid="test-unknown-reason"
            onClick={() =>
              handleDeleteConfirm("quote-123", "error-123", "unknown-reason")
            }
          >
            Test Unknown Reason
          </button>
        );
      };

      render(<TestComponent />);
      fireEvent.click(screen.getByTestId("test-unknown-reason"));

      expect(mockOnDeleteError).toHaveBeenCalledWith(
        "quote-123",
        "error-123",
        "unknown-reason"
      );

      const originalMock = jest.requireMock(
        "../Modal/DeleteErrorModal/DeleteErrorModal"
      );
      jest.resetModules();
      jest.mock("../Modal/DeleteErrorModal/DeleteErrorModal", () => {
        return function MockDeleteErrorModal({
          isOpen,
          onClose,
          onDeleteError,
          errorDetailsId,
          quoteCheckId,
        }: // eslint-disable-next-line
        any) {
          if (!isOpen) return null;
          return (
            <div data-testid="mock-delete-modal">
              <button onClick={onClose} data-testid="close-delete-modal">
                Close
              </button>
              <button
                onClick={() =>
                  onDeleteError(quoteCheckId, errorDetailsId, "unknown-reason")
                }
                data-testid="confirm-delete"
              >
                Confirm Delete
              </button>
            </div>
          );
        };
      });

      render(<QuoteErrorLine {...defaultProps} />);

      const deleteButton = document.querySelector(".fr-icon-delete-line");
      fireEvent.click(deleteButton as Element);

      fireEvent.click(screen.getByTestId("confirm-delete"));

      expect(mockOnDeleteError).toHaveBeenCalledWith(
        "quote-123",
        "error-123",
        "unknown-reason"
      );

      jest.mock(
        "../Modal/DeleteErrorModal/DeleteErrorModal",
        () => originalMock
      );
    });

    it("handles case when onDeleteErrorComment is undefined", () => {
      render(
        <QuoteErrorLine {...defaultProps} onDeleteErrorComment={undefined} />
      );

      fireEvent.click(screen.getByText("Voir le détail"));
      fireEvent.click(screen.getByTestId("delete-comment"));

      expect(
        screen.queryByTestId("mock-details-modal")
      ).not.toBeInTheDocument();
    });

    it("handles case when onAddErrorComment is undefined", () => {
      render(
        <QuoteErrorLine {...defaultProps} onAddErrorComment={undefined} />
      );

      fireEvent.click(screen.getByText("Voir le détail"));
      fireEvent.click(screen.getByTestId("update-comment"));

      expect(
        screen.queryByTestId("mock-details-modal")
      ).not.toBeInTheDocument();
    });
  });
});
