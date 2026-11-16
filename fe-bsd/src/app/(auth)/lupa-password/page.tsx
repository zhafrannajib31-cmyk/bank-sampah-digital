import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/auth-ui";
import { ForgotForm } from "@/features/auth/forgot-form";

export const metadata: Metadata = { title: "Lupa Kata Sandi" };

export default function LupaPasswordPage() {
  return (
    <AuthScreen>
      <ForgotForm />
    </AuthScreen>
  );
}
