import { Suspense, type ReactNode } from "react";
import { LoadingState } from "@/components/ui";

/** Layar langkah dan detail: tanpa menu bawah. Tiap layar mengatur lebar kolomnya sendiri. */
export default function NasabahFlowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas font-inter">
      <Suspense fallback={<LoadingState label="Memuat…" />}>{children}</Suspense>
    </div>
  );
}
