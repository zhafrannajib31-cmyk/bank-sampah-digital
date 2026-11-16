import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, linkClass } from "@/features/auth/auth-card";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Daftar Nasabah"
      description="Buat akun untuk mulai mencatat setoran sampah Anda."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/login" className={linkClass}>
            Masuk
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
