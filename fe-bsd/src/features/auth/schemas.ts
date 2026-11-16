import { z } from "zod";

const email = z.email("Masukkan email yang valid, contoh: nama@email.com.");

/** Terima 08xx, 628xx, atau +628xx; spasi dan tanda hubung diabaikan. Hasil: +628xx. */
export function normalizeWhatsapp(value: string): string {
  const digits = value.replace(/[\s-]/g, "");
  if (digits.startsWith("+62")) return digits;
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `+62${digits}`;
  return digits;
}

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const forgotPasswordSchema = z.object({ email });

const whatsapp = z
  .string()
  .transform(normalizeWhatsapp)
  .pipe(
    z
      .string()
      .regex(/^\+628[1-9][0-9]{7,11}$/, "Nomor WhatsApp tidak valid, contoh: 0812 3456 7890."),
  );

/** Tampilan nomor ternormalisasi: +62 812 3456 7890. */
export function formatWhatsapp(normalized: string): string {
  const rest = normalized.replace(/^\+62/, "");
  return `+62 ${rest.slice(0, 3)} ${rest.slice(3, 7)} ${rest.slice(7)}`.trim();
}

const personName = z.string().trim().min(1, "Nama lengkap wajib diisi.");

export const profileSchema = z.object({ name: personName, whatsapp });

export const registerSchema = z
  .object({
    name: personName,
    email,
    whatsapp,
    password: z.string().min(8, "Kata sandi minimal 8 karakter."),
    confirmPassword: z.string(),
    acceptedTerms: z.literal(true, "Anda perlu menyetujui Syarat & Ketentuan."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi kata sandi tidak sama.",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi."),
    newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi kata sandi tidak sama.",
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ["newPassword"],
    message: "Kata sandi baru harus berbeda dari yang lama.",
  });

export type FieldErrors = Record<string, string>;

/** Ambil pesan pertama per kolom dari hasil zod. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

export type PasswordStrength = { level: 0 | 1 | 2 | 3 | 4; label: string };

/** 4 kriteria: panjang >= 8, huruf besar+kecil, angka, simbol. Hanya petunjuk UX; server tetap penentu. */
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return { level: 0, label: "" };
  const score = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length as 1 | 2 | 3 | 4;
  const level = password.length < 8 ? 1 : Math.max(score, 1);
  return {
    level: level as 1 | 2 | 3 | 4,
    label: level <= 1 ? "Lemah" : level === 2 ? "Sedang" : "Kuat",
  };
}
