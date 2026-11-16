import type { ReactNode } from "react";
import { PetugasShell } from "@/features/petugas/petugas-shell";

export default function PetugasTabsLayout({ children }: { children: ReactNode }) {
  return <PetugasShell>{children}</PetugasShell>;
}
