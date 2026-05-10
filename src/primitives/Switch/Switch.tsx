import { ChangeEvent, InputHTMLAttributes, ReactNode, useId } from "react";
import "./Switch.css";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked"> {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  containerClassName?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Switch({
  label,
  checked,
  onChange,
  containerClassName,
  className,
  id,
  disabled,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label htmlFor={inputId} className={cls("ui26-switch", containerClassName)}>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked ?? false}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked)}
        className={cls("ui26-switch__input", className)}
        disabled={disabled}
        {...rest}
      />
      <span className="ui26-switch__track" aria-hidden="true">
        <span className="ui26-switch__thumb" />
      </span>
      {label && <span className="ui26-switch__label">{label}</span>}
    </label>
  );
}
