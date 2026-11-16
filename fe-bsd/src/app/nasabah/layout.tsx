import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NasabahShell } from "@/features/nasabah/nasabah-shell";
import { PrototypeProvider } from "@/features/nasabah/prototype-store";

export const metadata: Metadata = {
  title: "Nasabah",
};

export default function NasabahLayout({ children }: { children: ReactNode }) {
  return (
    <PrototypeProvider>
      <NasabahShell>{children}</NasabahShell>
    </PrototypeProvider>
  );
}
