/** Format error seragam dari be-bsd: { statusCode, message, code }. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  /** Jaringan putus / server tidak terjangkau: aman dicoba ulang dengan Idempotency-Key yang sama. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

const fallbackMessages: Record<number, string> = {
  0: "Koneksi terputus. Periksa jaringan Anda lalu coba lagi.",
  401: "Sesi Anda berakhir. Silakan masuk kembali.",
  403: "Anda tidak memiliki akses ke halaman ini.",
  404: "Data tidak ditemukan.",
  409: "Permintaan ini sudah diproses atau bertabrakan dengan data lain.",
  429: "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
};

export function fallbackMessage(status: number): string {
  return (
    fallbackMessages[status] ??
    (status >= 500
      ? "Terjadi gangguan pada server. Coba lagi beberapa saat lagi."
      : "Permintaan tidak dapat diproses.")
  );
}

/** Pesan aman untuk ditampilkan ke pengguna dari error apa pun. */
export function userMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : fallbackMessage(500);
}
