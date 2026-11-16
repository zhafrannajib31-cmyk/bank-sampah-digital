import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-foreground hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "bg-brown-light text-foreground hover:bg-brown-light-hover active:bg-brown-light-active",
  outline:
    "border border-border bg-surface text-foreground hover:bg-brown-light active:bg-brown-light-hover",
  ghost: "bg-transparent text-foreground hover:bg-brown-light active:bg-brown-light-hover",
  danger: "bg-danger text-white hover:bg-danger-hover active:bg-danger-dark",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-1.5 text-body-sm",
  md: "min-h-11 px-4 py-2.5 text-body",
  lg: "min-h-12 px-5 py-3 text-body-lg",
};

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Kelas tombol untuk elemen non-button, misalnya Next.js Link. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonClassOptions = {}): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  type = "button",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leftIcon
      )}
      {isLoading ? (loadingText ?? children) : children}
      {!isLoading ? rightIcon : null}
    </button>
  );
}
