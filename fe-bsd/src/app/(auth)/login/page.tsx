import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/features/auth/auth-ui";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <AuthScreen>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthScreen>
  );
}
