"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Asset, ErrorState } from "@/components/ui";
import { formatDistance, formatRupiah } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { cn } from "@/lib/cn";

const steps = [
  "Pilah sampah sesuai jenisnya, pastikan bersih dan kering.",
  "Ajukan setoran di aplikasi, lalu antar sendiri ke unit.",
  "Petugas menimbang, nilai final muncul setelah dikonfirmasi.",
];

export default function DetailUnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const { units, categoriesForUnit } = usePrototype();
  const unit = units.find((candidate) => candidate.id === unitId);

  if (!unit) {
    return (
      <div className="mx-auto w-full max-w-[430px] flex-1 bg-surface p-5">
        <Link href="/nasabah/setor" className="text-[14px] font-semibold text-blue-dark">
          ← Kembali ke daftar unit
        </Link>
        <div className="mt-4">
          <ErrorState
            title="Unit tidak ditemukan"
            description="Unit yang Anda pilih tidak tersedia. Kembali dan pilih unit lain."
          />
        </div>
      </div>
    );
  }

  const prices = categoriesForUnit(unit.id);
  const phoneHref = `tel:${unit.phone.replace(/[^\d+]/g, "")}`;
  const infoRows = [
    { icon: "/nasabah/detail-map-pin.svg", label: "Alamat", value: `${unit.address}, Jawa Barat` },
    { icon: "/nasabah/detail-clock.svg", label: "Jam operasional", value: unit.hours },
    { icon: "/nasabah/detail-phone.svg", label: "Kontak", value: `${unit.phone} (WhatsApp)` },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col bg-canvas shadow-sm">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[200px] bg-linear-to-r from-teal-start to-teal-end" />
        <div className="relative px-5 pt-12">
          <Link
            href="/nasabah/setor"
            aria-label="Kembali"
            className="flex size-11 items-center justify-center rounded-[14px] bg-[#f0fcf6] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Asset src="/nasabah/icon-chevron-left.svg" width={21} height={21} />
          </Link>

          <section
            aria-label="Informasi unit"
            className="mt-11 flex flex-col gap-[14px] rounded-[22px] bg-white p-[18px] shadow-[0_12px_25px_rgba(24,60,36,0.06)]"
          >
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-[19px] leading-[26px] font-bold text-heading">{unit.name}</h1>
                <span
                  className={cn(
                    "flex h-[26px] shrink-0 items-center rounded-full px-3 text-[12px] font-semibold",
                    unit.isOpen ? "bg-[#ddf8e6] text-[#007d32]" : "bg-closed-bg text-closed-text",
                  )}
                >
                  {unit.isOpen ? "Buka" : "Tutup"}
                </span>
              </div>
              <p className="text-[12px] leading-[17px] text-subtle">
                Bank Sampah Unit
                {unit.distanceKm !== undefined
                  ? ` · ${formatDistance(unit.distanceKm)} dari kamu`
                  : null}
              </p>
            </div>
            <ul className="flex flex-col gap-[14px]">
              {infoRows.map((row) => (
                <li key={row.label} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-tile-bg">
                    <Asset src={row.icon} width={17} height={17} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-[2px] text-[13px]">
                    <span className="leading-[18px] font-semibold text-heading">{row.label}</span>
                    <span className="leading-[19px] text-subtle">{row.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="harga" className="flex flex-col gap-2 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 id="harga" className="text-[15px] leading-[20px] font-bold text-heading">
            Jenis &amp; Harga Sampah
          </h2>
          <p className="text-[12px] text-subtle">Harga aktif unit ini</p>
        </div>
        <ul className="overflow-hidden rounded-[18px] border border-line bg-white text-[13px] text-heading">
          {prices.map((category) => (
            <li
              key={category.id}
              className="flex h-[43.5px] items-center justify-between border-b-[0.5px] border-line px-4 last:border-b-0"
            >
              <span className="font-medium">{category.name}</span>
              <span className="font-semibold">
                {category.pricePerKg === null ? (
                  "Sesuai jenis"
                ) : (
                  <>
                    {formatRupiah(category.pricePerKg)}
                    <span className="font-medium text-subtle">/kg</span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] leading-[18px] text-subtle">
          Harga dapat berubah oleh admin. Nilai transaksi mengikuti harga saat petugas menimbang.
          Harga contoh (simulasi).
        </p>
      </section>

      <section className="px-5 pt-5 pb-5">
        <div className="flex flex-col gap-[10px] rounded-[18px] bg-info-bg p-4 leading-[20px]">
          <h2 className="text-[14px] font-bold text-info-title">Cara menyetor ke unit ini</h2>
          <ol className="flex flex-col text-[12px] text-info-body">
            {steps.map((text, index) => (
              <li key={text} className="flex gap-[3px]">
                <span className="w-[15px] shrink-0 text-right">{index + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="sticky bottom-0 mt-auto flex items-center gap-[10px] border-t-[0.5px] border-line bg-white px-5 pt-[14px] pb-[21px]">
        <a
          href={phoneHref}
          aria-label={`Hubungi ${unit.name}`}
          className="flex h-[53px] w-[52px] shrink-0 items-center justify-center rounded-full border border-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Asset src="/nasabah/action-phone.svg" width={19} height={19} />
        </a>
        {unit.isOpen ? (
          <Link
            href={`/nasabah/setor/${unit.id}/jenis`}
            className="flex h-[53px] min-w-0 flex-1 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-foreground shadow-[0_7px_14px_rgba(0,200,75,0.19)] hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Setor ke Unit Ini
          </Link>
        ) : (
          <p className="flex-1 text-center text-[12px] text-subtle">
            Unit sedang tutup. Pilih unit lain atau kembali saat unit buka.
          </p>
        )}
      </div>
    </div>
  );
}
