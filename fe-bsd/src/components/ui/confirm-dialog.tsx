"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Tombol konfirmasi dan batal dikunci selama proses berjalan. */
  isLoading?: boolean;
  /** Merah untuk aksi destruktif (Tolak, Batalkan); hijau untuk konfirmasi biasa. */
  destructive?: boolean;
  /** Slot tambahan, mis. kolom alasan wajib. */
  children?: ReactNode;
}

/** Memakai <dialog> bawaan browser: fokus terkunci, Esc menutup, latar tidak bisa diklik. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Kembali",
  onConfirm,
  onCancel,
  isLoading = false,
  destructive = true,
  children,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!isLoading) onCancel();
      }}
      className="m-auto w-[min(92vw,24rem)] rounded-2xl bg-surface p-6 text-foreground shadow-xl backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} className="text-h4">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-body-sm text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {children}
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            variant={destructive ? "danger" : "primary"}
            isLoading={isLoading}
            onClick={onConfirm}
            className="sm:flex-1"
          >
            {confirmLabel}
          </Button>
          <Button variant="outline" disabled={isLoading} onClick={onCancel} className="sm:flex-1">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
