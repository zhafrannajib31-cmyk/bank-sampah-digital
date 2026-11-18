# fe-bsd (Next.js PWA + website publik)

## Stack

Next.js (App Router), TypeScript strict, Tailwind. PWA: manifest + service worker.

## Struktur yang dianjurkan

- src/app/(public)/ : website publik (Beranda, Tentang, Cara Kerja, Artikel, Kontak)
- src/app/(auth)/ : login, register, lupa password
- src/app/nasabah/ : halaman nasabah
- src/app/petugas/ : halaman petugas
- src/app/admin/ : halaman admin
- src/components/ui/ : komponen reusable (button, input, badge status, empty/loading/error state)
- src/lib/api/ : client API tunggal ke be-bsd (jangan fetch tersebar di komponen)
- src/lib/auth/ : session, guard route per role

## Aturan

- Semua halaman wajib punya loading state, empty state, dan error state.
- Form: validasi di client (zod) untuk UX, tetapi server tetap penentu. Pesan error bahasa Indonesia, jelas.
- Proteksi route per role di middleware; jangan hanya menyembunyikan menu.
- Tampilkan estimasi dan nilai final secara BERBEDA dan berlabel jelas.
- Jangan hitung nilai transaksi di FE sebagai sumber kebenaran; ambil dari respons API.
- Aksi kirim/konfirmasi: nonaktifkan tombol saat proses, kirim idempotency key, tangani jaringan putus dengan pesan dan retry aman.
- Mobile-first, kontras memadai, semua kontrol punya label. Warna: hijau (utama), biru (aksen), putih (latar).
- Jangan cache respons transaksi/saldo di service worker secara agresif; pakai network-first untuk data pengguna.
- Env publik hanya NEXT_PUBLIC_API_URL; jangan taruh rahasia di FE.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
