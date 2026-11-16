"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { clearDraft } from "@/features/nasabah/draft";
import { formatDate } from "@/features/nasabah/format";
import { PrototypeNotice } from "@/features/nasabah/prototype-notice";
import { usePrototype } from "@/features/nasabah/prototype-store";

export default function ProfilPage() {
  const { profile, updateProfile, resetPrototype } = usePrototype();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();

    if (!name || !phone) {
      setError("Nama dan nomor telepon wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await updateProfile({ ...profile, name, phone, email, address });
      setMessage("Profil berhasil diperbarui (simulasi).");
    } catch {
      setError("Profil gagal diperbarui. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset(): void {
    const confirmed = window.confirm(
      "Reset semua data prototype? Pengajuan baru dan perubahan profil akan dihapus.",
    );

    if (!confirmed) return;

    clearDraft();
    resetPrototype();
    setMessage("Data prototype berhasil direset.");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <PrototypeNotice />

      <header className="flex flex-col gap-1">
        <h1 className="text-h2 text-foreground">Profil nasabah</h1>
        <p className="text-body text-muted">
          Data profil disimpan di perangkat untuk keperluan prototype.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Data diri</CardTitle>
          <CardDescription>
            Anggota sejak {formatDate(profile.memberSince)} · ID nasabah simulasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            key={`${profile.name}-${profile.phone}-${profile.email}-${profile.address}`}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Nama lengkap"
              name="name"
              defaultValue={profile.name}
              autoComplete="name"
              required
            />
            <Input
              label="Nomor telepon"
              name="phone"
              type="tel"
              defaultValue={profile.phone}
              autoComplete="tel"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={profile.email}
              autoComplete="email"
            />
            <Input
              label="Alamat"
              name="address"
              defaultValue={profile.address}
              autoComplete="street-address"
            />

            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-body-sm font-medium text-danger-dark"
              >
                {error}
              </div>
            ) : null}

            {message ? (
              <div
                role="status"
                className="rounded-lg border border-green-dark/30 bg-green-light px-3 py-2 text-body-sm font-medium text-green-darker"
              >
                {message}
              </div>
            ) : null}

            <Button type="submit" isLoading={saving} loadingText="Menyimpan…">
              Simpan profil
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data prototype</CardTitle>
          <CardDescription>
            Reset akan mengembalikan contoh transaksi dan profil ke kondisi awal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="danger" onClick={handleReset}>
            Reset data prototype
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
