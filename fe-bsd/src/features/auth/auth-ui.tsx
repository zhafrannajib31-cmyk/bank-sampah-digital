"use client";

import Image from "next/image";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Asset } from "@/components/ui/asset";

/** Latar gradien hijau -> putih dengan kolom konten di tengah (Figma: Login, Register, Lupa Kata Sandi). */
export function AuthScreen({ children, logoTop = 85 }: { children: ReactNode; logoTop?: number }) {
  return (
    <div className="min-h-dvh bg-linear-[201deg] from-primary from-22% to-surface lg:bg-linear-[187deg]">
      <main
        className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-10"
        style={{ paddingTop: logoTop }}
      >
        <AuthLogo />
        {children}
      </main>
    </div>
  );
}

/** Logo 100 px; SVG-nya lebih lebar 8% karena bayangan, jadi dibiarkan meluber seperti di Figma. */
export function AuthLogo({ src = "/auth/logo-bsd.svg" }: { src?: string }) {
  return (
    <div className="relative h-[100.786px] w-[100px] shrink-0">
      <Image
        src={src}
        width={108}
        height={108.786}
        alt="Bank Sampah Digital"
        priority
        unoptimized
        className="absolute top-0 left-0 max-w-none"
      />
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-[14px] flex w-[236px] flex-col items-center gap-[2px] text-center">
      <h1 className="font-inter text-[20px] leading-[30px] font-semibold text-black">{title}</h1>
      <p className="font-inter text-[12px] leading-[15px] text-black/70">{subtitle}</p>
    </div>
  );
}

export function AuthCaption({ children }: { children: ReactNode }) {
  return (
    <p className="font-inter text-[12px] leading-[15px] font-bold text-black/70">{children}</p>
  );
}

export function FormMessage({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="font-inter text-[12px] leading-[17px] font-medium text-danger"
    >
      {children}
    </p>
  );
}

export function AuthLink({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "inline-flex min-h-11 items-center font-inter text-[12px] font-medium text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export const primaryPillClass =
  "flex h-[45px] w-full items-center justify-center rounded-full bg-primary font-sans text-[14px] font-bold text-foreground shadow-[0_4px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

/** Tombol Google sesuai desain. Belum ada login Google di MVP, jadi dinonaktifkan. */
export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} (belum tersedia)`}
      title="Belum tersedia"
      className="flex h-[45px] w-full items-center justify-center gap-3 rounded-full bg-white font-inter text-[12px] text-black shadow-[0_4px_2px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed"
    >
      <Asset src="/auth/icon-google.svg" width={18} height={18} />
      {label}
    </button>
  );
}

export function OrDivider({ label = "atau" }: { label?: string }) {
  return (
    <div className="flex w-full items-center gap-2" role="separator">
      <span className="h-px flex-1 bg-black/20" />
      <span className="font-inter text-[12px] leading-[20px] font-medium text-black/70">
        {label}
      </span>
      <span className="h-px flex-1 bg-black/20" />
    </div>
  );
}

export interface AuthFieldProps extends Omit<ComponentProps<"input">, "className"> {
  label: string;
  error?: string;
  /** Ikon di kiri kolom (path di public/). */
  icon?: { src: string; width: number; height: number };
  /** Teks tetap sebelum isian, mis. "+62". */
  prefixText?: string;
  /** Kolom kata sandi: tombol tampil/sembunyi dengan ikon mata dari Figma. */
  revealable?: boolean;
  className?: string;
}

export function AuthField({
  label,
  error,
  icon,
  prefixText,
  revealable,
  id,
  name,
  type = "text",
  className,
  ...props
}: AuthFieldProps) {
  const autoId = useId();
  const inputId = id ?? name ?? autoId;
  const errorId = `${inputId}-error`;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={cn("flex flex-col gap-[3px]", className ?? "w-full")}>
      <label htmlFor={inputId} className="font-inter text-[12px] leading-[15px] text-black/70">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <Asset
            src={icon.src}
            width={icon.width}
            height={icon.height}
            className="pointer-events-none absolute top-1/2 left-[15px] -translate-y-1/2"
          />
        ) : null}
        {prefixText ? (
          <span className="pointer-events-none absolute top-1/2 left-[37px] -translate-y-1/2 font-inter text-[12px] text-black">
            {prefixText}
          </span>
        ) : null}
        <input
          id={inputId}
          name={name}
          type={revealable && revealed ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-[45px] w-full rounded-[15px] border-[0.5px] bg-white font-inter text-[12px] text-black placeholder:text-black/70 focus:ring-2 focus:outline-none",
            error
              ? "border-danger focus:ring-danger/30"
              : "border-black/20 focus:border-accent focus:ring-accent/30",
            icon ? "pl-[37px]" : "pl-[15px]",
            prefixText && "pl-[68px]",
            revealable ? "pr-[48px]" : "pr-[15px]",
          )}
          {...props}
        />
        {revealable ? (
          <button
            type="button"
            aria-label={revealed ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            aria-pressed={revealed}
            onClick={() => setRevealed((value) => !value)}
            className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <Asset
              src="/auth/icon-eye-closed.svg"
              width={20}
              height={20}
              className={revealed ? "opacity-40" : undefined}
            />
          </button>
        ) : null}
      </div>
      {error ? <FormMessage id={errorId}>{error}</FormMessage> : null}
    </div>
  );
}
