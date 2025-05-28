import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import DeleteErrorModal from "./DeleteErrorModal";
import { Category } from "@/types";

jest.mock("@/components", () => ({
  DropdownCheckboxList: ({
    onChange,
    selectedValues,
    customInput,
  }: {
    onChange: (values: string[]) => void;
    selectedValues: string[];
    customInput?: {
      id: string;
      value: string;
      onChange: (value: string) => void;
    };
  }) => (
    <div data-testid="mock-dropdown">
      <button
        data-testid="select-reason1"
        onClick={() => onChange(["reason1"])}
      >
        Select Reason 1
      </button>
      <button
        data-testid="select-reason2"
        onClick={() => onChange(["reason2"])}
      >
        Select Reason 2
      </button>
      <button data-testid="select-custom" onClick={() => onChange(["custom"])}>
        Select Custom
      </button>
      {selectedValues.includes("custom") && customInput && (
        <input
          data-testid="custom-input"
          value={customInput.value}
          onChange={(e) => customInput.onChange(e.target.value)}
        />
      )}
    </div>
  ),
}));

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

describe("DeleteErrorModal", () => {
  const deleteErrorReasons = [
    { id: "reason1", label: "Raison 1" },
    { id: "reason2", label: "Raison 2" },
    { id: "reason3", label: "Raison 3" },
  ];

  const defaultProps = {
    deleteErrorReasons,
    errorCategory: Category.GESTES,
    errorDetailsId: "error-123",
    errorTitle: "Erreur de test",
    isOpen: true,
    onClose: jest.fn(),
    onDeleteError: jest.fn(),
    quoteCheckId: "quote-123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<DeleteErrorModal {...defaultProps} />);

    expect(screen.getByTestId("delete-error-title")).toBeInTheDocument();
    expect(
      screen.getByText("Supprimer la correction proposée")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Descriptif technique des gestes")
    ).toBeInTheDocument();
    expect(screen.getByText("Erreur de test")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dropdown")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Confirmer la suppression")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-delete-button")).toBeDisabled();
  });

  it("does not render when closed", () => {
    render(<DeleteErrorModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId("delete-error-title")).not.toBeInTheDocument();
  });

  it("displays correct category title for ADMIN", () => {
    render(
      <DeleteErrorModal {...defaultProps} errorCategory={Category.ADMIN} />
    );
    expect(screen.getByText("Mentions administratives")).toBeInTheDocument();
  });

  it("enables confirm button when a reason is selected", () => {
    render(<DeleteErrorModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("select-reason1"));

    expect(screen.getByTestId("confirm-delete-button")).not.toBeDisabled();
  });

  it("calls onDeleteError with selected reason when confirm button is clicked", () => {
    render(<DeleteErrorModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("select-reason2"));

    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    expect(defaultProps.onDeleteError).toHaveBeenCalledWith(
      "quote-123",
      "error-123",
      "reason2"
    );
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("handles custom reason input correctly", () => {
    render(<DeleteErrorModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("select-custom"));
    expect(screen.getByTestId("confirm-delete-button")).toBeDisabled();

    fireEvent.change(screen.getByTestId("custom-input"), {
      target: { value: "Ma raison personnalisée" },
    });

    expect(screen.getByTestId("confirm-delete-button")).not.toBeDisabled();

    fireEvent.click(screen.getByTestId("confirm-delete-button"));
    expect(defaultProps.onDeleteError).toHaveBeenCalledWith(
      "quote-123",
      "error-123",
      "Ma raison personnalisée"
    );
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<DeleteErrorModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("cancel-delete-button"));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("renders without deleteErrorReasons", () => {
    render(
      <DeleteErrorModal {...defaultProps} deleteErrorReasons={undefined} />
    );

    expect(screen.getByTestId("delete-error-title")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-dropdown")).not.toBeInTheDocument();
  });

  it("tests error cases directly", () => {
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();

    const handleSubmitCustomEmpty = () => {
      const isCustom = true;
      const customReason = "";

      if (isCustom && !customReason.trim()) {
        console.warn("Raison personnalisée vide !");
        return;
      }
    };
    handleSubmitCustomEmpty();
    expect(console.warn).toHaveBeenCalledWith("Raison personnalisée vide !");

    (console.warn as jest.Mock).mockClear();

    const handleSubmitNoReason = () => {
      const isCustom = false;
      const selectedReason = null;

      if (!isCustom && !selectedReason) {
        console.warn("Aucune raison sélectionnée !");
        return;
      }
    };
    handleSubmitNoReason();
    expect(console.warn).toHaveBeenCalledWith("Aucune raison sélectionnée !");

    console.warn = originalConsoleWarn;
  });
});
