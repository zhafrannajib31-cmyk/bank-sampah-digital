"use client";

import Link from "next/link";
import { Asset, EmptyState } from "@/components/ui";
import { CategoryTile } from "@/features/nasabah/category-tile";
import { depositActualWeight, depositTitle } from "@/features/nasabah/deposit-ui";
import {
  formatClock,
  formatDateMedium,
  formatRupiah,
  formatWeight,
} from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";

// Faktor dampak (simulasi) agar kartu "Dampak Lingkunganmu" terhitung dari data setoran.
const CO2_KG_PER_KG = 0.67;
const WATER_L_PER_KG = 3.36;

const formatDecimal = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value);

export default function BerandaPage() {
  const { deposits, profile } = usePrototype();
  const done = deposits.filter((deposit) => deposit.status === "selesai");
  const balance = done.reduce((sum, deposit) => sum + (deposit.finalTotal ?? 0), 0);
  const recent = [...done].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 3);
  const totalWeight = done.reduce((sum, deposit) => sum + depositActualWeight(deposit), 0);
  const firstName = profile.name.split(" ")[0];

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
            Halo, {firstName}
          </h1>
          <p className="text-[12px] leading-[18px] text-white">
            Siap ubah sampah jadi nilai hari ini?
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-[66px] grid max-w-[430px] gap-5 px-5 pb-6 md:max-w-[720px] md:grid-cols-2 md:items-start lg:max-w-[1180px] lg:grid-cols-3">
        <div className="flex flex-col gap-5 md:col-start-1 md:row-start-1">
          <Link
            href="/nasabah/saldo"
            className="relative flex flex-col gap-[21px] rounded-[20px] bg-primary px-[21px] pt-5 pb-[19px] shadow-[0_4px_4px_rgba(0,107,44,0.25)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <span className="flex flex-col gap-[18px] font-sans text-foreground">
              <span className="flex items-center gap-[6px] text-[12px] leading-[16px] font-medium">
                <Asset src="/nasabah/icon-wallet-sm.svg" width={14.25} height={13.5} />
                Saldo Saya
              </span>
              <span className="flex flex-col gap-[10px]">
                <span className="text-[12px] leading-[16px] font-medium">Saldo Setoran</span>
                <span className="text-[25px] leading-[30px] font-bold">
                  {formatRupiah(balance)}
                </span>
              </span>
            </span>
            <span className="flex flex-col gap-3">
              <Asset src="/nasabah/line-card.svg" width={298.5} height={0.5} className="w-full" />
              <span className="flex items-center gap-[6px] font-jakarta text-[12px] leading-[18px] text-foreground">
                <Asset src="/nasabah/icon-leaf-sm.svg" width={11.33} height={11.33} />
                Catatan nilai setoran, bukan dana yang bisa ditarik
              </span>
            </span>
          </Link>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2 rounded-[20px] bg-white p-4 shadow-[4px_4px_4px_rgba(0,0,0,0.1)]">
              <Asset src="/nasabah/action-recycle.svg" width={45} height={45.5} />
              <p className="font-sans text-[18px] leading-[18px] font-medium text-black">
                Antar Sendiri
              </p>
              <p className="font-jakarta text-[12px] leading-[18px] text-black/70">
                Bawa sampah ke Unit terdekat.
              </p>
              <Link
                href="/nasabah/setor"
                className="mt-auto flex h-11 w-full max-w-[137px] items-center justify-center rounded-full bg-primary font-sans text-[14px] font-semibold text-foreground hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                Mulai Setor
              </Link>
            </div>
            <div className="flex flex-1 flex-col gap-2 rounded-[20px] bg-blue-light p-4 shadow-[4px_4px_4px_rgba(14,165,233,0.1)]">
              <Asset src="/nasabah/action-truck.svg" width={45} height={45.3333} />
              <p className="font-sans text-[18px] leading-[18px] font-medium text-blue-dark">
                Jemput Sampah
              </p>
              <p className="font-jakarta text-[12px] leading-[18px] text-blue-dark">
                Petugas menjemput langsung di lokasimu.
              </p>
              <button
                type="button"
                disabled
                title="Fitur penjemputan segera hadir"
                className="mt-auto flex h-11 w-full max-w-[137px] items-center justify-center rounded-full bg-blue-dark font-sans text-[14px] font-semibold text-white disabled:opacity-60"
              >
                Minta Jemput
              </button>
            </div>
          </div>
        </div>

        <section
          aria-labelledby="terakhir"
          className="flex flex-col gap-3 md:col-start-2 md:row-span-2 md:row-start-1 lg:col-start-3 lg:row-span-1"
        >
          <div className="flex items-center justify-between">
            <h2
              id="terakhir"
              className="font-sans text-[18px] leading-[20px] font-medium text-black"
            >
              Transaksi Terakhir
            </h2>
            <Link
              href="/nasabah/riwayat"
              className="inline-flex min-h-11 items-center gap-1 font-jakarta text-[12px] font-bold text-blue-dark"
            >
              Lihat Semua
              <Asset src="/nasabah/icon-chevron-sm.svg" width={4.933} height={8} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              title="Belum ada transaksi"
              description="Setoran yang sudah dikonfirmasi petugas tampil di sini."
            />
          ) : (
            <ul className="flex flex-col gap-[13px]">
              {recent.map((deposit) => (
                <li key={deposit.id}>
                  <Link
                    href={`/nasabah/setoran/${deposit.id}`}
                    className="flex min-h-[72px] items-center gap-3 rounded-[15px] bg-white px-3 py-4 drop-shadow-[0_4px_2px_rgba(0,0,0,0.05)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    <CategoryTile id={deposit.items[0]?.categoryId ?? ""} />
                    <span className="flex min-w-0 flex-1 flex-col font-jakarta">
                      <span className="text-[14px] leading-[20px] font-semibold text-ink">
                        {depositTitle(deposit)}
                      </span>
                      <span className="text-[12px] leading-[20px] font-medium text-black/70">
                        {formatWeight(depositActualWeight(deposit))} ·{" "}
                        {formatDateMedium(deposit.submittedAt)} · {formatClock(deposit.submittedAt)}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-[2px] font-jakarta font-bold">
                      <span className="text-[14px] leading-[20px] text-green-dark-active">
                        + {formatRupiah(deposit.finalTotal ?? 0)}
                      </span>
                      <span className="text-[12px] leading-[17px] text-black/50">
                        Antar Sendiri
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="text-center font-jakarta text-[12px] leading-[17px] font-bold text-black/50">
            Data contoh (simulasi)
          </p>
        </section>

        <div className="flex flex-col gap-5 md:col-start-1 md:row-start-2 lg:col-start-2 lg:row-start-1">
          <section
            aria-label="Dampak lingkunganmu"
            className="relative rounded-[20px] bg-green-light p-[18px] pb-4 shadow-[0_4px_4px_rgba(0,234,86,0.1)]"
          >
            <div className="flex gap-[10px]">
              <Asset src="/nasabah/dampak-plant.svg" width={40} height={40} className="shrink-0" />
              <div className="flex flex-col gap-[2px]">
                <p className="flex items-center gap-2 text-[12px] leading-[18px] font-semibold tracking-[1px] text-green-dark-active">
                  DAMPAK LINGKUNGANMU
                  <Asset src="/nasabah/dampak-check.svg" width={12.8333} height={12.25} />
                </p>
                <p className="font-jakarta text-[14px] leading-[18px] font-semibold text-black">
                  {formatDecimal(totalWeight)} kg sampah berhasil didaur ulang
                </p>
                <p className="font-jakarta text-[12px] leading-[18px] font-medium text-black/70">
                  Terimakasih sudah ikut menjaga kelestarian bumi bersama kami!
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
                {formatDecimal(totalWeight * CO2_KG_PER_KG)} kg CO₂ ditekan
              </span>
              <span className="flex items-center gap-[5px]">
                <Asset src="/nasabah/icon-water.svg" width={10.667} height={13.333} />
                {Math.round(totalWeight * WATER_L_PER_KG)} Liter air dihemat
              </span>
            </div>
          </section>

          <section className="flex items-center gap-10 rounded-[20px] bg-green-light-active p-5 drop-shadow-[4px_4px_2px_rgba(0,234,86,0.1)]">
            <div className="flex flex-1 flex-col gap-1 font-jakarta">
              <p className="text-[12px] leading-[17px] font-bold tracking-[0.5px] text-green-dark-active uppercase">
                TIPS ECO PEKAN INI
              </p>
              <p className="text-[14px] leading-[20px] font-semibold text-ink">
                Pisahkan Botol &amp; Tutup Plastik
              </p>
              <p className="text-[12px] leading-[17px] text-[#3e4a3d]">
                Nilai jual lebih tinggi hingga 15% jika botol dipipihkan dan bersih.
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
