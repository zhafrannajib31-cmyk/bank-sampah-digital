"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { Asset } from "@/components/ui";

import { LogoutButton } from "@/features/auth/logout-button";

import { formatMonthShortYear } from "@/features/nasabah/format";

import { nasabahApi } from "@/features/nasabah/api";

import type { NasabahProfile } from "@/features/nasabah/types";

import { cn } from "@/lib/cn";



function initials(name: string) {

  const parts = name.split(" ").filter(Boolean);

  return [parts[0], parts.length > 1 ? parts[parts.length - 1] : ""]

    .map((part) => part?.[0]?.toUpperCase() ?? "")

    .join("");

}



interface FieldError {

  name?: string;

  email?: string;

  phone?: string;

}



export default function ProfilPage() {


  const [profile, setProfile] = useState<NasabahProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [editable, setEditable] = useState(false);

  const [form, setForm] = useState<NasabahProfile | null>(null);

  const [formErrors, setFormErrors] = useState<FieldError>({});



  useEffect(() => {

    let cancelled = false;

    (async () => {

      try {

        const data = await nasabahApi.profile();

        if (!cancelled) {

          setProfile(data);

          setForm(data);

        }

      } catch (e: unknown) {

        if (!cancelled) setError("Gagal memuat profil. Coba muat ulang.");

      } finally {

        if (!cancelled) setIsLoading(false);

      }

    })();

    return () => {

      cancelled = true;

    };

  }, []);



  const handleSave = async () => {

    if (!form) return;

    setFormErrors({});

    try {

      setIsSaving(true);

      const updated = await nasabahApi.updateProfile({

        name: form.name?.trim() || undefined,

        email: form.email?.trim() || undefined,

        phone: form.phone?.trim() || undefined,

      });

      setProfile(updated);

      setForm(updated);

      setEditable(false);

      setError(null);

    } catch (e: unknown) {

      const msg = (e as Error)?.message ?? "Gagal menyimpan. Coba lagi.";

      setError(msg);

    } finally {

      setIsSaving(false);

    }

  };



  if (isLoading) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        <p className="text-subtle">Memuat profil…</p>

      </div>

    );

  }



  if (error && !profile) {

    return (

      <div className="mx-auto flex max-w-[430px] flex-col items-center justify-center gap-3 text-center">

        <p className="text-danger">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-semibold text-green-dark-active underline"
        >
          Muat ulang
        </button>
      </div>

    );

  }



  return (

    <div className="mx-auto w-full max-w-[430px]">

      <header className="relative h-[262px] overflow-hidden bg-linear-to-b from-[#b9f7d2] to-[#e5fbee]">

        <h1 className="absolute top-[50px] left-5 text-[23px] leading-[28px] font-bold text-heading">

          Profil

        </h1>

        <div className="absolute top-[94px] left-1/2 size-[92px] -translate-x-1/2">

          <Asset

            src="/nasabah/profil-avatar.svg"

            width={128}

            height={128}

            className="absolute -top-[9px] -left-[18px] max-w-none"

          />

          <p className="absolute inset-0 flex items-center justify-center text-[32px] font-bold text-white">

            {profile ? initials(profile.name) : ""}

          </p>

        </div>

        {profile ? (

          <>

            <p className="absolute top-[199px] w-full text-center text-[18px] leading-[22px] font-bold text-heading">

              {profile.name}

            </p>

            <p className="absolute top-[224px] w-full text-center text-[12px] leading-[16px] text-[#4d6257]">

              Nasabah · bergabung {formatMonthShortYear(profile.createdAt)}

            </p>

          </>

        ) : (

          <>

            <p className="absolute top-[199px] w-full text-center text-[18px] leading-[22px] font-bold text-heading">

              Profil

            </p>

            <p className="absolute top-[224px] w-full text-center text-[12px] leading-[16px] text-[#4d6257]">

              Memuat…

            </p>

          </>

        )}

      </header>



      <div className="flex flex-col gap-[14px] px-5 pt-4">

        <section aria-label="Data diri" className="rounded-[18px] border border-[#e3ece6] bg-white">

          <div className="flex h-[38px] items-center justify-between px-4 pt-2">

            <h2 className="text-[14px] font-bold text-heading">Data Diri</h2>

            {profile && !editable ? (

              <button

                type="button"

                onClick={() => setEditable(true)}

                className="text-[12px] font-semibold text-green-dark-active underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"

              >

                Ubah

              </button>

            ) : editable ? (

              <button

                type="button"

                onClick={() => setEditable(false)}

                className="text-[12px] font-semibold text-gray-500 underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"

              >

                Batal

              </button>

            ) : null}

          </div>



          {editable ? (

            <form

              className="space-y-3 pt-3"

              onSubmit={(e) => {

                e.preventDefault();

                handleSave();

              }}

            >

              <InputField

                label="Nama"

                value={form?.name ?? ""}

                onChange={(v) => setForm({ ...form!, name: v })}

                error={formErrors.name}

                full

              />

              <InputField

                label="Email"

                type="email"

                value={form?.email ?? ""}

                onChange={(v) => setForm({ ...form!, email: v })}

                error={formErrors.email}

              />

              <InputField

                label="Nomor telepon"

                value={form?.phone ?? ""}

                onChange={(v) => setForm({ ...form!, phone: v })}

                error={formErrors.phone}

              />

              {error && <p className="text-sm text-danger">{error}</p>}

              <div className="flex gap-2 pt-1">

                <button

                  type="submit"

                  disabled={isSaving}

                  className="flex-1 text-sm font-semibold text-white bg-green-dark-active hover:bg-green-dark-active/90 disabled:opacity-60"

                >

                  {isSaving ? "Menyimpan…" : "Simpan"}

                </button>

                <button

                  type="button"

                  onClick={() => {

                    setForm(profile);

                    setEditable(false);

                    setError(null);

                  }}

                  className="flex-1 text-sm font-semibold text-gray-500 hover:text-gray-700"

                >

                  Batal

                </button>

              </div>

            </form>

          ) : profile ? (

            <div className="divide-y divide-[#eff3f0] py-3">

              <InfoRow label="Email" value={profile.email} />

              <InfoRow label="Nomor telepon" value={profile.phone} />

              <InfoRow label="Nama" value={profile.name} />

            </div>

          ) : (

            <p className="py-3 text-center text-sm text-gray-400">Tidak ada profil</p>

          )}

        </section>



        <section

          aria-label="Pengaturan akun"

          className="overflow-hidden rounded-[18px] border border-[#e3ece6] bg-white"

        >

          <Link

            href="/nasabah/saldo"

            className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"

          >

            <Row>

              <IconBox bg="bg-[#ddf9e7]" src="/nasabah/profil-wallet.svg" size={16} />

              <span className="flex flex-1 flex-col gap-px leading-[17px]">

                <span className="text-[13px] font-semibold text-heading">Saldo Setoran</span>

                <span className="text-[12px] text-[#52685b]">

                  {profile ? "Lihat di halaman riwayat" : "Memuat…"} · catatan nilai

                </span>

              </span>

              <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />

            </Row>

          </Link>

          <Link

            href="/nasabah/profil/kata-sandi"

            className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"

          >

            <Row>

              <IconBox bg="bg-[#e0f0ff]" src="/nasabah/profil-lock.svg" size={16} />

              <span className="flex-1 text-[13px] font-semibold text-heading">Ubah Kata Sandi</span>

              <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />

            </Row>

          </Link>

          <Row>

            <IconBox bg="bg-wait-bg" src="/nasabah/profil-bell.svg" size={16} />

            <span className="flex-1 text-[13px] font-semibold text-heading">Notifikasi Status</span>

            <button

              type="button"

              role="switch"

              aria-checked={false}

              aria-label="Notifikasi status"

              className="flex h-11 w-[52px] items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"

            >

              <span className="relative block h-[26px] w-11 rounded-full bg-black/20">

                <span className="absolute top-[3px] left-[3px] size-5 rounded-full bg-white" />

              </span>

            </button>

          </Row>

          <Link

            href="/nasabah/bantuan"

            className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"

          >

            <Row bordered={false}>

              <IconBox bg="bg-[#f0e9fc]" src="/nasabah/profil-help.svg" size={16} />

              <span className="flex-1 text-[13px] font-semibold text-heading">

                Bantuan &amp; Cara Memilah

              </span>

              <Asset src="/nasabah/profil-chevron.svg" width={16} height={16} />

            </Row>

          </Link>

        </section>



        <LogoutButton variant="profile" />

      </div>

    </div>

  );

}



