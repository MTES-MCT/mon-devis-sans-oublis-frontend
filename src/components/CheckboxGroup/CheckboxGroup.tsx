import { ReactNode } from "react";

export interface CheckboxOption {
  checked: boolean;
  id: string;
  label: string | ReactNode;
}

export interface CheckboxGroupProps {
  legend?: string;
  onChange: (id: string, checked: boolean) => void;
  options: CheckboxOption[];
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  legend,
  onChange,
  options,
}) => {
  return (
    <fieldset
      aria-labelledby="checkboxes-legend checkboxes-messages"
      className="fr-fieldset w-full mb-1"
      id="checkboxes"
    >
      {legend && (
        <legend
          className="fr-fieldset__legend--regular fr-fieldset__legend"
          id="checkboxes-legend"
        >
          {legend}
        </legend>
      )}
      <div className="fr-checkbox-group w-full">
        {options.length > 0
          ? options.map((option) => (
              <div
                key={`checkbox-${option.id}`}
                className={`fr-fieldset__element ml-2 w-full ${
                  options.length - 1 !== options.indexOf(option)
                    ? "border-bottom-grey pb-3"
                    : ""
                }`}
              >
                <div className="fr-checkbox-group w-full">
                  <div className="flex items-center w-full">
                    <input
                      aria-describedby={`${option.id}-messages`}
                      checked={option.checked}
                      id={option.id}
                      name={option.id}
                      onChange={(e) => onChange(option.id, e.target.checked)}
                      type="checkbox"
                    />
                    <label className="fr-label flex-grow" htmlFor={option.id}>
                      {option.label}
                    </label>
                  </div>
                  <div
                    aria-live="assertive"
                    className="fr-messages-group"
                    id={`${option.id}-messages`}
                  />
                </div>
              </div>
            ))
          : null}
      </div>
      <div
        aria-live="assertive"
        className="fr-messages-group"
        data-testid="checkboxes-messages-assertive"
        id="checkboxes-messages"
      />
    </fieldset>
  );
};

export default CheckboxGroup;
