import Link from "next/link";
import type { ReactNode } from "react";
import { Asset } from "./asset";

/** Area tombol aksi menempel di bawah layar (zona jempol) pada layar langkah. */
export function StepActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-auto flex flex-col gap-2 border-t border-line bg-surface px-5 pt-3 pb-4">
      {children}
    </div>
  );
}

export interface StepHeaderProps {
  title: string;
  /** Langkah saat ini (mulai dari 1). Bersama `totalSteps` menampilkan "Langkah x dari N" dan bar progres. */
  step?: number;
  totalSteps?: number;
  /** Teks di bawah judul bila tanpa langkah (mis. kode setoran dan nama nasabah). */
  subtitle?: string;
  backHref: string;
}

export function StepHeader({ title, step, totalSteps, subtitle, backHref }: StepHeaderProps) {
  const hasSteps = step !== undefined && totalSteps !== undefined;
  const sub = hasSteps ? `Langkah ${step} dari ${totalSteps}` : subtitle;

  return (
    <header className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-[13px]">
        <Link
          href={backHref}
          aria-label="Kembali"
          className="block size-11 shrink-0 rounded-[15px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Asset src="/nasabah/step-back.svg" width={44} height={44} />
        </Link>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="font-sans text-[18px] leading-[20px] font-medium tracking-[-0.275px] text-black">
            {title}
          </h1>
          {sub ? (
            <p className="font-inter text-[12px] leading-[17px] font-medium tracking-[-0.275px] text-green-dark-active">
              {sub}
            </p>
          ) : null}
        </div>
      </div>
      {hasSteps ? (
        <div
          role="progressbar"
          aria-label="Kemajuan langkah"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={step}
          aria-valuetext={`Langkah ${step} dari ${totalSteps}`}
          className="h-1 w-full overflow-hidden rounded-[2px] bg-brown-light"
        >
          <div
            className="h-full rounded-[2px] bg-primary transition-[width]"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      ) : (
        <hr className="border-t-[0.5px] border-line" />
      )}
    </header>
  );
}
