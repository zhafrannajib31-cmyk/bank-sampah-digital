import { Suspense, type ReactNode } from "react";
import { LoadingState } from "@/components/ui";

/** Layar detail dan langkah petugas: tanpa menu bawah. */
export default function PetugasFlowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas font-inter">
      <Suspense fallback={<LoadingState label="Memuat…" />}>{children}</Suspense>
    </div>
  );
}
