"use client";

import Link from "next/link";
import { Asset, EmptyState } from "@/components/ui";
import {
  GroupLabel,
  depositActualWeight,
  depositTitle,
  isToday,
} from "@/features/nasabah/deposit-ui";
import {
  formatDayMonth,
  formatMonthYear,
  formatRupiah,
  formatWeight,
} from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";

export default function SaldoPage() {
  const { deposits } = usePrototype();
  const done = deposits
    .filter((deposit) => deposit.status === "selesai")
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const total = done.reduce((sum, deposit) => sum + (deposit.finalTotal ?? 0), 0);

  // Kelompokkan: "Hari ini", lalu per bulan.
  const groups: { label: string; items: typeof done }[] = [];
  for (const deposit of done) {
    const label = isToday(deposit.submittedAt)
      ? "HARI INI · 25 OKT 2026"
      : formatMonthYear(deposit.submittedAt);
    const group = groups.find((entry) => entry.label === label);
    if (group) group.items.push(deposit);
    else groups.push({ label, items: [deposit] });
  }

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <header className="h-[154px] bg-white px-5 pt-[50px]">
        <h1 className="text-[22px] leading-[28px] font-bold text-heading">Saldo Setoran</h1>
        <p className="text-[12px] leading-[16px] text-[#64766d]">
          Catatan nilai setoran, bukan dana yang bisa ditarik
        </p>
      </header>

      <div className="-mt-[42px] flex flex-col gap-4 px-5">
        <section
          aria-label="Total nilai setoran"
          className="flex flex-col gap-[21px] rounded-[20px] bg-primary px-[21px] pt-5 pb-[19px] text-foreground shadow-[0_4px_4px_rgba(0,107,44,0.25)]"
        >
          <div className="flex flex-col gap-[18px] font-sans">
            <p className="flex items-center gap-[6px] text-[12px] leading-[16px] font-medium">
              <Asset src="/nasabah/icon-wallet-sm.svg" width={14.25} height={13.5} />
              Total Nilai Setoran
            </p>
            <div className="flex flex-col gap-[10px]">
              <p className="text-[12px] leading-[16px] font-medium">
                Tercatat dari {done.length} setoran selesai
              </p>
              <p className="text-[25px] leading-[30px] font-bold">{formatRupiah(total)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Asset src="/nasabah/line-card.svg" width={298.5} height={0.5} className="w-full" />
            <p className="flex items-center gap-[6px] font-jakarta text-[12px] leading-[18px]">
              <Asset src="/nasabah/icon-leaf-sm.svg" width={11.33} height={11.33} />
              Catatan nilai setoran, bukan dana yang bisa ditarik
            </p>
          </div>
        </section>

        {groups.length === 0 ? (
          <EmptyState
            title="Belum ada saldo"
            description="Saldo muncul setelah petugas mengonfirmasi setoran pertamamu."
          />
        ) : (
          groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-[10px]">
              <GroupLabel>{group.label}</GroupLabel>
              <ul className="flex flex-col gap-[10px]">
                {group.items.map((deposit) => (
                  <li key={deposit.id}>
                    <Link
                      href={`/nasabah/setoran/${deposit.id}`}
                      className="flex min-h-[74px] items-center gap-3 rounded-[16px] border border-line bg-white px-[15px] py-[10px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                    >
                      <Asset
                        src="/nasabah/status-selesai.svg"
                        width={44}
                        height={44}
                        className="shrink-0"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                        <span className="text-[14px] leading-[18px] font-semibold text-heading">
                          {depositTitle(deposit)}
                        </span>
                        <span className="text-[12px] leading-[17px] text-subtle">
                          {[
                            isToday(deposit.submittedAt)
                              ? null
                              : formatDayMonth(deposit.submittedAt),
                            deposit.unitName,
                            formatWeight(depositActualWeight(deposit)),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-[3px]">
                        <span className="text-[14px] leading-[15px] font-bold text-green-dark-hover">
                          {formatRupiah(deposit.finalTotal ?? 0)}
                        </span>
                        <span className="flex h-[19px] items-center rounded-full bg-open-bg px-[9px] text-[12px] font-semibold text-green-dark-active">
                          Selesai
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
        <p className="pb-4 text-center text-[12px] font-bold text-black/60">
          Data contoh (simulasi)
        </p>
      </div>
    </div>
  );
}
