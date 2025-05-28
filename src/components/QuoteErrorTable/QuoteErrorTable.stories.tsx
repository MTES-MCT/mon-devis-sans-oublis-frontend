import type { Meta, StoryObj } from "@storybook/react";

import QuoteErrorTable from "./QuoteErrorTable";
import { Category } from "@/types";

const meta: Meta<typeof QuoteErrorTable> = {
  title: "Components/QuoteErrorTable",
  component: QuoteErrorTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuoteErrorTable>;

const errorDetails = [
  {
    id: "error-1",
    code: "date_chantier_manquant",
    type: "warning",
    title: "La date prévue de début de chantier n'est pas présente",
    category: "admin",
    deleted: false,
    comment: "Commentaire existant sur cette erreur",
  },
  {
    id: "error-2",
    code: "menuiserie_type_vitrage_manquant",
    type: "missing",
    title: "Le type de vitrage est manquant",
    category: "gestes",
    geste_id: "geste-1",
    solution: "Le vitrage est-il un simple ou un double vitrage ?",
    provided_value: "Châssis composé",
    deleted: false,
    comment: null,
  },
];

const gestes = [
  {
    intitule: "Fenêtre 1 vantail",
    id: "geste-1",
    valid: false,
  },
  {
    intitule: "Porte-fenêtre",
    id: "geste-2",
    valid: true,
  },
];

const deleteErrorReasons = [
  { id: "already_present", label: "Information déjà présente" },
  { id: "not_used", label: "Information non utilisée dans notre cas" },
];

const mockOnHelpClick = (comment: string, errorDetailsId: string) => {
  console.log("Help clicked:", { comment, errorDetailsId });
};

const mockOnDeleteError = (
  quoteCheckId: string,
  errorDetailsId: string,
  reason: string
) => {
  console.log("Delete error:", { quoteCheckId, errorDetailsId, reason });
};

const mockOnAddErrorComment = (
  quoteCheckId: string,
  errorDetailsId: string,
  comment: string
) => {
  console.log("Add comment:", { quoteCheckId, errorDetailsId, comment });
};

const mockOnDeleteErrorComment = (
  quoteCheckId: string,
  errorDetailsId: string
) => {
  console.log("Delete comment:", { quoteCheckId, errorDetailsId });
};

const mockOnUndoDeleteError = (
  quoteCheckId: string,
  errorDetailsId: string
) => {
  console.log("Undo delete:", { quoteCheckId, errorDetailsId });
};

const mockQuoteCheckId = "mock-quote-check-id";

export const Admin: Story = {
  render: () => (
    <QuoteErrorTable
      category={Category.ADMIN}
      deleteErrorReasons={deleteErrorReasons}
      errorDetails={errorDetails}
      onAddErrorComment={mockOnAddErrorComment}
      onDeleteError={mockOnDeleteError}
      onDeleteErrorComment={mockOnDeleteErrorComment}
      onHelpClick={mockOnHelpClick}
      onUndoDeleteError={mockOnUndoDeleteError}
      quoteCheckId={mockQuoteCheckId}
    />
  ),
};

export const Gestes: Story = {
  render: () => (
    <QuoteErrorTable
      category={Category.GESTES}
      deleteErrorReasons={deleteErrorReasons}
      errorDetails={errorDetails}
      gestes={gestes}
      onAddErrorComment={mockOnAddErrorComment}
      onDeleteError={mockOnDeleteError}
      onDeleteErrorComment={mockOnDeleteErrorComment}
      onHelpClick={mockOnHelpClick}
      onUndoDeleteError={mockOnUndoDeleteError}
      quoteCheckId={mockQuoteCheckId}
    />
  ),
};