function InputField({

  label,

  type = "text",

  value,

  onChange,

  error,

  full = false,

}: {

  label: string;

  type?: string;

  value: string;

  onChange: (v: string) => void;

  error?: string;

  full?: boolean;

}) {

  return (

    <div className={cn("pt-1", full && "flex flex-col gap-1")}>

      <label className="block text-[12px] font-semibold text-[#5f6e66]">{label}</label>

      <input

        type={type}

        value={value}

        onChange={(e) => onChange(e.target.value)}

        className={cn(

          "w-full rounded-[8px] border border-[#d8e2dc] bg-[#f6f8f7] px-3 py-2 text-[14px] text-heading focus:border-green-dark-active focus:outline-none",

          full && "pt-3",

        )}

        aria-invalid={!!error}

      />

      {error && <p className="text-[11px] text-danger">{error}</p>}

    </div>

  );

}



function InfoRow({ label, value }: { label: string; value: string }) {

  return (

    <div className="flex items-center justify-between px-4 py-2 text-[13px]">

      <span className="text-[#5f6e66]">{label}</span>

      <span className="font-semibold text-heading">{value}</span>

    </div>

  );

}



function Row({

  children,

  bordered = true,

}: {

  children: React.ReactNode;

  bordered?: boolean;

}) {

  return (

    <div

      className={cn(

        "flex min-h-[65px] items-center gap-3 px-4",

        bordered && "border-b border-[#eff3f0]",

      )}

    >

      {children}

    </div>

  );

}



function IconBox({ bg, src, size }: { bg: string; src: string; size: number }) {

  return (

    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-[12px]", bg)}>

      <Asset src={src} width={size} height={size} />

    </span>

  );

}

