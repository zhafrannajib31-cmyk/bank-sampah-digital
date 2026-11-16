"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import { API_BASE_URL, userMessage } from "@/lib/api";
import { postLoginPath } from "@/lib/auth";
import { login } from "./api";
import { linkClass, FormAlert } from "./auth-card";
import { MOCK_ACCOUNTS } from "./mock-auth";
import { fieldErrors, loginSchema, type FieldErrors } from "./schemas";

type Persona = "nasabah" | "petugas";

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
      const { role } = await login(parsed.data);
      router.replace(postLoginPath(next, role));
    } catch (error) {
      setFormError(userMessage(error));
      setIsLoading(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div role="group" aria-label="Masuk sebagai" className="grid grid-cols-2 gap-2">
        {(["nasabah", "petugas"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={persona === item}
            onClick={() => setPersona(item)}
            className={`min-h-11 rounded-lg px-3 text-body-sm font-semibold capitalize transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
              persona === item
                ? "bg-primary text-foreground"
                : "bg-brown-light text-foreground hover:bg-brown-light-hover"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="text-caption text-muted">
        {persona === "nasabah"
          ? "Belum punya akun? Daftar di bawah."
          : "Akun petugas dibuat oleh admin Bank Sampah."}
      </p>

      {formError ? <FormAlert>{formError}</FormAlert> : null}

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
        name="password"
        type="password"
        label="Kata sandi"
        autoComplete="current-password"
        placeholder="Masukkan kata sandi"
        error={errors.password}
        required
      />

      <Link href="/lupa-password" className={`${linkClass} self-end`}>
        Lupa kata sandi?
      </Link>

      <Button type="submit" size="lg" isLoading={isLoading} loadingText="Memproses…">
        Masuk
      </Button>

      {!API_BASE_URL ? (
        <p className="rounded-lg bg-blue-light px-3 py-2 text-caption text-blue-darker">
          Mode simulasi (data contoh). Akun {persona}:{" "}
          {MOCK_ACCOUNTS.find((item) => item.role === persona)?.email} /{" "}
          {MOCK_ACCOUNTS.find((item) => item.role === persona)?.password}
        </p>
      ) : null}
    </form>
  );
}
