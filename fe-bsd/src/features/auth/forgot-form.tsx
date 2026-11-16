"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import { userMessage } from "@/lib/api";
import { forgotPassword } from "./api";
import { FormAlert } from "./auth-card";
import { fieldErrors, forgotPasswordSchema, type FieldErrors } from "./schemas";

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
      <div role="status" className="flex flex-col gap-4">
        <p className="text-body text-foreground">
          Jika <strong className="break-all">{sentTo}</strong> terdaftar, tautan untuk mengatur
          ulang kata sandi sudah dikirim. Tautan berlaku 30 menit.
        </p>
        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <Button
          variant="outline"
          size="lg"
          isLoading={isLoading}
          loadingText="Mengirim ulang…"
          onClick={() => send(sentTo)}
        >
          Kirim ulang
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      <Button type="submit" size="lg" isLoading={isLoading} loadingText="Mengirim…">
        Kirim tautan
      </Button>
    </form>
  );
}
