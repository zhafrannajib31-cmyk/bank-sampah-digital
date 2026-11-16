"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Input, StepActions, StepHeader } from "@/components/ui";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { userMessage } from "@/lib/api";
import { OFFLINE_MESSAGE } from "@/lib/use-online";
import { changePassword } from "./api";
import { changePasswordSchema, fieldErrors, passwordStrength, type FieldErrors } from "./schemas";

/** Ubah kata sandi untuk pengguna yang sudah masuk (nasabah dan petugas). */
export function ChangePasswordForm({ backHref }: { backHref: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const strength = passwordStrength(newPassword);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const form = new FormData(event.currentTarget);
    const parsed = changePasswordSchema.safeParse({
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword: String(form.get("newPassword") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    if (!navigator.onLine) {
      setFormError(OFFLINE_MESSAGE);
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      });
      setDone(true);
    } catch (cause) {
      setFormError(userMessage(cause));
    } finally {
      setSaving(false);
    }
  }

  return (
    <StepScreen>
      <StepHeader
        title="Ubah Kata Sandi"
        subtitle="Gunakan minimal 8 karakter"
        backHref={backHref}
      />
      {done ? (
        <div className="flex flex-1 flex-col gap-4">
          <p
            role="status"
            className="rounded-[18px] bg-[#f0fcf6] p-4 text-[14px] leading-[20px] font-semibold text-green-dark-active"
          >
            Kata sandi berhasil diperbarui. Gunakan kata sandi baru saat masuk berikutnya.
          </p>
          <Link
            href={backHref}
            className="flex h-[50px] items-center justify-center rounded-[10px] bg-primary text-[14px] font-bold text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Kembali ke Profil
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
          <Input
            name="currentPassword"
            type="password"
            label="Kata Sandi Saat Ini"
            autoComplete="current-password"
            required
            error={errors.currentPassword}
          />
          <Input
            name="newPassword"
            type="password"
            label="Kata Sandi Baru"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            hint={strength.label ? `Kekuatan: ${strength.label}` : "Minimal 8 karakter"}
            error={errors.newPassword}
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Ulangi Kata Sandi Baru"
            autoComplete="new-password"
            required
            error={errors.confirmPassword}
          />
          {formError ? (
            <p role="alert" className="text-[12px] leading-[17px] font-semibold text-danger-dark">
              {formError}
            </p>
          ) : null}
          <StepActions>
            <StepNext arrow={false} type="submit" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan Kata Sandi"}
            </StepNext>
          </StepActions>
        </form>
      )}
    </StepScreen>
  );
}
