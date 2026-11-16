import { ApiError, registerMockRoutes } from "@/lib/api";
import { SESSION_COOKIE, type Role } from "@/lib/auth";

/**
 * Backend simulasi untuk Login/Register/Lupa Kata Sandi sampai be-bsd (BSD-29/30) tersedia.
 * Hanya dipakai saat NEXT_PUBLIC_API_URL kosong. Akun di bawah adalah DATA SIMULASI.
 */
export const MOCK_ACCOUNTS = [
  { email: "nasabah@example.test", password: "nasabah123", role: "nasabah", active: true },
  { email: "petugas@example.test", password: "petugas123", role: "petugas", active: true },
  { email: "nonaktif@example.test", password: "petugas123", role: "petugas", active: false },
  { email: "admin@example.test", password: "admin123", role: "admin", active: true },
] as const;

// shortcut: akun hasil registrasi simulasi hanya hidup di memori tab, hilang saat reload.
const registered = new Set<string>();
// shortcut: kata sandi baru hasil ganti simulasi juga hanya hidup di memori tab.
const changedPasswords = new Map<string, string>();
const passwordOf = (account: { email: string; password: string }) =>
  changedPasswords.get(account.email) ?? account.password;

const sessionRole = () =>
  document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`))?.[1];

function startSession(role: Role) {
  document.cookie = `${SESSION_COOKIE}=${role}; path=/; max-age=28800; samesite=lax`;
  return { role };
}

const delay = () => new Promise((resolve) => setTimeout(resolve, 400));

registerMockRoutes({
  "POST /auth/login": async ({ body }) => {
    await delay();
    const { email, password } = body as { email: string; password: string };
    const account = MOCK_ACCOUNTS.find(
      (item) => item.email === email.trim().toLowerCase() && passwordOf(item) === password,
    );
    if (!account) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Email atau kata sandi salah.");
    }
    if (!account.active) {
      throw new ApiError(
        403,
        "ACCOUNT_DISABLED",
        "Akun Anda dinonaktifkan. Hubungi admin Bank Sampah.",
      );
    }
    return startSession(account.role);
  },

  "POST /auth/register": async ({ body }) => {
    await delay();
    const email = (body as { email: string }).email.trim().toLowerCase();
    if (registered.has(email) || MOCK_ACCOUNTS.some((item) => item.email === email)) {
      throw new ApiError(409, "EMAIL_TAKEN", "Email ini sudah terdaftar. Silakan masuk.");
    }
    registered.add(email);
    return startSession("nasabah");
  },

  "POST /auth/forgot-password": async () => {
    await delay();
    // Respons sama untuk email terdaftar maupun tidak, agar akun tidak bisa ditebak.
    return { sent: true };
  },

  "POST /auth/change-password": async ({ body }) => {
    await delay();
    const { currentPassword, newPassword } = body as {
      currentPassword: string;
      newPassword: string;
    };
    const account = MOCK_ACCOUNTS.find((item) => item.role === sessionRole() && item.active);
    if (!account) throw new ApiError(401, "UNAUTHENTICATED", "Sesi berakhir. Silakan masuk lagi.");
    if (passwordOf(account) !== currentPassword) {
      throw new ApiError(400, "WRONG_PASSWORD", "Kata sandi saat ini salah.");
    }
    changedPasswords.set(account.email, newPassword);
    return { changed: true };
  },

  "POST /auth/logout": async () => {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    return null;
  },
});
