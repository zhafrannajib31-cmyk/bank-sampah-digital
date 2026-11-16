import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui";
import { DetailSetoran } from "@/features/nasabah/detail-setoran";

export const metadata: Metadata = {
  title: "Detail setoran",
};

export default function DetailSetoranPage() {
  return (
    <Suspense fallback={<LoadingState label="Memuat detail setoran…" />}>
      <DetailSetoran />
    </Suspense>
  );
}
