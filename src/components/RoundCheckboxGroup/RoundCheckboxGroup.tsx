"use client";

import { useState, useRef } from "react";

import { Rating } from "@/types";
import wording from "@/wording";

export interface CheckboxOption {
  value: Rating;
}

export interface RoundCheckboxGroupProps {
  defaultValue?: Rating;
  onChange: (value: Rating) => void;
  options: CheckboxOption[];
}

const RoundCheckboxGroup: React.FC<RoundCheckboxGroupProps> = ({
  defaultValue,
  options,
  onChange,
}) => {
  const [selected, setSelected] = useState<Rating | null>(defaultValue || null);
  const groupRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: Rating) => {
    setSelected(value);
    onChange(value);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        const prevValue = options[prevIndex].value;
        handleSelect(prevValue);
        const prevInput = groupRef.current?.querySelector<HTMLInputElement>(
          `input[value="${prevValue}"]`
        );
        prevInput?.focus();
        break;
      }
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = Math.min(options.length - 1, currentIndex + 1);
        const nextValue = options[nextIndex].value;
        handleSelect(nextValue);
        const nextInput = groupRef.current?.querySelector<HTMLInputElement>(
          `input[value="${nextValue}"]`
        );
        nextInput?.focus();
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const value = options[currentIndex].value;
        handleSelect(value);
        break;
      }
    }
  };

  return (
    <div
      ref={groupRef}
      className="flex gap-6 items-center"
      role="radiogroup"
      aria-label="Niveau de satisfaction"
    >
      <span id="scale-start" className="fr-text--sm mb-0!">
        {wording.components.round_checkbox_group.insufficient}
      </span>
      {options.map((option, index) => (
        <label
          className="relative flex items-center cursor-pointer"
          key={option.value}
        >
          <input
            aria-checked={selected === option.value}
            aria-label={`Note ${index + 1} sur ${options.length}`}
            aria-describedby="scale-start scale-end"
            checked={selected === option.value}
            className="sr-only"
            onChange={() => handleSelect(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="radio"
            type="radio"
            value={option.value}
            tabIndex={0}
          />
          <span
            className={`h-6 w-6 rounded-full border-blue flex items-center justify-center transition-all group
              ${
                selected === option.value
                  ? "border-[var(--border-active-blue-france)]"
                  : "border-[var(--border-default-grey)] hover:border-[var(--border-active-blue-france)]"
              }
              [input:focus-visible+&]:outline-2 [input:focus-visible+&]:outline-offset-2 [input:focus-visible+&]:outline-[#0a76f6]`}
            aria-hidden="true"
          >
            {selected === option.value && (
              <div
                className="bg-[var(--background-action-high-blue-france)] h-3 w-3 rounded-full"
                aria-hidden="true"
              />
            )}
          </span>
        </label>
      ))}
      <span id="scale-end" className="fr-text--sm mb-0!">
        {wording.components.round_checkbox_group.satisfactory}
      </span>
    </div>
  );
};

export default RoundCheckboxGroup;
