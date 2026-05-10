import { ChangeEvent, InputHTMLAttributes, ReactNode, useId } from "react";
import "./TextField.css";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  containerClassName?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function TextField({
  label,
  helperText,
  error,
  value,
  onChange,
  containerClassName,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={cls("ui26-field", error && "ui26-field--error", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="ui26-field__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        value={value ?? ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
        className={cls("ui26-field__input", className)}
        {...rest}
      />
      {helperText && <div className="ui26-field__helper">{helperText}</div>}
    </div>
  );
}
