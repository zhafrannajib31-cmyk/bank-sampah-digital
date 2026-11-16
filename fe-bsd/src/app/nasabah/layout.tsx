import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PrototypeProvider } from "@/features/nasabah/prototype-store";

export const metadata: Metadata = {
  title: "Nasabah",
};

export default function NasabahLayout({ children }: { children: ReactNode }) {
  return <PrototypeProvider>{children}</PrototypeProvider>;
}
