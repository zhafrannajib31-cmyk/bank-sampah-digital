"use client";

import Link from "next/link";
import { useState } from "react";
import { Asset } from "@/components/ui";
import { LogoutButton } from "@/features/auth/logout-button";
import { formatMonthShortYear, formatRupiah } from "@/features/nasabah/format";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { cn } from "@/lib/cn";

/** Inisial dari kata pertama dan terakhir nama. */
const initials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  return [parts[0], parts.length > 1 ? parts[parts.length - 1] : ""]
    .map((part) => part?.[0]?.toUpperCase() ?? "")
    .join("");
};

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

function IconBox({ bg, src, size }: { bg: string; src: string; size: number }) {
  return (
    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-[12px]", bg)}>
      <Asset src={src} width={size} height={size} />
    </span>
  );
}

export default function ProfilPage() {
  const { deposits, profile } = usePrototype();
  const [notify, setNotify] = useState(true);
  const balance = deposits
    .filter((deposit) => deposit.status === "selesai")
    .reduce((sum, deposit) => sum + (deposit.finalTotal ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-[720px]">
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
            {initials(profile.name)}
          </p>
        </div>
        <p className="absolute top-[199px] w-full text-center text-[18px] leading-[22px] font-bold text-heading">
          {profile.name}
        </p>
        <p className="absolute top-[224px] w-full text-center text-[12px] leading-[16px] text-[#4d6257]">
          Nasabah · bergabung {formatMonthShortYear(profile.memberSince)}
        </p>
      </header>

      <div className="flex flex-col gap-[14px] px-5 pt-4">
        <section aria-label="Data diri" className="rounded-[18px] border border-[#e3ece6] bg-white">
          <div className="flex h-[38px] items-center justify-between px-4 pt-2">
            <h2 className="text-[14px] font-bold text-heading">Data Diri</h2>
            <span
              className="text-[12px] font-semibold text-green-dark-active underline opacity-60"
              title="Ubah data belum tersedia"
            >
              Ubah
            </span>
          </div>
          {[
            ["Email", profile.email],
            ["WhatsApp", profile.phone],
            ["Unit favorit", "BSU Sukamaju Hijau"],
          ].map(([label, value], index, rows) => (
            <div
              key={label}
              className={cn(
                "flex h-9 items-center justify-between px-4 text-[12px]",
                index < rows.length - 1 && "border-b border-[#eff3f0]",
              )}
            >
              <span className="text-[#6c7d74]">{label}</span>
              <span className="font-semibold text-heading">{value}</span>
            </div>
          ))}
        </section>

        <section
          aria-label="Pengaturan akun"
          className="overflow-hidden rounded-[18px] border border-[#e3ece6] bg-white"
        >
          <Link
            href="/nasabah/saldo"
            className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Row>
              <IconBox bg="bg-[#ddf9e7]" src="/nasabah/profil-wallet.svg" size={16} />
              <span className="flex flex-1 flex-col gap-px leading-[17px]">
                <span className="text-[13px] font-semibold text-heading">Saldo Setoran</span>
                <span className="text-[12px] text-[#52685b]">
                  {formatRupiah(balance)} · catatan nilai
                </span>
              </span>
              <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />
            </Row>
          </Link>
          <Row>
            <IconBox bg="bg-[#e0f0ff]" src="/nasabah/profil-lock.svg" size={16} />
            <span className="flex-1 text-[13px] font-semibold text-heading">Ubah Kata Sandi</span>
            <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />
          </Row>
          <Row>
            <IconBox bg="bg-wait-bg" src="/nasabah/profil-bell.svg" size={16} />
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
            <IconBox bg="bg-[#f0e9fc]" src="/nasabah/profil-help.svg" size={16} />
            <span className="flex-1 text-[13px] font-semibold text-heading">
              Bantuan &amp; Cara Memilah
            </span>
            <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />
          </Row>
        </section>

        <LogoutButton variant="profile" />
        <p className="pb-2 text-center text-[12px] font-bold text-black/50">
          Data contoh (simulasi)
        </p>
      </div>
    </div>
  );
}
