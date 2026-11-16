"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import { userMessage } from "@/lib/api";
import { postLoginPath } from "@/lib/auth";
import { register } from "./api";
import { FormAlert } from "./auth-card";
import { fieldErrors, passwordStrength, registerSchema, type FieldErrors } from "./schemas";

const strengthBar = ["bg-brown-light", "bg-danger", "bg-brown-normal", "bg-green-dark"];

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
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <Input
        name="name"
        label="Nama lengkap"
        autoComplete="name"
        placeholder="Nama sesuai identitas"
        error={errors.name}
        required
      />
      <Input
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        inputMode="email"
        placeholder="nama@email.com"
        error={errors.email}
        required
      />
      <Input
        name="whatsapp"
        type="tel"
        label="Nomor WhatsApp"
        autoComplete="tel"
        inputMode="tel"
        placeholder="0812 3456 7890"
        hint="Dipakai petugas untuk menghubungi Anda."
        error={errors.whatsapp}
        required
      />
      <div className="flex flex-col gap-2">
        <Input
          name="password"
          type="password"
          label="Kata sandi"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
        />
        {strength.level > 0 ? (
          <div className="flex items-center gap-2" aria-live="polite">
            <div className="flex flex-1 gap-1" aria-hidden>
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-1.5 flex-1 rounded-full ${
                    strength.level >= step ? strengthBar[strength.level] : "bg-brown-light"
                  }`}
                />
              ))}
            </div>
            <span className="text-caption font-semibold text-foreground">
              Kekuatan: {strength.label}
            </span>
          </div>
        ) : null}
      </div>
      <Input
        name="confirmPassword"
        type="password"
        label="Konfirmasi kata sandi"
        autoComplete="new-password"
        placeholder="Ulangi kata sandi"
        error={errors.confirmPassword}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="flex min-h-11 items-start gap-3 text-body-sm text-foreground">
          <input
            type="checkbox"
            name="acceptedTerms"
            aria-invalid={errors.acceptedTerms ? true : undefined}
            aria-describedby={errors.acceptedTerms ? "terms-error" : undefined}
            className="mt-0.5 size-5 shrink-0 accent-green-dark"
          />
          <span>Saya menyetujui Syarat &amp; Ketentuan dan Kebijakan Privasi.</span>
        </label>
        {errors.acceptedTerms ? (
          <p id="terms-error" className="text-body-sm font-medium text-danger">
            {errors.acceptedTerms}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" isLoading={isLoading} loadingText="Mendaftarkan…">
        Daftar
      </Button>
    </form>
  );
}
