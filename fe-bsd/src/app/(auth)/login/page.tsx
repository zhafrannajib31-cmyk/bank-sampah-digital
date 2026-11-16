import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard, linkClass } from "@/features/auth/auth-card";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Masuk"
      description="Masuk untuk mengajukan atau memantau setoran sampah."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className={linkClass}>
            Daftar sekarang
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
