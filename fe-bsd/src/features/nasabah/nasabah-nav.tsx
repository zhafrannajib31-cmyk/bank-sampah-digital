"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import { HistoryIcon, HomeIcon, SetorIcon, UserIcon, WalletIcon } from "./icons";

const navItems = [
  { href: "/nasabah", label: "Beranda", icon: HomeIcon },
  { href: "/nasabah/setor", label: "Setor", icon: SetorIcon },
  { href: "/nasabah/riwayat", label: "Riwayat", icon: HistoryIcon },
  { href: "/nasabah/saldo", label: "Saldo", icon: WalletIcon },
  { href: "/nasabah/profil", label: "Profil", icon: UserIcon },
];

export function NasabahNav() {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-5">
      {navItems.map((item) => {
        const active =
          item.href === "/nasabah" ? pathname === "/nasabah" : pathname.startsWith(item.href);

        return (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={active}
          />
        );
      })}
    </div>
  );
}

export function NasabahNavFallback() {
  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-5">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={false}
        />
      ))}
    </div>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactElement;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 px-1 py-2.5 text-caption font-semibold transition-colors",
        active ? "text-green-darker" : "text-muted hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          active && "bg-primary-soft",
        )}
      >
        <Icon className="size-5" />
      </span>
      {label}
    </Link>
  );
}
