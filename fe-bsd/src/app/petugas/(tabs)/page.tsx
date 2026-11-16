"use client";

import Link from "next/link";
import { Asset } from "@/components/ui";
import { CategoryTile } from "@/features/nasabah/category-tile";
import { formatRupiah, formatWeight } from "@/features/nasabah/format";
import { OFFICER_NAME, OFFICER_UNIT } from "@/features/petugas/mock-data";
import { usePetugasDeposits } from "@/features/petugas/store";

export default function PetugasBerandaPage() {
  const deposits = usePetugasDeposits();
  const count = (status: string) => deposits.filter((d) => d.status === status).length;
  const waiting = count("menunggu");
  const processing = count("diproses");
  const done = deposits.filter((d) => d.status === "selesai");
  const weighed = done.reduce(
    (sum, d) => sum + d.items.reduce((acc, item) => acc + (item.actualWeight ?? 0), 0),
    0,
  );
  const latest = deposits
    .filter((d) => d.status === "menunggu" || d.status === "diproses")
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 3);

  return (
    <div className="min-h-dvh bg-mist">
      <div className="relative h-[210px] overflow-hidden">
        <Asset
          src="/nasabah/home-header-blob.svg"
          width={588}
          height={379}
          className="absolute top-[-117px] left-1/2 h-[379px] w-[max(588px,100%)] max-w-none -translate-x-1/2"
        />
        <div className="relative mx-auto w-full max-w-[430px] px-5 pt-10 md:max-w-[720px] lg:max-w-[1180px]">
          <div className="flex h-11 items-center justify-between">
            <p className="font-sans text-[18px] font-medium tracking-[-0.275px] text-white">
              Dashboard
            </p>
            <Asset src="/nasabah/home-bell-avatar.svg" width={63.6667} height={32} />
          </div>
          <h1 className="mt-1 font-sans text-[22px] leading-[26px] font-semibold text-white">
            Halo, {OFFICER_NAME.split(" ")[0]}
          </h1>
          <p className="text-[12px] leading-[18px] text-white">Siap melayani setoran hari ini?</p>
        </div>
      </div>

      <div className="mx-auto -mt-[66px] grid max-w-[430px] gap-5 px-5 pb-6 md:max-w-[720px] md:grid-cols-2 md:items-start lg:max-w-[1180px] lg:grid-cols-3">
        <div className="flex flex-col gap-5 md:col-start-1 md:row-start-1">
          <section
            aria-label="Ringkasan antrean"
            className="flex flex-col gap-[21px] rounded-[20px] bg-primary px-[21px] pt-5 pb-[19px] shadow-[0_4px_4px_rgba(0,107,44,0.25)]"
          >
            <span className="flex flex-col gap-[18px] font-sans text-foreground">
              <span className="flex items-center gap-[6px] text-[12px] leading-[16px] font-medium">
                <Asset src="/nasabah/icon-wallet-sm.svg" width={14.25} height={13.5} />
                Antrean {OFFICER_UNIT}
              </span>
              <span className="flex flex-col gap-[10px]">
                <span className="text-[12px] leading-[16px] font-medium">Pengajuan Menunggu</span>
                <span className="text-[25px] leading-[30px] font-bold">{waiting} pengajuan</span>
              </span>
            </span>
            <span className="flex flex-col gap-3">
              <Asset src="/nasabah/line-card.svg" width={298.5} height={0.5} className="w-full" />
              <span className="flex items-center gap-[6px] font-jakarta text-[12px] leading-[18px] text-foreground">
                <Asset src="/nasabah/icon-leaf-sm.svg" width={11.33} height={11.33} />
                {processing} sedang diproses · {done.length} selesai hari ini
              </span>
            </span>
          </section>

          <section className="flex flex-col gap-[22px] rounded-[20px] bg-white py-[14px] pt-[11px] pr-2 pl-4 shadow-[4px_4px_4px_rgba(0,0,0,0.1)]">
            <div className="flex gap-[14px]">
              <Asset
                src="/nasabah/action-recycle.svg"
                width={45}
                height={45.5}
                className="shrink-0 self-start"
              />
              <div className="flex flex-col gap-[5px]">
                <p className="font-sans text-[18px] leading-[18px] font-medium text-black">
                  Antrean Pengajuan
                </p>
                <p className="font-jakarta text-[12px] leading-[18px] text-black/70">
                  Periksa, timbang, dan konfirmasi pengajuan setoran nasabah.
                </p>
              </div>
            </div>
            <Link
              href="/petugas/antrean"
              className="mx-auto flex h-11 w-full max-w-[250px] items-center justify-center rounded-full bg-primary font-sans text-[14px] font-semibold text-foreground hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              Buka Antrean
            </Link>
          </section>
        </div>

        <section
          aria-labelledby="terbaru"
          className="flex flex-col gap-3 md:col-start-2 md:row-span-2 md:row-start-1 lg:col-start-3 lg:row-span-1"
        >
          <div className="flex items-center justify-between">
            <h2
              id="terbaru"
              className="font-sans text-[18px] leading-[20px] font-medium text-black"
            >
              Pengajuan Terbaru
            </h2>
            <Link
              href="/petugas/antrean"
              className="inline-flex min-h-11 items-center gap-1 font-jakarta text-[12px] font-bold text-blue-dark"
            >
              Lihat Semua
              <Asset src="/nasabah/icon-chevron-sm.svg" width={4.933} height={8} />
            </Link>
          </div>
          <ul className="flex flex-col gap-[13px]">
            {latest.map((deposit) => (
              <li
                key={deposit.id}
                className="flex min-h-[72px] items-center gap-3 rounded-[15px] bg-white px-3 py-4 drop-shadow-[0_4px_2px_rgba(0,0,0,0.05)]"
              >
                <CategoryTile id={deposit.items[0]?.categoryId ?? ""} />
                <span className="flex min-w-0 flex-1 flex-col font-jakarta">
                  <span className="text-[14px] leading-[20px] font-semibold text-ink">
                    {deposit.customerName}
                  </span>
                  <span className="text-[12px] leading-[20px] font-medium text-black/70">
                    {deposit.code} · est.{" "}
                    {formatWeight(deposit.items.reduce((s, i) => s + i.estimatedWeight, 0))}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-[2px] font-jakarta font-bold">
                  <span className="text-[14px] leading-[20px] text-green-dark-active">
                    {formatRupiah(deposit.estimatedTotal)}
                  </span>
                  <span className="text-[12px] leading-[17px] text-black/60">
                    Est. {deposit.status === "menunggu" ? "Menunggu" : "Diproses"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-center font-jakarta text-[12px] leading-[17px] font-bold text-black/60">
            Data contoh (simulasi)
          </p>
        </section>

        <div className="flex flex-col gap-5 md:col-start-1 md:row-start-2 lg:col-start-2 lg:row-start-1">
          <section
            aria-label="Ringkasan hari ini"
            className="rounded-[20px] bg-green-light p-[18px] pb-4 shadow-[0_4px_4px_rgba(0,234,86,0.1)]"
          >
            <div className="flex gap-[10px]">
              <Asset src="/nasabah/dampak-plant.svg" width={40} height={40} className="shrink-0" />
              <div className="flex flex-col gap-[2px]">
                <p className="flex items-center gap-2 text-[12px] leading-[18px] font-semibold tracking-[1px] text-green-dark-active">
                  RINGKASAN HARI INI
                  <Asset src="/nasabah/dampak-check.svg" width={12.8333} height={12.25} />
                </p>
                <p className="font-jakarta text-[14px] leading-[18px] font-semibold text-black">
                  {formatWeight(weighed)} sampah ditimbang
                </p>
                <p className="font-jakarta text-[12px] leading-[18px] font-medium text-black/70">
                  Semua nilai dihitung server saat transaksi dikonfirmasi.
                </p>
              </div>
            </div>
            <Asset
              src="/nasabah/line-dampak.svg"
              width={298.5}
              height={0.5}
              className="mt-3 w-full"
            />
            <div className="mt-3 flex items-center justify-around font-jakarta text-[12px] leading-[17px] font-medium text-[#3e4a3d]">
              <span className="flex items-center gap-[6px]">
                <Asset src="/nasabah/icon-co2.svg" width={12.333} height={6} />
                {done.length} transaksi selesai
              </span>
              <span className="flex items-center gap-[5px]">
                <Asset src="/nasabah/icon-water.svg" width={10.667} height={13.333} />
                {count("dibatalkan")} dibatalkan
              </span>
            </div>
          </section>

          <section className="flex items-center gap-10 rounded-[20px] bg-green-light-active p-5 drop-shadow-[4px_4px_2px_rgba(0,234,86,0.1)]">
            <div className="flex flex-1 flex-col gap-1 font-jakarta">
              <p className="text-[12px] leading-[17px] font-bold tracking-[0.5px] text-green-dark-active uppercase">
                CATATAN PETUGAS
              </p>
              <p className="text-[14px] leading-[20px] font-semibold text-ink">
                Periksa Sampah Sebelum Menimbang
              </p>
              <p className="text-[12px] leading-[17px] text-[#3e4a3d]">
                Pastikan jenis dan kondisi sampah sesuai dengan pengajuan nasabah.
              </p>
            </div>
            <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-green-light">
              <Asset src="/nasabah/icon-bulb.svg" width={23} height={23.605} />
            </span>
          </section>
        </div>
      </div>
    </div>
  );
}
