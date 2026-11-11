# Bank Sampah Digital (BSD)

Platform setor sampah: nasabah mengajukan setoran, petugas menimbang & mengonfirmasi transaksi, admin mengelola data master.
MVP = nasabah ANTAR SENDIRI ke Bank Sampah Unit. Penjemputan di luar MVP (Fase 2) kecuali PO memutuskan lain.

## Struktur repo
- fe-bsd/ : Next.js (TypeScript, Tailwind), PWA untuk nasabah/petugas/admin + website publik
- be-bsd/ : REST API (NestJS + TypeScript), PostgreSQL via Prisma
- docs/   : PRD, BACKLOG, CATATAN_PENGERJAAN. JANGAN dibaca kecuali diminta; rujuk bagian spesifik saja.

## Konteks per folder (baca HANYA yang relevan dengan task)
- Mengubah fe-bsd/ -> baca fe-bsd/AGENTS.md
- Mengubah be-bsd/ -> baca be-bsd/AGENTS.md

## Perintah
- DB lokal: docker compose up -d
- FE: cd fe-bsd && npm run dev | npm run lint | npm test
- BE: cd be-bsd && npm run start:dev | npm run lint | npm test

## Aturan bisnis kritis (jangan dilanggar)
1. Nilai transaksi = berat aktual x harga/kg. DIHITUNG DI SERVER, FE hanya menampilkan.
2. Harga disimpan sebagai snapshot di deposit_items.unit_price_snapshot; perubahan harga tidak boleh mengubah transaksi lama.
3. Berat dari nasabah = ESTIMASI (label "bukan nilai final"). Berat aktual hanya diinput petugas.
4. Transaksi berstatus Selesai hanya setelah petugas mengonfirmasi. Konfirmasi harus atomik (DB transaction) dan idempotent (tidak boleh ganda saat retry).
5. Nasabah hanya mengakses data miliknya; petugas hanya unit miliknya (cek di server, bukan hanya di FE).
6. Akun petugas/admin hanya dibuat/diaktifkan admin. Registrasi publik = nasabah saja.
7. Saldo = catatan nilai setoran, BUKAN uang yang bisa ditarik. Jangan tampilkan sebagai dana cair.
8. Pembatalan/koreksi setelah konfirmasi wajib ada alasan dan tercatat di transaction_events.
9. Status nasabah: Menunggu, Diproses, Selesai (+ Dibatalkan dengan alasan).
10. Data harga/lokasi contoh = data SIMULASI, tandai jelas.

## Konvensi
- UI dan pesan error untuk pengguna: bahasa Indonesia. Kode, nama variabel, commit: Inggris.
- Branch: feature/BSD-xx-nama-singkat. Commit: Conventional Commits, sertakan ID, mis. "feat(be): add price snapshot [BSD-58]".
- Jangan tambah dependency baru tanpa konfirmasi.
- Ubah seperlunya; jangan refactor di luar task. Jangan commit .env atau rahasia.
- Jangan jalankan git push, hapus massal, atau reset database tanpa persetujuan.

## Alur kerja
- Satu sesi = satu task BSD-xx. Task besar: rencanakan dulu (mode Plan), tunggu persetujuan.
- Sebelum selesai: jalankan lint dan test area yang diubah.
- Setelah selesai: jalankan /selesai BSD-xx untuk mencatat ke docs/CATATAN_PENGERJAAN.md.
