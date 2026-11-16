"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { userMessage } from "@/lib/api";
import { postLoginPath } from "@/lib/auth";
import { register } from "./api";
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
import { fieldErrors, passwordStrength, registerSchema, type FieldErrors } from "./schemas";

export function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const strength = passwordStrength(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
      acceptedTerms: data.get("acceptedTerms") === "on",
    });

    setFormError(null);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const { name, email, whatsapp, password } = parsed.data;
      const { role } = await register({ name, email, whatsapp, password });
      router.replace(postLoginPath(undefined, role));
    } catch (error) {
      setFormError(userMessage(error));
      setIsLoading(false);
    }
  }

  return (
    <>
      <AuthHeading
        title="Buat Akun"
        subtitle="Buat akun untuk mulai mengelola sampahmu dan kumpulkan saldo rupiah."
      />

      <div className="mt-[22px]">
        <AuthCaption>Daftar Sebagai</AuthCaption>
      </div>
      <div className="mt-[13px] flex h-[50px] w-[350px] max-w-full items-center px-[9px] py-[6px]">
        <span className="flex h-[38px] min-w-[160px] items-center gap-[7px] rounded-full border border-primary bg-white pr-6 pl-4 font-jakarta text-[12px] font-bold whitespace-nowrap text-green-dark-active shadow-[0_4px_2px_rgba(0,0,0,0.1)]">
          <Asset src="/auth/icon-nasabah.svg" width={13.3333} height={13.3333} />
          Nasabah / Warga
        </span>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-[17px] flex w-full max-w-[326px] flex-col"
      >
        <div className="flex flex-col gap-2">
          <AuthField
            name="name"
            label="Nama Lengkap"
            autoComplete="name"
            placeholder="Nama sesuai identitas / KTP"
            icon={{ src: "/auth/field-person.svg", width: 13.3333, height: 13.3333 }}
            error={errors.name}
          />
          <AuthField
            name="email"
            type="email"
            label="Alamat Email"
            autoComplete="email"
            inputMode="email"
            placeholder="contoh@gmail.com"
            icon={{ src: "/auth/field-mail.svg", width: 16.6667, height: 13.3333 }}
            error={errors.email}
          />

          <div className="flex items-end gap-3">
            <AuthField
              name="whatsapp"
              type="tel"
              label="Nomor WhatsApp / HP"
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="812 3456 7890"
              prefixText="+62"
              icon={{ src: "/auth/field-phone.svg", width: 12.5, height: 18.3333 }}
              error={errors.whatsapp}
              className="w-[170px] shrink-0"
            />
            <p className="-mr-3 w-[156px] pb-[6px] font-inter text-[12px] leading-[17px] text-green-dark italic">
              Digunakan untuk konfirmasi setoran &amp; bukti timbangan digital
            </p>
          </div>

          <div className="flex flex-col gap-[10px]">
            <AuthField
              name="password"
              type="password"
              label="Kata Sandi"
              autoComplete="new-password"
              placeholder="Minimal 8 Karakter"
              icon={{ src: "/auth/field-lock.svg", width: 13.3333, height: 17.5 }}
              revealable
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
            />
            {strength.level > 0 ? (
              <div aria-live="polite" className="flex flex-col gap-[7px]">
                <div className="flex gap-[3px]" aria-hidden>
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={`h-[6px] flex-1 rounded-full ${
                        strength.level >= step
                          ? step === 4
                            ? "bg-green-dark-hover"
                            : "bg-primary"
                          : "bg-black/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-sans text-[12px] leading-[17px] font-medium text-green-dark-hover">
                  Kekuatan: {strength.label}
                </span>
              </div>
            ) : null}
          </div>

          <AuthField
            name="confirmPassword"
            type="password"
            label="Konfirmasi Kata Sandi"
            autoComplete="new-password"
            placeholder="Ulangi Kata Sandi"
            icon={{ src: "/auth/field-lock-reset.svg", width: 16.6667, height: 16.6667 }}
            revealable
            error={errors.confirmPassword}
          />
        </div>

        <div className="mt-[10px] flex flex-col gap-1">
          <label className="flex min-h-11 items-start gap-3 py-2 font-inter text-[12px] leading-[17px] text-black/70">
            <input
              type="checkbox"
              name="acceptedTerms"
              aria-invalid={errors.acceptedTerms ? true : undefined}
              aria-describedby={errors.acceptedTerms ? "terms-error" : undefined}
              className="mt-px size-5 shrink-0 accent-green-dark"
            />
            <span>
              Saya menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi Bank Sampah Digital.
            </span>
          </label>
          {errors.acceptedTerms ? (
            <FormMessage id="terms-error">{errors.acceptedTerms}</FormMessage>
          ) : null}
        </div>

        {formError ? (
          <div className="mt-2" aria-live="polite">
            <FormMessage>{formError}</FormMessage>
          </div>
        ) : null}

        <div className="mx-auto mt-[17px] flex w-full max-w-[300px] flex-col gap-[15px]">
          <button type="submit" disabled={isLoading} className={primaryPillClass}>
            {isLoading ? "Mendaftarkan…" : "Daftar"}
          </button>
          <OrDivider label="ATAU DAFTAR DENGAN" />
          <GoogleButton label="Lanjutkan dengan Google" />
        </div>
      </form>

      <p className="mt-[17px] font-inter text-[12px] leading-[20px] font-medium text-black/70">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Masuk
        </Link>
      </p>
    </>
  );
}
