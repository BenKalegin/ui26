import { ChangeEvent, ReactNode, SelectHTMLAttributes, useId } from "react";
import "../TextField/TextField.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  containerClassName?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function SelectField({
  label,
  helperText,
  error,
  value,
  onChange,
  options,
  containerClassName,
  className,
  id,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className={cls("ui26-field", error && "ui26-field--error", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="ui26-field__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value ?? ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
        className={cls("ui26-field__select", className)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {helperText && <div className="ui26-field__helper">{helperText}</div>}
    </div>
  );
}
