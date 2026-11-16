import type { ReactNode } from "react";
import { APP_NAV_CONTENT_CLASS, AppNav, Asset, type AppNavItem } from "@/components/ui";

const navItems: AppNavItem[] = [
  {
    href: "/nasabah",
    label: "Beranda",
    exact: true,
    icon: <Asset src="/nasabah/nav-beranda.svg" width={13.3333} height={15} />,
    activeIcon: <Asset src="/nasabah/nav-beranda-active.svg" width={13.3333} height={15} />,
  },
  {
    href: "/nasabah/riwayat",
    label: "Riwayat",
    icon: <Asset src="/nasabah/nav-riwayat.svg" width={16.5} height={18.3333} />,
    activeIcon: <Asset src="/nasabah/nav-riwayat-active.svg" width={16.5} height={18.3333} />,
  },
  {
    href: "/nasabah/setor",
    label: "Setor",
    center: true,
    icon: <Asset src="/nasabah/nav-setor.svg" width={56} height={56} />,
  },
  {
    href: "/nasabah/saldo",
    label: "Saldo",
    icon: <Asset src="/nasabah/nav-saldo.svg" width={24} height={24} />,
    activeIcon: <Asset src="/nasabah/nav-saldo-active.svg" width={24} height={24} />,
  },
  {
    href: "/nasabah/profil",
    label: "Profil",
    icon: <Asset src="/nasabah/nav-profil.svg" width={14.6667} height={14.6667} />,
    activeIcon: <Asset src="/nasabah/nav-profil-active.svg" width={14.6667} height={14.6667} />,
  },
];

/** Layar utama nasabah (Beranda, Riwayat, Saldo, Profil): tiap layar punya header sendiri, menu bawah / rail dipakai bersama. */
export function NasabahShell({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-dvh bg-canvas font-inter ${APP_NAV_CONTENT_CLASS}`}>
      {children}
      <AppNav items={navItems} />
    </div>
  );
}
