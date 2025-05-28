import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import QuoteErrorTable, {
  QuoteErrorTablePropsAdmin,
  QuoteErrorTablePropsGestes,
} from "./QuoteErrorTable";
import { Category } from "@/types";
import wording from "@/wording";

jest.mock("../Badge/Badge", () => {
  const BadgeSize = {
    X_SMALL: "x-small",
  };

  const BadgeVariant = {
    GREEN_LIGHT: "green-light",
    GREY: "grey",
    GREEN: "green",
    ORANGE_LIGHT: "orange-light",
  };

  const Badge = jest.fn(({ label, icon }) => (
    <div data-testid="mock-badge">
      {icon && <span data-testid="badge-icon">{icon}</span>}
      <span data-testid="badge-label">{label}</span>
    </div>
  ));

  return {
    __esModule: true,
    default: Badge,
    BadgeSize,
    BadgeVariant,
  };
});

jest.mock("../QuoteErrorLine/QuoteErrorLine", () => {
  return jest.fn(({ error, onDeleteError, quoteCheckId }) => (
    <div data-testid={`error-line-${error.id}`}>
      <span>Error: {error.title}</span>
      <button
        data-testid={`delete-button-${error.id}`}
        onClick={() => onDeleteError(quoteCheckId, error.id, "Test Reason")}
      >
        Delete
      </button>
    </div>
  ));
});

jest.mock("../Tooltip/Tooltip", () => {
  return jest.fn(({ text }) => <div data-testid="mock-tooltip">{text}</div>);
});

