import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Badge } from "@/components/ui";
import { LogoutButton } from "@/features/auth/logout-button";
import { NasabahNav, NasabahNavFallback } from "./nasabah-nav";

export function NasabahShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-muted/40">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/nasabah" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-body-sm font-bold text-foreground">
              BS
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-body-sm font-semibold text-foreground">
                Bank Sampah Digital
              </span>
              <span className="text-caption text-muted">Ruang nasabah</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="info">Prototype</Badge>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-5 pb-28">{children}</main>

      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface"
      >
        <Suspense fallback={<NasabahNavFallback />}>
          <NasabahNav />
        </Suspense>
      </nav>
    </div>
  );
}
