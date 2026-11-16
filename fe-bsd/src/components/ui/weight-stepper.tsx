"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Asset } from "./asset";

/** Terima koma atau titik, maks. 3 desimal. Hasil NaN bila kosong/tidak valid. */
export function parseWeight(text: string): number {
  const normalized = text.trim().replace(",", ".");
  return /^\d+(\.\d{1,3})?$/.test(normalized) ? Number(normalized) : NaN;
}

const STEP = 0.5;
const format = (value: number) => {
  const text = String(Math.round(value * 1000) / 1000);
  return (text.includes(".") ? text : `${text}.0`).replace(".", ",");
};

export interface WeightStepperProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Input berat gaya Figma: tombol - / + (langkah 0,5 kg) mengapit angka besar berkoma. */
export function WeightStepper({ label, value, onChange, error }: WeightStepperProps) {
  const id = useId();
  const messageId = `${id}-msg`;
  const current = parseWeight(value);
  const bump = (delta: number) =>
    onChange(format(Math.max(0, (Number.isNaN(current) ? 0 : current) + delta)));

  const buttonClass =
    "flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-40";

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "flex h-[65px] items-center justify-between rounded-[10px] border bg-white px-[5px]",
          error ? "border-danger" : "border-primary",
        )}
      >
        <button
          type="button"
          aria-label={`Kurangi berat ${label}`}
          disabled={Number.isNaN(current) || current <= 0}
          onClick={() => bump(-STEP)}
          className={buttonClass}
        >
          <Asset src="/nasabah/stepper-minus.svg" width={35} height={35} />
        </button>
        <label htmlFor={id} className="flex min-w-0 flex-1 items-baseline justify-center gap-1">
          <span className="sr-only">{`Berat ${label} dalam kilogram`}</span>
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            value={value}
            placeholder="0,0"
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? messageId : undefined}
            className="w-[81px] min-w-0 bg-transparent text-center font-inter text-[30px] leading-[36px] font-semibold text-black placeholder:text-black/30 focus:outline-none"
          />
          <span aria-hidden className="font-inter text-[12px] text-black/70">
            kg
          </span>
        </label>
        <button
          type="button"
          aria-label={`Tambah berat ${label}`}
          onClick={() => bump(STEP)}
          className={buttonClass}
        >
          <Asset src="/nasabah/stepper-plus.svg" width={35} height={35} />
        </button>
      </div>
      {error ? (
        <p id={messageId} className="font-inter text-[12px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
