"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AppNavItem {
  href: string;
  label: string;
  icon: ReactNode;
  /** Ikon varian aktif (warna hijau); jika kosong dipakai `icon`. */
  activeIcon?: ReactNode;
  /** Item aktif hanya jika rute persis sama (mis. Beranda). */
  exact?: boolean;
  /** Tombol tengah yang menonjol (mis. "+ Setor", "Scan"). */
  center?: boolean;
}

/**
 * Menu bawah mengambang (Mobile/Tablet, maks. 720 px) yang menjadi rail kiri 80 px di Desktop (>= lg).
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
      className="fixed bottom-[14px] left-1/2 z-20 w-[min(calc(100%-30px),720px)] -translate-x-1/2 rounded-[15px] border-[0.5px] border-black/20 bg-white lg:top-5 lg:bottom-5 lg:left-[14px] lg:w-[68px] lg:translate-x-0 lg:rounded-[20px] lg:border-[0.5px] lg:border-black/10 lg:shadow-sm"
    >
      <ul className="flex h-[69px] items-end justify-around lg:h-full lg:flex-col lg:items-center lg:justify-start lg:gap-4 lg:pt-6">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex flex-1 justify-center lg:w-full lg:flex-none">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[56px] min-w-[56px] flex-col items-center justify-end gap-[2px] px-1 pb-[7px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-inset"
              >
                {item.center ? (
                  <span className="-mt-6 flex size-[56px] items-center justify-center lg:mt-0 lg:size-12 [&_img]:size-full">
                    {item.icon}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex h-7 w-10 items-center justify-center rounded-full",
                      active && "bg-green-light",
                    )}
                  >
                    {active ? (item.activeIcon ?? item.icon) : item.icon}
                  </span>
                )}
                <span
                  className={cn(
                    "text-[12px] leading-[17px] tracking-[-0.275px]",
                    item.center || active
                      ? "font-semibold text-green-dark-active"
                      : "font-jakarta font-medium text-nav-idle",
                    active && !item.center && "font-sans",
                    item.center && "font-jakarta font-medium",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
