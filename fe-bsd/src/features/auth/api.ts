import { request } from "@/lib/api";
import { clearSession, getRefreshToken, saveSession, type AuthSession } from "@/lib/auth";
import "./mock-auth";

export type AuthResponse = AuthSession & { expiresIn: number };

export async function login(body: { email: string; password: string }) {
  const session = await request<AuthResponse>("/auth/login", { method: "POST", body });
  saveSession(session);
  return session;
}

export async function register(body: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const session = await request<AuthResponse>("/auth/register", { method: "POST", body });
  saveSession(session);
  return session;
}

export function forgotPassword(body: { email: string }) {
  return request<{ sent: boolean }>("/auth/forgot-password", { method: "POST", body });
}

export function changePassword(body: { currentPassword: string; newPassword: string }) {
  return request<{ changed: boolean }>("/auth/change-password", { method: "POST", body });
}

export async function logout() {
  try {
    await request<null>("/auth/logout", {
      method: "POST",
      body: { refreshToken: getRefreshToken() },
    });
  } finally {
    clearSession();
  }
}
