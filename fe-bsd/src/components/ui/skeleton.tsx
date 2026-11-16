import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Placeholder loading untuk daftar dan detail. Atur ukuran lewat className. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-brown-light", className)}
      {...props}
    />
  );
}
