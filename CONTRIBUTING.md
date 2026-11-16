# Panduan Kontribusi — Bank Sampah Digital (BSD)

Dokumen ini merangkum cara kerja kontribusi di repository BSD agar konsisten dengan `AGENTS.md`, backlog, dan alur tim.

## Ruang lingkup kerja

- **`fe-bsd/`**: Frontend Next.js (TypeScript, Tailwind, PWA) — UI nasabah/petugas/admin dan aset terkait frontend.
- **`be-bsd/`**: Backend NestJS (TypeScript, Prisma, PostgreSQL) — API, logika bisnis, akses data.
- **`docs/`**: Dokumen proyek (PRD, backlog, catatan pengerjaan). Baca/ubah hanya bagian yang relevan dengan task.

Sebelum mengubah folder tertentu, ikuti konteks dan aturan di:
- [`AGENTS.md`](AGENTS.md) (root)
- [`fe-bsd/AGENTS.md`](fe-bsd/AGENTS.md) bila mengubah frontend
- [`be-bsd/AGENTS.md`](be-bsd/AGENTS.md) bila mengubah backend

## Alur kerja task

1. **Satu fokus per task**: kerjakan satu task `BSD-xx` dalam satu sesi/perubahan yang terarah.
2. **Pahami scope**: baca baris task dan acceptance criteria yang relevan di `docs/BACKLOG..md`, serta aturan folder yang terdampak.
3. **Rencanakan bila perlu**: untuk task besar/berisiko, susun rencana singkat dan dapatkan persetujuan sebelum implementasi.
4. **Implementasi minimal**: ubah seperlunya sesuai scope; hindari refactor di luar task.
5. **Verifikasi**: jalankan lint dan test pada area yang diubah hingga lulus.
6. **Catat hasil**: perbarui status/log pengerjaan sesuai proses proyek (mis. `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md`) bila task dinyatakan selesai.

## Konvensi branch

- Gunakan format: `feature/BSD-xx-nama-singkat`
- Contoh: `feature/BSD-58-price-snapshot`

Gunakan nama yang jelas, singkat, dan konsisten dengan ID task.

## Konvensi commit

- Gunakan **Conventional Commits** dan sertakan **ID task**.
- Contoh:
  - `feat(be): add price snapshot [BSD-58]`
  - `fix(fe): handle empty state on transaction list [BSD-67]`
  - `docs: update setup guide [BSD-08]`

Tips:
- Tulis subjek commit dalam bahasa Inggris, singkat, dan deskriptif.
- Pisahkan commit berdasarkan perubahan logis bila membantu review (namun tetap dalam scope task).

## Pull Request & review

- Usahakan PR fokus pada satu task (`BSD-xx`) dengan deskripsi yang menjelaskan tujuan, perubahan utama, dan cara verifikasi.
- Pastikan CI (lint/test/build yang relevan) lulus sebelum merge.
- Sertakan bukti verifikasi bila diperlukan (hasil test, tangkapan layar UI, atau catatan langkah uji).
- Jangan melakukan `git push` ke remote tanpa persetujuan yang sesuai dengan alur kerja/tim.

## Standar kualitas

- **Bahasa**: UI dan pesan error untuk pengguna dalam **bahasa Indonesia**; kode, nama variabel/fungsi, dan commit dalam **bahasa Inggris**.
- **Konsistensi**: ikuti pola/struktur dan gaya yang sudah ada di folder terkait.
- **Keamanan & data**: jangan commit `.env`, kredensial, token, atau data sensitif. Jangan log data sensitif.
- **Ketergantungan**: jangan menambah dependency baru tanpa konfirmasi.
- **Database/migrasi**: jangan mengubah migrasi yang sudah ter-commit; buat migrasi baru. Jangan jalankan reset database destruktif tanpa persetujuan.

## Aturan bisnis penting (ringkasan)

Saat mengerjakan fitur terkait transaksi/setoran, pastikan mematuhi aturan kritis proyek (detail di `AGENTS.md`), termasuk:
- Nilai transaksi dihitung di **server** (bukan FE sebagai sumber kebenaran)
- **Snapshot harga** pada transaksi (`unit_price_snapshot`) tidak boleh berubah akibat update harga
- Konfirmasi transaksi harus **atomik** dan **idempotent**
- Otorisasi & kepemilikan data divalidasi di **server**
- Saldo adalah **catatan nilai setoran**, bukan dana cair

## Dokumentasi dan pelaporan

- Rujuk `docs/BACKLOG..md` untuk scope dan acceptance criteria task.
- Catat progres/hasil kerja di `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md` sesuai ketentuan proyek saat task selesai.
- Jika ada perubahan keputusan, asumsi, atau temuan penting, dokumentasikan secara ringkas di tempat yang sesuai.