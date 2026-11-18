"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { API_BASE_URL, userMessage } from "@/lib/api";
import { postLoginPath } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { login } from "./api";
import { Asset } from "@/components/ui/asset";
import {
  AuthCaption,
  AuthField,
  AuthHeading,
  FormMessage,
  GoogleButton,
  OrDivider,
  primaryPillClass,
} from "./auth-ui";
import { MOCK_ACCOUNTS } from "./mock-auth";
import { fieldErrors, loginSchema, type FieldErrors } from "./schemas";

type Persona = "nasabah" | "petugas";

const personas: { id: Persona; label: string; icon: { src: string; w: number; h: number } }[] = [
  {
    id: "nasabah",
    label: "Nasabah / Warga",
    icon: { src: "/auth/icon-nasabah.svg", w: 13.3333, h: 13.3333 },
  },
  {
    id: "petugas",
    label: "Petugas Lapangan",
    icon: { src: "/auth/icon-petugas.svg", w: 18.3333, h: 13.3333 },
  },
];

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? undefined;
  const [persona, setPersona] = useState<Persona>("nasabah");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    setFormError(null);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const { user } = await login(parsed.data);
      router.replace(postLoginPath(next, user.role));
    } catch (error) {
      setFormError(userMessage(error));
      setIsLoading(false);
    }
  }

  const demo = MOCK_ACCOUNTS.find((item) => item.role === persona);

  return (
    <>
      <AuthHeading
        title="Selamat Datang"
        subtitle="Masuk untuk mulai mengelola sampahmu dan kumpulkan saldo rupiah."
      />

      <div className="mt-[22px]">
        <AuthCaption>Masuk Sebagai</AuthCaption>
      </div>
      <div
        role="group"
        aria-label="Masuk sebagai"
        suppressHydrationWarning
        className="mt-[13px] flex h-[50px] w-[350px] max-w-full items-center gap-[18px] px-[9px] py-[6px]"
      >
        {personas.map((item) => {
          const selected = persona === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setPersona(item.id)}
              className={cn(
                "flex h-[44px] items-center gap-[7px] rounded-full font-jakarta text-[12px] whitespace-nowrap text-green-dark-active focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                selected
                  ? "min-w-[160px] border border-primary bg-white pr-6 pl-4 font-bold shadow-[0_4px_2px_rgba(0,0,0,0.1)]"
                  : "px-2 font-semibold",
              )}
            >
              <Asset src={item.icon.src} width={item.icon.w} height={item.icon.h} />
              {item.label}
            </button>
          );
        })}
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-[22px] flex w-full max-w-[326px] flex-col"
      >
        <div className="flex flex-col gap-[13px]">
          <AuthField
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            inputMode="email"
            placeholder="Masukkan Alamat Email Anda"
            error={errors.email}
          />
          <AuthField
            name="password"
            type="password"
            label="Kata Sandi"
            autoComplete="current-password"
            placeholder="Masukkan Kata Sandi Anda"
            revealable
            error={errors.password}
          />
        </div>

        <div className="-mt-[5px] flex min-h-11 items-center justify-between gap-3">
          <div aria-live="polite">{formError ? <FormMessage>{formError}</FormMessage> : null}</div>
          <Link
            href="/lupa-password"
            className="inline-flex min-h-11 shrink-0 items-center font-inter text-[12px] font-medium text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Lupa Kata Sandi?
          </Link>
        </div>

        <div className="mx-auto mt-[13px] flex w-full max-w-[300px] flex-col gap-[15px]">
          <button type="submit" disabled={isLoading} className={primaryPillClass}>
            {isLoading ? "Memproses…" : "Masuk"}
          </button>
          <OrDivider />
          <GoogleButton label="Masuk dengan Google" />
        </div>
      </form>

      <p className="mt-[17px] font-inter text-[12px] leading-[20px] font-medium text-black/70">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Daftar Sekarang
        </Link>
      </p>

      {!API_BASE_URL && demo ? (
        <p className="mt-2 max-w-[326px] rounded-[15px] bg-white/70 px-3 py-2 text-center font-inter text-[12px] text-black/70">
          Mode simulasi (data contoh). Akun {persona}: {demo.email} / {demo.password}
        </p>
      ) : null}
    </>
  );
}
