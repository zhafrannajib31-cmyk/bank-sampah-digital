import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends ComponentProps<"input"> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  id,
  name,
  label,
  hint,
  error,
  required,
  disabled,
  className,
  containerClassName,
  ...props
}: InputProps) {
  const inputId = id ?? name;
  const hintId = inputId && hint ? `${inputId}-hint` : undefined;
  const errorId = inputId && error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-body-sm font-semibold text-foreground">
          {label}
          {required ? (
            <span aria-hidden className="ml-0.5 text-danger">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <input
        id={inputId}
        name={name}
        required={required}
        disabled={disabled}
        aria-label={!inputId ? label : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "block min-h-11 w-full rounded-lg border bg-surface px-3 py-2.5 text-body text-foreground transition-colors",
          "placeholder:text-muted/60 focus:ring-2 focus:outline-none",
          "disabled:cursor-not-allowed disabled:bg-brown-light disabled:text-muted",
          error
            ? "border-danger focus:border-danger focus:ring-danger/25"
            : "border-border focus:border-accent focus:ring-accent/25",
          className,
        )}
        {...props}
      />
      {hint && !error ? (
        <p id={hintId} className="text-body-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-body-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
