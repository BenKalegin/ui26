import { ChangeEvent, ReactNode, TextareaHTMLAttributes, useId } from "react";
import "../TextField/TextField.css";
import "./TextareaField.css";

export interface TextareaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
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

export function TextareaField({
  label,
  helperText,
  error,
  value,
  onChange,
  containerClassName,
  className,
  id,
  rows = 4,
  ...rest
}: TextareaFieldProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  return (
    <div className={cls("ui26-field", error && "ui26-field--error", containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="ui26-field__label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        value={value ?? ""}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
        className={cls("ui26-field__textarea", className)}
        {...rest}
      />
      {helperText && <div className="ui26-field__helper">{helperText}</div>}
    </div>
  );
}
