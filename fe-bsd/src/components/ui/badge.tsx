import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "success" | "info" | "warning" | "danger";

const badgeVariantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-brown-light text-brown-darker",
  success: "bg-green-light text-green-darker",
  info: "bg-blue-light text-blue-darker",
  warning: "bg-brown-light text-brown-darker ring-1 ring-brown-light-active",
  danger: "bg-danger-soft text-danger-dark",
};

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({
  variant = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold whitespace-nowrap",
        badgeVariantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export type DepositStatus = "menunggu" | "diproses" | "selesai" | "dibatalkan";

const depositStatusConfig: Record<DepositStatus, { label: string; variant: BadgeVariant }> = {
  menunggu: { label: "Menunggu", variant: "warning" },
  diproses: { label: "Diproses", variant: "info" },
  selesai: { label: "Selesai", variant: "success" },
  dibatalkan: { label: "Dibatalkan", variant: "danger" },
};

export interface StatusBadgeProps {
  status: DepositStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = depositStatusConfig[status];

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}
