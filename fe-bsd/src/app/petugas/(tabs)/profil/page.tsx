"use client";

import Link from "next/link";
import { useState } from "react";
import { Asset } from "@/components/ui";
import { LogoutButton } from "@/features/auth/logout-button";
import { dayKey } from "@/features/nasabah/format";
import { OFFICER_NAME, OFFICER_UNIT, PETUGAS_TODAY } from "@/features/petugas/mock-data";
import { usePetugasDeposits } from "@/features/petugas/store";
import { cn } from "@/lib/cn";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

function Row({ children, bordered = true }: { children: React.ReactNode; bordered?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-[65px] items-center gap-3 px-4",
        bordered && "border-b border-[#eff3f0]",
      )}
    >
      {children}
    </div>
  );
}

function IconBox({ bg, src }: { bg: string; src: string }) {
  return (
    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-[12px]", bg)}>
      <Asset src={src} width={16} height={16} />
    </span>
  );
}

export default function ProfilPetugasPage() {
  const deposits = usePetugasDeposits();
  const [notify, setNotify] = useState(true);
  const doneToday = deposits.filter(
    (deposit) =>
      deposit.status === "selesai" &&
      dayKey(deposit.completedAt ?? deposit.submittedAt) === PETUGAS_TODAY,
  ).length;

  return (
    <div className="mx-auto w-full max-w-[430px]">
      <header className="relative h-[262px] overflow-hidden bg-linear-to-b from-[#b9f7d2] to-[#e5fbee]">
        <h1 className="absolute top-[50px] left-5 text-[23px] leading-[28px] font-bold text-heading">
          Profil
        </h1>
        <div className="absolute top-[94px] left-1/2 size-[92px] -translate-x-1/2">
          <Asset
            src="/nasabah/profil-avatar.svg"
            width={128}
            height={128}
            className="absolute -top-[9px] -left-[18px] max-w-none"
          />
          <p className="absolute inset-0 flex items-center justify-center text-[32px] font-bold text-white">
            {initials(OFFICER_NAME)}
          </p>
        </div>
        <p className="absolute top-[199px] w-full text-center text-[18px] leading-[22px] font-bold text-heading">
          {OFFICER_NAME}
        </p>
        <p className="absolute top-[224px] w-full text-center text-[12px] leading-[16px] text-[#4d6257]">
          Petugas · {OFFICER_UNIT}
        </p>
      </header>

      <div className="flex flex-col gap-[14px] px-5 pt-4">
        <section aria-label="Data diri" className="rounded-[18px] border border-[#e3ece6] bg-white">
          <div className="flex h-[38px] items-center justify-between px-4 pt-2">
            <h2 className="text-[14px] font-bold text-heading">Data Diri</h2>
            {/* Data petugas dikelola admin (aturan 6); tidak ada tindakan "Ubah" di sini. */}
          </div>
          {[
            ["Email", "andi@bsd.id"],
            ["WhatsApp", "+62 811 2233 4455"],
            ["Unit bertugas", "BSU Sukamaju Hijau"],
          ].map(([label, value], index, rows) => (
            <div
              key={label}
              className={cn(
                "flex h-9 items-center justify-between px-4 text-[12px]",
                index < rows.length - 1 && "border-b border-[#eff3f0]",
              )}
            >
              <span className="text-[#5f6e66]">{label}</span>
              <span className="font-semibold text-heading">{value}</span>
            </div>
          ))}
        </section>

        <section
          aria-label="Pengaturan akun"
          className="overflow-hidden rounded-[18px] border border-[#e3ece6] bg-white"
        >
          <Link
            href="/petugas/riwayat"
            className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Row>
              <IconBox bg="bg-[#ddf9e7]" src="/nasabah/profil-wallet.svg" />
              <span className="flex flex-1 flex-col gap-px leading-[17px]">
                <span className="text-[13px] font-semibold text-heading">Riwayat Unit</span>
                <span className="text-[12px] text-[#52685b]">
                  {doneToday} transaksi selesai hari ini
                </span>
              </span>
              <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />
            </Row>
          </Link>
          <Row>
            <IconBox bg="bg-[#e0f0ff]" src="/nasabah/profil-lock.svg" />
            <span className="flex-1 text-[13px] font-semibold text-heading">Ubah Kata Sandi</span>
            <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />
          </Row>
          <Row>
            <IconBox bg="bg-wait-bg" src="/nasabah/profil-bell.svg" />
            <span className="flex-1 text-[13px] font-semibold text-heading">Notifikasi Status</span>
            <button
              type="button"
              role="switch"
              aria-checked={notify}
              aria-label="Notifikasi status"
              onClick={() => setNotify((value) => !value)}
              className="flex h-11 w-[52px] items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              {notify ? (
                <Asset src="/nasabah/profil-toggle-on.svg" width={44} height={26} />
              ) : (
                <span className="relative block h-[26px] w-11 rounded-full bg-black/20">
                  <span className="absolute top-[3px] left-[3px] size-5 rounded-full bg-white" />
                </span>
              )}
            </button>
          </Row>
          <Row bordered={false}>
            <IconBox bg="bg-[#f0e9fc]" src="/nasabah/profil-help.svg" />
            <span className="flex-1 text-[13px] font-semibold text-heading">
              Bantuan &amp; Cara Memilah
            </span>
            <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />
          </Row>
        </section>

        <LogoutButton variant="profile" />
        <p className="pb-2 text-center text-[12px] font-bold text-black/60">
          Data contoh (simulasi)
        </p>
      </div>
    </div>
  );
}
