"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

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

/** Dialog gaya Figma ("Yakin?"): kartu 310 px, tombol aksi di atas, "Kembali" di bawah. Memakai <dialog> bawaan: fokus terkunci, Esc menutup. */
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

  const button =
    "flex h-12 w-full items-center justify-center rounded-[12px] px-6 py-3 font-sans text-[16px] leading-6 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!isLoading) onCancel();
      }}
      className="m-auto w-[min(92vw,310px)] rounded-[24px] bg-surface p-6 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop:bg-black/50"
    >
      <div className="flex flex-col gap-3">
        <h2
          id={titleId}
          className="font-sans text-[19px] leading-[25px] font-semibold text-foreground"
        >
          {title}
        </h2>
        {description ? (
          <p id={descriptionId} className="font-sans text-[14.5px] leading-[21px] text-muted">
            {description}
          </p>
        ) : null}
        {children}
        <button
          type="button"
          disabled={isLoading}
          onClick={onConfirm}
          className={cn(
            button,
            destructive
              ? "bg-danger text-white hover:bg-danger-hover"
              : "bg-primary text-foreground hover:bg-primary-hover",
          )}
        >
          {isLoading ? "Memproses…" : confirmLabel}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className={cn(button, "bg-brown-light text-foreground hover:bg-brown-light-hover")}
        >
          {cancelLabel}
        </button>
      </div>
    </dialog>
  );
}
