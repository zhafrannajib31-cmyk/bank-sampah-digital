import { request } from "@/lib/api";
import type { Role } from "@/lib/auth";
import "./mock-auth";

export function login(body: { email: string; password: string }) {
  return request<{ role: Role }>("/auth/login", { method: "POST", body });
}

export function register(body: {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
}) {
  return request<{ role: Role }>("/auth/register", { method: "POST", body });
}

export function forgotPassword(body: { email: string }) {
  return request<{ sent: boolean }>("/auth/forgot-password", { method: "POST", body });
}

export function logout() {
  return request<null>("/auth/logout", { method: "POST" });
}
