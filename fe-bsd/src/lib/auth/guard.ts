export type Role = "nasabah" | "petugas" | "admin";

/** Nama cookie sesi. Isi (mock): peran pengguna. */
// shortcut: cookie berisi peran apa adanya (bisa dipalsukan di klien), ganti dengan sesi HttpOnly
// dari be-bsd saat BSD-29/33 selesai; server tetap penentu akses sebenarnya.
export const SESSION_COOKIE = "bsd_session";

export const roleHome: Record<Role, string> = {
  nasabah: "/nasabah",
  petugas: "/petugas",
  admin: "/admin",
};

const protectedPrefixes: Role[] = ["nasabah", "petugas", "admin"];

export type AccessDecision =
  { type: "allow" } | { type: "login"; next: string } | { type: "redirect"; to: string };

export function isRole(value: string | undefined): value is Role {
  return value === "nasabah" || value === "petugas" || value === "admin";
}

/** Keputusan akses murni (tanpa I/O) agar mudah diuji dan dipakai ulang di proxy. */
export function resolveAccess(pathname: string, role: Role | null): AccessDecision {
  const area = protectedPrefixes.find(
    (prefix) => pathname === `/${prefix}` || pathname.startsWith(`/${prefix}/`),
  );

  if (!area) return { type: "allow" };
  if (!role) return { type: "login", next: pathname };
  if (role !== area) return { type: "redirect", to: roleHome[role] };
  return { type: "allow" };
}
