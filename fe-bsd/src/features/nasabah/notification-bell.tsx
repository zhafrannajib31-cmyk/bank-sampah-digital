"use client";

import Link from "next/link";
import { Asset } from "@/components/ui";
import { useNotifications } from "./notifications";

/** Lonceng + avatar dari Figma; area lonceng menjadi tautan ke Notifikasi dengan penanda belum dibaca. */
export function NotificationBell() {
  const { unreadCount } = useNotifications();
  return (
    <div className="relative h-8 w-[63.6667px]">
      <Asset src="/nasabah/home-bell-avatar.svg" width={63.6667} height={32} />
      <Link
        href="/nasabah/notifikasi"
        aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"}
        className="absolute -top-[6px] -left-[6px] h-11 w-[38px] rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      />
      {unreadCount > 0 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-[17px] size-[10px] rounded-full border border-white bg-[#dc2626]"
        />
      ) : null}
    </div>
  );
}
