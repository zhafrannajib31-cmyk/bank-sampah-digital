import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, linkClass } from "@/features/auth/auth-card";
import { ForgotForm } from "@/features/auth/forgot-form";

export const metadata: Metadata = { title: "Lupa Kata Sandi" };

export default function LupaPasswordPage() {
  return (
    <AuthCard
      title="Lupa Kata Sandi"
      description="Masukkan email akun Anda. Kami kirim tautan untuk mengatur ulang kata sandi."
      footer={
        <Link href="/login" className={linkClass}>
          Kembali ke halaman masuk
        </Link>
      }
    >
      <ForgotForm />
    </AuthCard>
  );
}
