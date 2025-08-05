"use client";

import { useState, useRef, useEffect, JSX } from "react";

import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";

export interface Option {
  id: string;
  label: string;
  group?: string;
}

export interface CustomInput {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export interface DropdownCheckboxListProps {
  className?: string;
  customInput?: {
    id: string;
    value: string;
    onChange: (value: string) => void;
  };
  label: string;
  hintLabel?: string;
  multiple: boolean;
  onChange: (values: string[]) => void;
  optionnal?: boolean;
  options: string[] | Option[];
  selectedValues?: string[];
}

interface GroupedOption {
  id: string;
  label: string | JSX.Element;
  checked: boolean;
  group?: string;
}

interface GroupedOptions {
  [key: string]: GroupedOption[];
}

export const DropdownCheckboxList: React.FC<DropdownCheckboxListProps> = ({
  className = "",
  customInput,
  label,
  hintLabel,
  multiple,
  onChange,
  optionnal,
  options,
  selectedValues = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [localSelectedValues, setLocalSelectedValues] =
    useState<string[]>(selectedValues);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "Tab":
          if (!event.shiftKey && isLastItemFocused()) {
            setIsOpen(false);
          }
          if (event.shiftKey && isFirstItemFocused()) {
            setIsOpen(false);
          }
          break;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isFirstItemFocused = () => {
    if (typeof window === "undefined") return false;
    const firstCheckbox = dropdownRef.current?.querySelector(
      'input[type="checkbox"]'
    );
    return document.activeElement === firstCheckbox;
  };

  const isLastItemFocused = () => {
    if (typeof window === "undefined") return false;
    const checkboxes = dropdownRef.current?.querySelectorAll(
      'input[type="checkbox"]'
    );
    if (!checkboxes?.length) return false;
    return document.activeElement === checkboxes[checkboxes.length - 1];
  };

  const isGroupedOptions = (opt: string[] | Option[]): opt is Option[] => {
    return opt.length > 0 && typeof opt[0] === "object" && "group" in opt[0];
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    let newValues: string[];
    if (checked) {
      newValues = multiple ? [...localSelectedValues, id] : [id];

      if (id === "custom") {
        setTimeout(() => {
          customInputRef.current?.focus();
        }, 0);
      } else if (!multiple) {
        setIsOpen(false);
      }
    } else {
      newValues = localSelectedValues.filter((value) => value !== id);
      if (id === "custom" && customInput) {
        customInput.onChange("");
      }
    }
    setLocalSelectedValues(newValues);
    onChange(newValues);
  };

  const handleCustomInputChange = (value: string) => {
    customInput?.onChange(value);
    if (value.trim() && !localSelectedValues.includes("custom")) {
      const newValues = [...localSelectedValues, "custom"];
      setLocalSelectedValues(newValues);
      onChange(newValues);
    } else if (!value.trim() && localSelectedValues.includes("custom")) {
      const newValues = localSelectedValues.filter((v) => v !== "custom");
      setLocalSelectedValues(newValues);
      onChange(newValues);
    }
  };

  const handleCustomInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localSelectedValues.includes("custom")) {
      const newValues = multiple
        ? [...localSelectedValues, "custom"]
        : ["custom"];
      setLocalSelectedValues(newValues);
      onChange(newValues);
    }
  };

  const normalizeOptions = (opts: string[] | Option[]): Option[] => {
    if (opts.length === 0) return [];
    if (typeof opts[0] === "string") {
      return (opts as string[]).map((opt) => ({
        id: opt,
        label: opt,
      }));
    }
    return opts as Option[];
  };

  const getDisplayLabel = (id: string): string => {
    if (isGroupedOptions(options)) {
      const option = options.find((opt) => opt.id === id);
      return option?.label || id;
    }
    const normalizedOpts = normalizeOptions(options);
    const option = normalizedOpts.find((opt) => opt.id === id);
    return option?.label?.toString() || id;
  };

  const displayValue = localSelectedValues.length
    ? multiple && localSelectedValues.length > 1
      ? `${localSelectedValues.length} éléments sélectionnés`
      : getDisplayLabel(localSelectedValues[0])
    : "Sélectionner une option";

  const normalizedOptions = isGroupedOptions(options)
    ? options
    : normalizeOptions(options);

  const checkboxOptions = normalizedOptions.map((option) => ({
    id: option.id,
    label:
      option.id === "custom" ? (
        <div className="flex-grow">
          <input
            className="fr-input w-full"
            data-testid="custom-reason-input"
            onClick={handleCustomInputClick}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            placeholder="Autre raison"
            value={customInput?.value || ""}
            ref={customInputRef}
            type="text"
          />
        </div>
      ) : (
        option.label
      ),
    checked: localSelectedValues.includes(option.id),
    group: option.group,
  }));

  const groupedOptions = checkboxOptions.reduce<GroupedOptions>(
    (acc, option) => {
      const group = option.group || "default";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(option);
      return acc;
    },
    {}
  );

  return (
    <div
      className={`fr-select-group relative fr-mb-4w ${className || ""}`}
      ref={containerRef}
    >
      <label className="fr-label" htmlFor="multiselect">
        {label}
        {hintLabel && <span className="fr-hint-text">{hintLabel}</span>}
        {optionnal && <span className="fr-hint-text">Optionnel</span>}
      </label>
      <button
        aria-controls="dropdown-content"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="fr-select text-left"
        id="multiselect"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          if (e.key === "Escape" && isOpen) {
            setIsOpen(false);
          }
        }}
        type="button"
      >
        {displayValue}
      </button>
      {isOpen && (
        <div
          id="dropdown-content"
          ref={dropdownRef}
          className="fr-select-checkbox border-shadow pt-5 pb-2 pl-2 h-[180px] overflow-x-hidden overflow-y-auto absolute w-full bg-white z-50"
          role="listbox"
          aria-labelledby="multiselect"
        >
          {Object.entries(groupedOptions).map(([group, groupOpts]) => (
            <div
              aria-label={group !== "default" ? group : undefined}
              key={group}
              role="group"
            >
              {group !== "default" && (
                <legend className="fr-fieldset__legend">{group}</legend>
              )}
              <CheckboxGroup
                options={groupOpts}
                onChange={handleCheckboxChange}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckboxList;
