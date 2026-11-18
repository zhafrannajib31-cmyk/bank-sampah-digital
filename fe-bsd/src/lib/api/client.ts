import { ApiError, fallbackMessage } from "./errors";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateTokens,
} from "../auth/session";

/** Satu-satunya env publik FE. Kosong = mode mock (belum ada be-bsd yang terhubung). */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Wajib untuk aksi kirim/konfirmasi; pakai ulang kunci yang sama saat retry. */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

type ApiTransport = (path: string, options: RequestOptions) => Promise<unknown>;

/** Kunci baru dibuat saat layar konfirmasi dibuka, bukan per klik. */
export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

/** Satu refresh berbagi hasil untuk semua request yang kena 401 bersamaan. */
let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        clearSession();
        return null;
      }
      const data = (await response.json()) as { accessToken: string; refreshToken: string };
      updateTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function send(path: string, options: RequestOptions, token: string | null): Promise<Response> {
  const { method = "GET", body, idempotencyKey, signal } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, "NETWORK_ERROR", fallbackMessage(0));
  }
}

const httpTransport: ApiTransport = async (path, options) => {
  let response = await send(path, options, getAccessToken());

  // Access token 15 menit: sekali refresh lalu ulangi request (kecuali endpoint auth sendiri).
  if (response.status === 401 && !path.startsWith("/auth/")) {
    const token = await refreshAccessToken();
    if (token) response = await send(path, options, token);
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      code?: string;
      message?: string;
    } | null;
    if (response.status === 401 && !path.startsWith("/auth/")) clearSession();
    throw new ApiError(
      response.status,
      data?.code ?? "UNKNOWN",
      data?.message ?? fallbackMessage(response.status),
    );
  }

  return response.status === 204 ? null : response.json();
};

/** Mock per fitur didaftarkan dengan kunci "METHOD /path"; dipakai hanya saat API_BASE_URL kosong. */
type MockHandler = (options: RequestOptions) => unknown | Promise<unknown>;
const mockRoutes: Record<string, MockHandler> = {};

export function registerMockRoutes(routes: Record<string, MockHandler>): void {
  Object.assign(mockRoutes, routes);
}

const mockTransport: ApiTransport = async (path, options) => {
  const handler = mockRoutes[`${options.method ?? "GET"} ${path.split("?")[0]}`];
  if (!handler) {
    throw new ApiError(404, "MOCK_NOT_FOUND", "Endpoint simulasi belum tersedia.");
  }
  return handler(options);
};

const transport: ApiTransport = API_BASE_URL ? httpTransport : mockTransport;

/** Client API tunggal: semua pemanggilan be-bsd lewat sini, bukan fetch di komponen. */
export function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return transport(path, options) as Promise<T>;
}
