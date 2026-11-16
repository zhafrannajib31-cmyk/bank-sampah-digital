import Link from "next/link";

export interface StepHeaderProps {
  title: string;
  /** Langkah saat ini (mulai dari 1). */
  step: number;
  totalSteps: number;
  backHref: string;
}

export function StepHeader({ title, step, totalSteps, backHref }: StepHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Kembali"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brown-light text-foreground transition-colors hover:bg-brown-light-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-h4 text-foreground">{title}</h1>
          <p className="text-caption text-muted">
            Langkah {step} dari {totalSteps}
          </p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-label="Kemajuan langkah"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={step}
        aria-valuetext={`Langkah ${step} dari ${totalSteps}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-brown-light"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </header>
  );
}
