"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { userMessage } from "@/lib/api";
import { forgotPassword } from "./api";
import { AuthField, AuthHeading, FormMessage, primaryPillClass } from "./auth-ui";
import { fieldErrors, forgotPasswordSchema, type FieldErrors } from "./schemas";

const bottomLink =
  "inline-flex min-h-11 items-center font-inter text-[12px] font-medium text-black/70 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

export function ForgotForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function send(email: string) {
    setFormError(null);
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setSentTo(email);
    } catch (error) {
      setFormError(userMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = forgotPasswordSchema.safeParse({ email: String(data.get("email") ?? "") });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    await send(parsed.data.email);
  }

  if (sentTo) {
    return (
      <>
        <AuthHeading
          title="Cek Email Kamu"
          subtitle="Tautan pengaturan ulang sudah dikirim. Berlaku 30 menit; cek juga folder spam."
        />
        <p className="sr-only" role="status">
          Tautan dikirim ke {sentTo}
        </p>
        <div className="mt-[38px] flex w-full max-w-[300px] flex-col items-center gap-[10px]">
          <Link href="/login" className={primaryPillClass}>
            Kembali ke Login
          </Link>
          {formError ? <FormMessage>{formError}</FormMessage> : null}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => send(sentTo)}
            className={bottomLink}
          >
            {isLoading ? "Mengirim ulang…" : "Tidak menerima email? Kirim ulang"}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        title="Lupa Kata Sandi"
        subtitle="Masukkan email akunmu. Kami kirim tautan untuk mengatur ulang kata sandi."
      />
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-[38px] flex w-full max-w-[326px] flex-col"
      >
        <AuthField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          placeholder="Masukkan Alamat Email Anda"
          error={errors.email}
        />
        {formError ? (
          <div className="mt-2">
            <FormMessage>{formError}</FormMessage>
          </div>
        ) : null}
        <div className="mx-auto mt-[27px] flex w-full max-w-[300px] flex-col items-center gap-[10px]">
          <button type="submit" disabled={isLoading} className={primaryPillClass}>
            {isLoading ? "Mengirim…" : "Kirim Tautan"}
          </button>
          <Link href="/login" className={bottomLink}>
            Ingat kata sandi? Masuk
          </Link>
        </div>
      </form>
    </>
  );
}