describe("QuoteErrorTable", () => {
  const mockOnDeleteError = jest.fn();
  const mockOnAddErrorComment = jest.fn();
  const mockOnDeleteErrorComment = jest.fn();
  const mockOnUndoDeleteError = jest.fn();
  const mockOnHelpClick = jest.fn();

  const defaultAdminProps: QuoteErrorTablePropsAdmin = {
    category: Category.ADMIN,
    errorDetails: [
      {
        id: "error1",
        title: "Error 1",
        category: Category.ADMIN,
        deleted: false,
        problem: "Problem 1",
        solution: "Solution 1",
        code: "code1",
        comment: null,
        type: "type1",
        geste_id: null,
        provided_value: null,
      },
      {
        id: "error2",
        title: "Error 2",
        category: Category.ADMIN,
        deleted: true,
        problem: "Problem 2",
        solution: "Solution 2",
        code: "code2",
        comment: null,
        type: "type2",
        geste_id: null,
        provided_value: null,
      },
    ],
    deleteErrorReasons: [
      { id: "reason1", label: "Reason 1" },
      { id: "reason2", label: "Reason 2" },
    ],
    onAddErrorComment: mockOnAddErrorComment,
    onDeleteError: mockOnDeleteError,
    onDeleteErrorComment: mockOnDeleteErrorComment,
    onUndoDeleteError: mockOnUndoDeleteError,
    onHelpClick: mockOnHelpClick,
    quoteCheckId: "quote1",
  };

  const defaultGestesProps: QuoteErrorTablePropsGestes = {
    category: Category.GESTES,
    errorDetails: [
      {
        id: "error3",
        title: "Error 3",
        category: Category.GESTES,
        deleted: false,
        geste_id: "geste1",
        problem: "Problem 3",
        solution: "Solution 3",
        code: "code3",
        comment: null,
        type: "type3",
        provided_value: null,
      },
      {
        id: "error4",
        title: "Error 4",
        category: Category.GESTES,
        deleted: true,
        geste_id: "geste1",
        problem: "Problem 4",
        solution: "Solution 4",
        code: "code4",
        comment: null,
        type: "type4",
        provided_value: null,
      },
      {
        id: "error5",
        title: "Error 5",
        category: Category.GESTES,
        deleted: false,
        geste_id: "geste2",
        problem: "Problem 5",
        solution: "Solution 5",
        code: "code5",
        comment: null,
        type: "type5",
        provided_value: null,
      },
    ],
    gestes: [
      { id: "geste1", intitule: "Geste 1", valid: false },
      { id: "geste2", intitule: "Geste 2", valid: false },
    ],
    deleteErrorReasons: [
      { id: "reason1", label: "Reason 1" },
      { id: "reason2", label: "Reason 2" },
    ],
    onAddErrorComment: mockOnAddErrorComment,
    onDeleteError: mockOnDeleteError,
    onDeleteErrorComment: mockOnDeleteErrorComment,
    onUndoDeleteError: mockOnUndoDeleteError,
    onHelpClick: mockOnHelpClick,
    quoteCheckId: "quote1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Admin category", () => {
    it("renders admin errors correctly", () => {
      render(<QuoteErrorTable {...defaultAdminProps} />);

      expect(
        screen.getByText(wording.components.quote_error_card.title_admin)
      ).toBeInTheDocument();

      expect(screen.getByTestId("error-line-error1")).toBeInTheDocument();
      expect(screen.getByTestId("error-line-error2")).toBeInTheDocument();
    });

    it("displays correct badge when there are errors", () => {
      render(<QuoteErrorTable {...defaultAdminProps} />);

      const badgeLabel = screen.getByTestId("badge-label");
      expect(badgeLabel.textContent).toBe(
        wording.page_upload_id.badge_correction.replace("{number}", "1")
      );
    });

    it('displays "Tout est bon" badge when all errors are deleted', () => {
      const props: QuoteErrorTablePropsAdmin = {
        ...defaultAdminProps,
        errorDetails: defaultAdminProps.errorDetails.map((error) => ({
          ...error,
          deleted: true,
        })),
      };

      render(<QuoteErrorTable {...props} />);

      const badgeLabel = screen.getByTestId("badge-label");
      expect(badgeLabel.textContent).toBe("Tout est bon");
      expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    });

    it("calls onDeleteError when delete button is clicked", () => {
      render(<QuoteErrorTable {...defaultAdminProps} />);

      fireEvent.click(screen.getByTestId("delete-button-error1"));

      expect(mockOnDeleteError).toHaveBeenCalledWith(
        "quote1",
        "error1",
        "Test Reason"
      );
    });
  });

  describe("Gestes category", () => {
    it("renders gestes and their errors correctly", () => {
      render(<QuoteErrorTable {...defaultGestesProps} />);

      expect(
        screen.getByText(wording.components.quote_error_card.title_gestes)
      ).toBeInTheDocument();

      expect(screen.getByText("Geste 1")).toBeInTheDocument();
      expect(screen.getByText("Geste 2")).toBeInTheDocument();

      expect(screen.getByTestId("error-line-error3")).toBeInTheDocument();
      expect(screen.getByTestId("error-line-error4")).toBeInTheDocument();
      expect(screen.getByTestId("error-line-error5")).toBeInTheDocument();
    });

    it("displays the number of gestes correctly", () => {
      render(<QuoteErrorTable {...defaultGestesProps} />);

      const expectedText =
        wording.components.quote_error_card.title_gestes_number_plural.replace(
          "{number}",
          "2"
        );
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it("displays correct badge for gestes with errors", () => {
      render(<QuoteErrorTable {...defaultGestesProps} />);

      const badgeLabels = screen.getAllByTestId("badge-label");
      const mainBadgeLabel = badgeLabels.find(
        (label) =>
          label.textContent ===
          wording.page_upload_id.badge_correction_plural.replace(
            "{number}",
            "2"
          )
      );

      expect(mainBadgeLabel).toBeInTheDocument();
      expect(mainBadgeLabel?.textContent).toBe(
        wording.page_upload_id.badge_correction_plural.replace("{number}", "2")
      );
    });

    it("displays OK badge for gestes with no active errors", () => {
      const props: QuoteErrorTablePropsGestes = {
        ...defaultGestesProps,
        gestes: [
          { id: "geste1", intitule: "Geste 1", valid: true },
          { id: "geste2", intitule: "Geste 2", valid: false },
        ],
      };

      render(<QuoteErrorTable {...props} />);

      const badges = screen.getAllByTestId("mock-badge");

      const okBadgeExists = badges.some((badge) => {
        const labelElement = badge.querySelector('[data-testid="badge-label"]');
        return labelElement && labelElement.textContent === "OK";
      });

      expect(okBadgeExists).toBe(true);
    });

    it("handles gestes with no errors", () => {
      const props: QuoteErrorTablePropsGestes = {
        ...defaultGestesProps,
        errorDetails: defaultGestesProps.errorDetails.filter(
          (error) => error.geste_id !== "geste2"
        ),
      };

      render(<QuoteErrorTable {...props} />);

      expect(screen.getByText("Geste 2")).toBeInTheDocument();
    });

    it("handles empty gestes array", () => {
      const props: QuoteErrorTablePropsGestes = {
        ...defaultGestesProps,
        gestes: [],
      };

      render(<QuoteErrorTable {...props} />);

      expect(
        screen.getByText(wording.components.quote_error_card.title_gestes)
      ).toBeInTheDocument();

      expect(screen.queryByText("Geste 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Geste 2")).not.toBeInTheDocument();
    });

    it("handles undefined gestes prop", () => {
      const TestWrapper = () => {
        // @ts-expect-error - Forcer gestes à undefined pour tester la branche props.gestes ?? []
        return <QuoteErrorTable {...defaultGestesProps} gestes={undefined} />;
      };

      render(<TestWrapper />);

      expect(
        screen.getByText(wording.components.quote_error_card.title_gestes)
      ).toBeInTheDocument();
    });

    it("displays singular text for single geste", () => {
      const props: QuoteErrorTablePropsGestes = {
        ...defaultGestesProps,
        gestes: [{ id: "geste1", intitule: "Geste 1", valid: false }],
      };

      render(<QuoteErrorTable {...props} />);

      const expectedText =
        wording.components.quote_error_card.title_gestes_number.replace(
          "{number}",
          "1"
        );
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("filters errors by category", () => {
      const props: QuoteErrorTablePropsAdmin = {
        ...defaultAdminProps,
        errorDetails: [
          ...defaultAdminProps.errorDetails,
          {
            id: "error3",
            title: "Error 3",
            category: Category.GESTES,
            deleted: false,
            problem: "Problem 3",
            solution: "Solution 3",
            code: "code3",
            comment: null,
            type: "type3",
            geste_id: null,
            provided_value: null,
          },
        ],
      };

      render(<QuoteErrorTable {...props} />);

      expect(screen.getByTestId("error-line-error1")).toBeInTheDocument();
      expect(screen.getByTestId("error-line-error2")).toBeInTheDocument();
      expect(screen.queryByTestId("error-line-error3")).not.toBeInTheDocument();
    });

    it("handles undefined optional props", () => {
      const props: QuoteErrorTablePropsAdmin = {
        category: Category.ADMIN,
        errorDetails: defaultAdminProps.errorDetails,
        onDeleteError: mockOnDeleteError,
        onHelpClick: mockOnHelpClick,
        quoteCheckId: "quote1",
      };

      expect(() => render(<QuoteErrorTable {...props} />)).not.toThrow();
    });

    it("handles case where getActiveErrorCount returns 0", () => {
      const props: QuoteErrorTablePropsAdmin = {
        ...defaultAdminProps,
        errorDetails: [],
      };

      render(<QuoteErrorTable {...props} />);

      const badgeLabel = screen.getByTestId("badge-label");
      expect(badgeLabel.textContent).toBe("Tout est bon");
    });

    it("handles unknown category", () => {
      const TestWrapper = () => {
        // Using 'as any' to force an invalid category to test the fallback case
        return (
          <QuoteErrorTable
            {...defaultAdminProps}
            // eslint-disable-next-line
            category={"UNKNOWN_CATEGORY" as any}
            gestes={[]}
          />
        );
      };

      const consoleSpy = jest.spyOn(console, "log");
      render(<TestWrapper />);
      expect(screen.queryByText("UNKNOWN_CATEGORY")).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
