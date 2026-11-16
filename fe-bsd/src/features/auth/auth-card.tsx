import Link from "next/link";
import type { ReactNode } from "react";

/** Kartu putih di tengah latar gradien; dipakai semua layar autentikasi. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
      <Link href="/" className="flex items-center gap-2 self-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-body-sm font-bold text-foreground">
          BS
        </span>
        <span className="text-body font-semibold text-foreground">Bank Sampah Digital</span>
      </Link>
      <div className="flex flex-col gap-5 rounded-2xl bg-surface p-6 shadow-lg">
        <div className="flex flex-col gap-1">
          <h1 className="text-h3 text-foreground">{title}</h1>
          {description ? <p className="text-body-sm text-muted">{description}</p> : null}
        </div>
        {children}
      </div>
      {footer ? <p className="text-center text-body-sm text-foreground">{footer}</p> : null}
    </main>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2.5 text-body-sm font-medium text-danger-dark"
    >
      {children}
    </div>
  );
}

export const linkClass =
  "inline-flex min-h-11 items-center font-semibold text-blue-dark underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";
