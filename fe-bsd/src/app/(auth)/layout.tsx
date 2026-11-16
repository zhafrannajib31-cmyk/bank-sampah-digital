import type { ReactNode } from "react";

// Latar gradien berbeda per layar (auth: hijau-putih, splash: biru-hijau, onboarding: putih),
// jadi tiap layar menggambar latarnya sendiri.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
