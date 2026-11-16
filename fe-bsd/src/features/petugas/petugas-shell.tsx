import { Suspense, type ReactNode } from "react";
import { APP_NAV_CONTENT_CLASS, AppNav, Asset, type AppNavItem } from "@/components/ui";

const navItems: AppNavItem[] = [
  {
    href: "/petugas",
    label: "Beranda",
    exact: true,
    icon: <Asset src="/nasabah/nav-beranda.svg" width={13.3333} height={15} />,
    activeIcon: <Asset src="/nasabah/nav-beranda-active.svg" width={13.3333} height={15} />,
  },
  {
    href: "/petugas/antrean",
    label: "Antrean",
    icon: <Asset src="/petugas/nav-antrean.svg" width={19.275} height={19.25} />,
    activeIcon: <Asset src="/petugas/nav-antrean-active.svg" width={19.275} height={19.25} />,
  },
  {
    href: "/petugas/scan",
    label: "Scan",
    center: true,
    icon: <Asset src="/petugas/nav-scan.svg" width={56} height={56} />,
  },
  {
    href: "/petugas/riwayat",
    label: "Riwayat",
    icon: <Asset src="/nasabah/nav-riwayat.svg" width={16.5} height={18.3333} />,
    activeIcon: <Asset src="/nasabah/nav-riwayat-active.svg" width={16.5} height={18.3333} />,
  },
  {
    href: "/petugas/profil",
    label: "Profil",
    icon: <Asset src="/nasabah/nav-profil.svg" width={14.6667} height={14.6667} />,
    activeIcon: <Asset src="/nasabah/nav-profil-active.svg" width={14.6667} height={14.6667} />,
  },
];

/** Layar utama petugas: tiap layar punya header sendiri; menu bawah / rail dipakai bersama. */
export function PetugasShell({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-dvh bg-canvas font-inter ${APP_NAV_CONTENT_CLASS}`}>
      {/* Suspense: halaman Antrean membaca ?tab= dari URL. */}
      <Suspense>{children}</Suspense>
      <AppNav items={navItems} />
    </div>
  );
}
