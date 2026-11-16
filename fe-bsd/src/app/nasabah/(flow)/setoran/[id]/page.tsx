"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ErrorState } from "@/components/ui";
import { HasilTimbang } from "@/features/nasabah/hasil-timbang";
import { RincianSetoran } from "@/features/nasabah/rincian-setoran";
import { SetoranSelesai } from "@/features/nasabah/setoran-selesai";
import { usePrototype } from "@/features/nasabah/prototype-store";

/** Satu rute, tampilan mengikuti status: Selesai, Diproses (sudah ditimbang), atau rincian lain. */
export default function DetailSetoranPage() {
  const { id } = useParams<{ id: string }>();
  const { deposits, units } = usePrototype();
  const deposit = deposits.find((candidate) => candidate.id === id);

  if (!deposit) {
    return (
      <div className="mx-auto w-full max-w-[430px] flex-1 bg-surface p-5">
        <Link href="/nasabah/riwayat" className="text-[14px] font-semibold text-blue-dark">
          ← Kembali ke riwayat
        </Link>
        <div className="mt-4">
          <ErrorState
            title="Setoran tidak ditemukan"
            description="Data setoran tidak tersedia atau bukan milik Anda."
          />
        </div>
      </div>
    );
  }

  if (deposit.status === "selesai") return <SetoranSelesai deposit={deposit} deposits={deposits} />;

  const weighed =
    deposit.status === "diproses" && deposit.items.every((item) => item.actualWeight !== undefined);
  if (weighed) return <HasilTimbang deposit={deposit} />;

  return <RincianSetoran deposit={deposit} unit={units.find((u) => u.id === deposit.unitId)} />;
}
