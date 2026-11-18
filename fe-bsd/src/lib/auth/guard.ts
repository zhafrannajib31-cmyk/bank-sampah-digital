export type Role = "nasabah" | "petugas" | "admin";

/** Nama cookie sesi. Isi: peran pengguna dari respons login be-bsd. */
// shortcut: cookie berisi peran apa adanya (bisa dipalsukan di klien); proxy hanya gating tampilan,
// be-bsd tetap penentu akses data. Ganti ke cookie HttpOnly bila be-bsd menyediakan sesi cookie.
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

/** Tujuan setelah login: `next` hanya dipakai jika path internal yang boleh diakses peran ini. */
export function postLoginPath(next: string | undefined, role: Role): string {
  const internal = next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\");
  return next && internal && resolveAccess(next, role).type === "allow" ? next : roleHome[role];
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
