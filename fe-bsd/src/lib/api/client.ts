import { ApiError, fallbackMessage } from "./errors";

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

const httpTransport: ApiTransport = async (
  path,
  { method = "GET", body, idempotencyKey, signal },
) => {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
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

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      code?: string;
      message?: string;
    } | null;
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
