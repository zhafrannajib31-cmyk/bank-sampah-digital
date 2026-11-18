import { ApiError, registerMockRoutes } from "@/lib/api";
import type { AuthResponse } from "./api";

/**
 * Backend simulasi untuk Login/Register/Lupa Kata Sandi.
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
  document.cookie.match(/(?:^|; )bsd_session=([^;]+)/)?.[1];

const delay = () => new Promise((resolve) => setTimeout(resolve, 400));

/** Bentuk respons sama dengan be-bsd: { user, accessToken, refreshToken, expiresIn }. */
function startSession(user: {
  name: string;
  email: string;
  role: AuthResponse["user"]["role"];
}): AuthResponse {
  return {
    user: { id: `mock-${user.role}`, name: user.name, email: user.email, role: user.role, status: "active" },
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn: 28800,
  };
}

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
    return startSession({ name: account.email.split("@")[0], email: account.email, role: account.role });
  },

  "POST /auth/register": async ({ body }) => {
    await delay();
    const input = body as { name: string; email: string };
    const email = input.email.trim().toLowerCase();
    if (registered.has(email) || MOCK_ACCOUNTS.some((item) => item.email === email)) {
      throw new ApiError(409, "EMAIL_TAKEN", "Email ini sudah terdaftar. Silakan masuk.");
    }
    registered.add(email);
    return startSession({ name: input.name, email, role: "nasabah" });
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

  "POST /auth/logout": async () => null,
});
