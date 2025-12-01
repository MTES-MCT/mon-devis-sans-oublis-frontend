"use client";

import { useState, useEffect } from "react";
import { DropdownCheckboxList } from "@/components";
import { Metadata } from "@/types";

export const FILE_ERROR = "file_error";

interface RenovationTypeSelectionProps {
  metadata: Metadata;
  onSelectionChange?: (aides: string[], gestes: string[]) => void;
}

export default function RenovationTypeSelection({
  metadata,
  onSelectionChange,
}: RenovationTypeSelectionProps) {
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  const handleAidesChange = (values: string[]) => {
    setSelectedAides(values);
  };

  const handleGestesChange = (values: string[]) => {
    setSelectedGestes(values);
  };

  // Notification parent à chaque modification
  useEffect(() => {
    onSelectionChange?.(selectedAides, selectedGestes);
  }, [selectedAides, selectedGestes, onSelectionChange]);

  return (
    <>
      <h1 className="fr-h2 fr-mb-6v text-left">Pourriez vous préciser</h1>
      {metadata.gestes && (
        <DropdownCheckboxList
          label="Le(s) geste(s) technique(s) concerné(s) par le(s) devis"
          multiple={true}
          onChange={handleGestesChange}
          optionnal={true}
          options={metadata.gestes.flatMap((group) =>
            group.values.map((value) => ({
              id: value,
              label: value,
              group: group.group,
            }))
          )}
        />
      )}
      {metadata.aides && (
        <DropdownCheckboxList
          label="Le(s) aide(s) visée(s) avec le devis"
          multiple={true}
          onChange={handleAidesChange}
          optionnal={true}
          options={metadata.aides}
        />
      )}
    </>
  );
}
