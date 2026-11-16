import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Memuat data…", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl bg-surface p-8 text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-6 animate-spin rounded-full border-[3px] border-green-darker border-t-transparent"
      />
      <p className="text-body-sm text-muted">{label}</p>
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface p-8 text-center",
        className,
      )}
    >
      <span aria-hidden className="text-brown-normal">
        {icon ?? <InboxIcon />}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-h4 text-foreground">{title}</p>
        {description ? <p className="text-body-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Terjadi kesalahan",
  description = "Data gagal dimuat. Periksa koneksi lalu coba lagi.",
  onRetry,
  retryLabel = "Coba lagi",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger-soft p-8 text-center",
        className,
      )}
    >
      <span aria-hidden className="text-danger">
        <AlertIcon />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-h4 text-danger-dark">{title}</p>
        <p className="text-body-sm text-danger-dark/80">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

function InboxIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M4 13h4l2 3h4l2-3h4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}
