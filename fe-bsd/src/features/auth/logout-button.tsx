"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { logout } from "./api";

export function LogoutButton({ variant = "compact" }: { variant?: "compact" | "profile" }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      // Tetap keluar dari UI meski jaringan gagal; sesi server berakhir sendiri.
      router.replace("/login");
    }
  }

  if (variant === "profile") {
    return (
      <button
        type="button"
        disabled={isLoading}
        onClick={handleClick}
        className="flex h-[50px] w-full items-center justify-center rounded-[30px] border border-[#ff575d] bg-white text-[14px] font-semibold text-[#d92116] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-60"
      >
        {isLoading ? "Keluar…" : "Keluar"}
      </button>
    );
  }

  return (
    <Button variant="outline" size="sm" isLoading={isLoading} onClick={handleClick}>
      Keluar
    </Button>
  );
}
