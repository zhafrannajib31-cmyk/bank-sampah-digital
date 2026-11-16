"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input, StepActions, StepHeader } from "@/components/ui";
import {
  fieldErrors,
  formatWhatsapp,
  profileSchema,
  type FieldErrors,
} from "@/features/auth/schemas";
import { usePrototype } from "@/features/nasabah/prototype-store";
import { StepNext, StepScreen } from "@/features/nasabah/step-screen";
import { userMessage } from "@/lib/api";
import { OFFLINE_MESSAGE } from "@/lib/use-online";

export default function UbahProfilPage() {
  const router = useRouter();
  const { profile, updateProfile } = usePrototype();
  // null = belum diedit; tampilkan nilai tersimpan agar tidak tertinggal saat data dimuat dari penyimpanan.
  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const parsed = profileSchema.safeParse({
      name: name ?? profile.name,
      whatsapp: phone ?? profile.phone,
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
      await updateProfile({
        ...profile,
        name: parsed.data.name,
        phone: formatWhatsapp(parsed.data.whatsapp),
      });
      router.push("/nasabah/profil");
    } catch (cause) {
      setFormError(userMessage(cause));
      setSaving(false);
    }
  }

  return (
    <StepScreen>
      <StepHeader
        title="Ubah Data Diri"
        subtitle="Nama dan nomor WhatsApp"
        backHref="/nasabah/profil"
      />
      <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        <Input
          name="name"
          label="Nama Lengkap"
          autoComplete="name"
          required
          value={name ?? profile.name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />
        <Input
          name="whatsapp"
          label="Nomor WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={phone ?? profile.phone}
          onChange={(event) => setPhone(event.target.value)}
          hint="Contoh: 0812 3456 7890"
          error={errors.whatsapp}
        />
        <Input
          name="email"
          label="Alamat Email"
          value={profile.email}
          readOnly
          disabled
          hint="Email tidak dapat diubah dari aplikasi."
        />
        {formError ? (
          <p role="alert" className="text-[12px] leading-[17px] font-semibold text-danger-dark">
            {formError}
          </p>
        ) : null}
        <StepActions>
          <StepNext arrow={false} type="submit" disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </StepNext>
        </StepActions>
      </form>
    </StepScreen>
  );
}
