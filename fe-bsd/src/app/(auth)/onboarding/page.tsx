import type { Metadata } from "next";
import { Onboarding } from "@/features/auth/onboarding";

export const metadata: Metadata = { title: "Selamat Datang" };

export default function OnboardingPage() {
  return <Onboarding />;
}
