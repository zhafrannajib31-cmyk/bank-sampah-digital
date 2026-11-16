import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Asset } from "@/components/ui";
import { cn } from "@/lib/cn";

/** Kolom layar langkah: maks. 430 px di tengah pada Tablet/Desktop, penuh pada Mobile. */
export function StepScreen({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[430px] flex-1 flex-col gap-4 bg-surface px-4 pt-4 shadow-sm",
        wide && "md:max-w-[720px] lg:max-w-[1100px]",
      )}
    >
      {children}
    </div>
  );
}

const nextClass =
  "flex h-[50px] w-full items-center justify-center gap-1 rounded-[10px] bg-primary font-sans text-[14px] font-bold text-foreground transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

/** Tombol "Lanjut →" gaya Figma (sudut 10, bukan pil). Tautan bila diberi href. */
export function StepNext({
  href,
  children = "Lanjut",
  arrow = true,
  className,
  ...props
}: { href?: string; arrow?: boolean } & Omit<ComponentProps<"button">, "className"> & {
    className?: string;
  }) {
  const content = (
    <>
      {children}
      {arrow ? (
        <Asset src="/onboarding/icon-arrow-dark.svg" width={13.3333} height={13.3333} />
      ) : null}
    </>
  );

  return href ? (
    <Link href={href} className={cn(nextClass, className)}>
      {content}
    </Link>
  ) : (
    <button type="button" className={cn(nextClass, className)} {...props}>
      {content}
    </button>
  );
}
