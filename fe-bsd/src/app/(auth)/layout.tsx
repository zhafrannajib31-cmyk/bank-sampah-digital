import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-gradient-to-b from-green-light via-surface to-blue-light">
      {children}
    </div>
  );
}
