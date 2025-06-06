"use client";

import { useState } from "react";

import { DropdownCheckboxList } from "@/components";
import { Metadata } from "@/types";
import wording from "@/wording";

export const FILE_ERROR = "file_error";

export default function RenovationTypeSelection({
  metadata,
}: {
  metadata: Metadata;
}) {
  const [selectedAides, setSelectedAides] = useState<string[]>([]);
  const [selectedGestes, setSelectedGestes] = useState<string[]>([]);

  const handleAidesChange = (values: string[]) => {
    setSelectedAides(values);
  };

  const handleGestesChange = (values: string[]) => {
    setSelectedGestes(values);
  };

  return (
    <>
      <h1 className="fr-h2 fr-mb-6v text-left">Pourriez vous préciser</h1>
      {metadata.gestes && (
        <DropdownCheckboxList
          label="Le(s) geste(s) technique(s) concerné(s) par le devis"
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
