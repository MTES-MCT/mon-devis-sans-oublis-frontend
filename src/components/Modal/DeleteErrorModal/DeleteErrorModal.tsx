"use client";

import { useState } from "react";

import Modal, { ModalPosition } from "../Modal";
import { DropdownCheckboxList } from "@/components";
import { Category } from "@/types";
import wording from "@/wording";

export interface DeleteErrorModalProps {
  deleteErrorReasons?: { id: string; label: string }[];
  errorCategory: string;
  errorDetailsId: string;
  errorTitle: string;
  isOpen: boolean;
  onClose?: () => void;
  onDeleteError: (
    quoteCheckId: string,
    errorDetailsId: string,
    reason: string
  ) => void;
  quoteCheckId: string;
}

const DeleteErrorModal: React.FC<DeleteErrorModalProps> = ({
  deleteErrorReasons,
  errorCategory,
  errorDetailsId,
  errorTitle,
  isOpen,
  onClose,
  onDeleteError,
  quoteCheckId,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const handleReasonChange = (values: string[]) => {
    if (values.includes("custom")) {
      setIsCustom(true);
      setSelectedReason("custom");
    } else {
      setIsCustom(false);
      const lastValue = values[values.length - 1];
      /* istanbul ignore next */
      setSelectedReason(lastValue || null);
    }
  };

  const handleSubmit = () => {
    /* istanbul ignore next */
    if (isCustom && !customReason.trim()) {
      console.warn("Raison personnalisée vide !");
      return;
    }

    /* istanbul ignore next */
    if (!isCustom && !selectedReason) {
      console.warn("Aucune raison sélectionnée !");
      return;
    }

    const finalReason = isCustom ? customReason.trim() : selectedReason;

    /* istanbul ignore next */
    if (!finalReason) {
      console.error("finalReason est vide avant l'envoi !");
      return;
    }

    onDeleteError(quoteCheckId, errorDetailsId, finalReason);
    onClose?.();
  };

  return (
    <Modal
      backButtonLabel={
        wording.components.global_error_feedbacks_modal.back_button_label
      }
      data-testid="delete-error-modal"
      isOpen={isOpen}
      onClose={onClose}
      position={ModalPosition.CENTER}
    >
      <div className="flex flex-col h-full">
        <h4
          className="fr-mb-1w flex items-center gap-2"
          data-testid="delete-error-title"
        >
          <span
            className="fr-icon-delete-fill fr-icon--lg mt-1!"
            aria-hidden="true"
          />
          Supprimer la correction proposée
        </h4>

        <div className="overflow-hidden rounded-lg border-shadow fr-mb-3w fr-mt-2w">
          <table className="w-full">
            <caption className="bg-[var(--background-action-low-blue-france)] font-bold text-left p-4 flex items-center justify-between">
              <span className="flex gap-2 items-center">
                <p className="fr-mb-0 text-[var(--text-default-grey)]!">
                  {errorCategory === Category.GESTES &&
                    wording.components.quote_error_card.title_gestes}
                  {errorCategory === Category.ADMIN &&
                    wording.components.quote_error_card.title_admin}
                </p>
              </span>
            </caption>
            <tbody>
              <tr className="font-bold border-bottom-grey border-top-grey">
                <td className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                  {errorTitle}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-38">
          {deleteErrorReasons && (
            <DropdownCheckboxList
              customInput={{
                id: "custom",
                value: customReason,
                onChange: setCustomReason,
              }}
              data-testid="delete-reasons-multiselect"
              label="Raison de la suppression"
              multiple={false}
              onChange={handleReasonChange}
              options={[
                ...deleteErrorReasons,
                { id: "custom", label: "Autre raison" },
              ]}
              selectedValues={
                isCustom ? ["custom"] : selectedReason ? [selectedReason] : []
              }
            />
          )}
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button
            className="fr-btn fr-btn--secondary"
            onClick={onClose}
            data-testid="cancel-delete-button"
          >
            Annuler
          </button>
          <button
            className="fr-btn fr-btn--danger"
            onClick={handleSubmit}
            disabled={
              (!selectedReason && !customReason.trim()) ||
              (isCustom && !customReason.trim())
            }
            data-testid="confirm-delete-button"
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteErrorModal;
