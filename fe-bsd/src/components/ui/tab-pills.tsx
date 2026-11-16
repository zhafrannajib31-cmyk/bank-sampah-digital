import Link from "next/link";
import { cn } from "@/lib/cn";

export interface TabPillItem {
  key: string;
  label: string;
  href: string;
  count?: number;
}

/** Tab berbasis tautan (mis. ?tab=menunggu) agar bisa dirender di server dan dibagikan. */
export function TabPills({
  items,
  activeKey,
  label = "Filter status",
}: {
  items: TabPillItem[];
  activeKey: string;
  label?: string;
}) {
  return (
    <nav aria-label={label} className="flex gap-2 overflow-x-auto">
      {items.map((item) => {
        const active = item.key === activeKey;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-[42px] shrink-0 items-center gap-2 rounded-full px-4 text-body-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              active
                ? "bg-primary text-foreground"
                : "bg-brown-light text-foreground hover:bg-brown-light-hover",
            )}
          >
            {item.label}
            {item.count !== undefined ? (
              <span className="rounded-full bg-surface/70 px-2 text-caption">{item.count}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
