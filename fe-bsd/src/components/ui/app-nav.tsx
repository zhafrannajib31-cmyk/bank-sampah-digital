"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AppNavItem {
  href: string;
  label: string;
  icon: ReactNode;
  /** Item aktif hanya jika rute persis sama (mis. Beranda). */
  exact?: boolean;
  /** Tombol tengah yang menonjol (mis. "+ Setor", "Scan"). */
  center?: boolean;
}

/** Tambahkan ke kontainer konten agar tidak tertutup menu bawah / rail. */
export const APP_NAV_CONTENT_CLASS = "pb-24 lg:pb-0 lg:pl-20";

/**
 * Menu bawah (Mobile/Tablet, maks. 720 px) yang menjadi rail kiri 80 px di Desktop (>= lg).
 * Satu elemen <nav> agar landmark tidak ganda.
 */
export function AppNav({
  items,
  label = "Navigasi utama",
}: {
  items: AppNavItem[];
  label?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface lg:inset-y-0 lg:right-auto lg:w-20 lg:border-t-0 lg:border-r"
    >
      <ul className="mx-auto flex max-w-[720px] items-end justify-around lg:h-full lg:max-w-none lg:flex-col lg:items-center lg:justify-start lg:gap-2 lg:py-4">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1 lg:w-full lg:flex-none">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-caption font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-inset",
                  active ? "text-green-darker" : "text-muted hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full [&_svg]:size-6",
                    item.center
                      ? "-mt-5 size-12 bg-primary text-foreground shadow-md lg:mt-0"
                      : "h-8 w-12",
                    !item.center && active && "bg-primary-soft",
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
