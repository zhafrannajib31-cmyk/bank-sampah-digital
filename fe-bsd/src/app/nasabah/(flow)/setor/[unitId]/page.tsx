import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui";
import { PilihKategoriForm } from "@/features/nasabah/pilih-kategori-form";

export const metadata: Metadata = {
  title: "Pilih jenis sampah",
};

export default function PilihKategoriPage() {
  return (
    <Suspense fallback={<LoadingState label="Memuat pilihan jenis sampah…" />}>
      <PilihKategoriForm />
    </Suspense>
  );
}
