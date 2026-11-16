"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Asset, EmptyState, StepHeader } from "@/components/ui";
import { statusMeta } from "@/features/nasabah/deposit-ui";
import { formatClock, formatDayMonth } from "@/features/nasabah/format";
import {
  isNewerThan,
  markNotificationsRead,
  useNotifications,
} from "@/features/nasabah/notifications";
import { StepScreen } from "@/features/nasabah/step-screen";
import { cn } from "@/lib/cn";

export default function NotifikasiPage() {
  const { items, lastRead, latestAt } = useNotifications();
  // Penanda baca saat halaman dibuka: yang baru tetap disorot selama halaman terbuka.
  const [baseline, setBaseline] = useState<string | null>(null);
  if (baseline === null && lastRead !== null) setBaseline(lastRead);

  // Tandai terbaca hanya setelah penanda awal terekam, agar sorotan "baru" tidak ikut hilang.
  useEffect(() => {
    if (baseline !== null) markNotificationsRead(latestAt);
  }, [baseline, latestAt]);

  return (
    <StepScreen>
      <StepHeader title="Notifikasi" subtitle="Perubahan status setoranmu" backHref="/nasabah" />
      {items.length === 0 ? (
        <EmptyState
          title="Belum ada notifikasi"
          description="Perubahan status setoran akan muncul di sini."
        />
      ) : (
        <ul className="flex flex-col gap-[10px]">
          {items.map((item) => {
            const unread = isNewerThan(item, baseline);
            return (
              <li key={item.id}>
                <Link
                  href={`/nasabah/setoran/${item.depositId}`}
                  className={cn(
                    "flex items-center gap-3 rounded-[16px] border px-[15px] py-[12px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    unread ? "border-primary bg-[#f0fcf6]" : "border-line bg-white",
                  )}
                >
                  <Asset
                    src={statusMeta[item.status].symbol}
                    width={44}
                    height={44}
                    className="shrink-0"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="flex items-center gap-2 text-[14px] leading-[18px] font-semibold text-heading">
                      {item.title}
                      {unread ? <span className="sr-only">(baru)</span> : null}
                    </span>
                    <span className="text-[12px] leading-[17px] text-subtle">{item.body}</span>
                    <span className="text-[12px] leading-[17px] text-subtle">
                      {formatDayMonth(item.at)} · {formatClock(item.at)}
                    </span>
                  </span>
                  {unread ? (
                    <span aria-hidden className="size-[10px] shrink-0 rounded-full bg-[#dc2626]" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="pb-4 text-center text-[12px] font-bold text-black/50">Data contoh (simulasi)</p>
    </StepScreen>
  );
}
