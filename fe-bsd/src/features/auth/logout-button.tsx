"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { logout } from "./api";

export function LogoutButton() {
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

  return (
    <Button variant="outline" size="sm" isLoading={isLoading} onClick={handleClick}>
      Keluar
    </Button>
  );
}
