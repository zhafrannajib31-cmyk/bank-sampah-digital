"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { GroupLabel } from "@/features/nasabah/deposit-ui";
import { dayKey } from "@/features/nasabah/format";
import { PETUGAS_TODAY } from "@/features/petugas/mock-data";
import { QueueEntry } from "@/features/petugas/queue-entry";
import { usePetugasDeposits } from "@/features/petugas/store";

const pill =
  "flex h-[42px] shrink-0 items-center justify-center rounded-full border px-5 text-[12px] text-heading";

const dayLabel = (key: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${key}T12:00:00+07:00`))
    .toUpperCase();

export default function RiwayatPage() {
  const deposits = usePetugasDeposits();
  const history = deposits
    .filter((deposit) => deposit.status === "selesai" || deposit.status === "dibatalkan")
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  // Kelompokkan per hari: "Hari ini" lalu tanggal sebelumnya.
  const groups: { key: string; items: typeof history }[] = [];
  for (const deposit of history) {
    const key = dayKey(deposit.submittedAt);
    const group = groups.find((entry) => entry.key === key);
    if (group) group.items.push(deposit);
    else groups.push({ key, items: [deposit] });
  }

  return (
    <div className="mx-auto w-full max-w-[720px] lg:max-w-[1180px]">
      <header className="bg-white px-5 pt-[50px] pb-1">
        <h1 className="text-[22px] leading-[28px] font-bold text-heading">Riwayat Unit</h1>
        <p className="text-[12px] leading-[16px] text-[#64766d]">
          Transaksi selesai dan dibatalkan (simulasi)
        </p>
        <div
          role="group"
          aria-label="Filter status"
          className="mt-4 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link
            href="/petugas/antrean?tab=menunggu"
            className={`${pill} border-[#daeae0] bg-white font-semibold`}
          >
            Menunggu
          </Link>
          <Link
            href="/petugas/antrean?tab=diproses"
            className={`${pill} border-[#daeae0] bg-white`}
          >
            Diproses
          </Link>
          <span aria-current="true" className={`${pill} border-[#00d951] bg-[#00d951]`}>
            Selesai
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-5 pt-[18px]">
        {groups.length === 0 ? (
          <EmptyState
            title="Belum ada riwayat"
            description="Transaksi yang selesai atau dibatalkan tampil di sini."
          />
        ) : (
          groups.map((group) => (
            <section key={group.key} className="flex flex-col gap-[10px]">
              <GroupLabel>
                {group.key === PETUGAS_TODAY
                  ? `HARI INI · ${dayLabel(group.key)}`
                  : dayLabel(group.key)}
              </GroupLabel>
              <ul className="grid gap-[10px] md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((deposit) => (
                  <li key={deposit.id}>
                    <QueueEntry deposit={deposit} href={`/petugas/transaksi/${deposit.id}`} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
        <p className="pb-4 text-center text-[12px] font-bold text-black/50">
          Data contoh (simulasi)
        </p>
      </div>
    </div>
  );
}
