import type { ReactNode } from "react";
import { NasabahShell } from "@/features/nasabah/nasabah-shell";

export default function NasabahTabsLayout({ children }: { children: ReactNode }) {
  return <NasabahShell>{children}</NasabahShell>;
}
