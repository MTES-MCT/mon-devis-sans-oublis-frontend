import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import GlobalErrorFeedbacksModal from "./GlobalErrorFeedbacksModal";
import { Rating } from "@/types";

jest.mock("../Modal", () => {
  return {
    __esModule: true,
    ModalPosition: { CENTER: "center", RIGHT: "right" },
    // eslint-disable-next-line
    default: ({ children, isOpen, onClose }: any) => {
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

jest.mock("../../RoundCheckboxGroup/RoundCheckboxGroup", () => {
  return function MockRoundCheckboxGroup({
    options,
    onChange,
    defaultValue,
  }: // eslint-disable-next-line
  any) {
    return (
      <div data-testid="mock-round-checkbox-group">
        {/* eslint-disable-next-line */}
        {options.map((option: any) => (
          <button
            key={option.value}
            data-testid={`rating-${option.value}`}
            onClick={() => onChange(option.value)}
            className={defaultValue === option.value ? "selected" : ""}
          >
            {option.value}
          </button>
        ))}
      </div>
    );
  };
});

describe("GlobalErrorFeedbacksModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmitFeedback = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmitFeedback: mockOnSubmitFeedback,
  };

  const COMMENT_LABEL_TEXT =
    "Pouvez-vous nous en dire plus sur ce que vous avez pensé des corrections proposées ?";
  const SUBMIT_BUTTON = "Envoyer mes réponses";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when closed", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("disables submit button when comment is empty", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("rating-3"));
    expect(screen.getByRole("button", { name: SUBMIT_BUTTON })).toBeDisabled();
  });

  it("disables submit button when rating is not selected", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });

    expect(screen.getByRole("button", { name: SUBMIT_BUTTON })).toBeDisabled();
  });

  it("enables submit button when both comment and rating are provided", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });
    fireEvent.click(screen.getByTestId("rating-4"));

    expect(
      screen.getByRole("button", { name: SUBMIT_BUTTON })
    ).not.toBeDisabled();
  });

  it("calls onSubmitFeedback with correct values when submitted", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });

    const emailInput = screen.getByPlaceholderText(
      "Votre adresse e-mail (ex : jean.dupont@mail.fr)"
    );
    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByTestId("rating-5"));
    fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON }));

    expect(mockOnSubmitFeedback).toHaveBeenCalledWith(
      "Test comment",
      "test@example.com",
      5 as Rating
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onSubmitFeedback with null email when email is empty", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });
    fireEvent.click(screen.getByTestId("rating-3"));

    fireEvent.click(screen.getByRole("button", { name: SUBMIT_BUTTON }));

    expect(mockOnSubmitFeedback).toHaveBeenCalledWith(
      "Test comment",
      null,
      3 as Rating
    );
  });

  it("does not submit when comment contains only whitespace", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByTestId("rating-4"));

    expect(screen.getByRole("button", { name: SUBMIT_BUTTON })).toBeDisabled();
  });

  it("submits form when Ctrl+Enter is pressed", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });
    fireEvent.click(screen.getByTestId("rating-2"));

    const container = screen.getByText(
      "Que pensez-vous de ces retours ?"
    ).parentElement;
    fireEvent.keyDown(container!, { key: "Enter", ctrlKey: true });

    expect(mockOnSubmitFeedback).toHaveBeenCalledWith(
      "Test comment",
      null,
      2 as Rating
    );
  });

  it("does not submit form when only Enter is pressed (without Ctrl)", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });
    fireEvent.click(screen.getByTestId("rating-2"));

    const container = screen.getByText(
      "Que pensez-vous de ces retours ?"
    ).parentElement;
    fireEvent.keyDown(container!, { key: "Enter", ctrlKey: false });

    expect(mockOnSubmitFeedback).not.toHaveBeenCalled();
  });

  it("does not submit form when other keys are pressed", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);

    const commentTextarea = screen.getByLabelText((content) =>
      content.includes(COMMENT_LABEL_TEXT.trim())
    );
    fireEvent.change(commentTextarea, {
      target: { value: "Test comment" },
    });
    fireEvent.click(screen.getByTestId("rating-2"));

    const container = screen.getByText(
      "Que pensez-vous de ces retours ?"
    ).parentElement;

    fireEvent.keyDown(container!, { key: "Space" });
    fireEvent.keyDown(container!, { key: "Tab" });
    fireEvent.keyDown(container!, { key: "Escape" });

    expect(mockOnSubmitFeedback).not.toHaveBeenCalled();
  });

  it("calls onClose when modal is closed", () => {
    render(<GlobalErrorFeedbacksModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("modal-close-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
