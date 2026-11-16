import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/auth-ui";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  return (
    <AuthScreen logoTop={81}>
      <RegisterForm />
    </AuthScreen>
  );
}
