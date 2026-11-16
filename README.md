# Bank Sampah Digital (BSD)

Platform digital untuk pengelolaan setoran sampah. Nasabah mengajukan setoran, petugas menimbang & mengonfirmasi transaksi, dan admin mengelola data master.  
MVP difokuskan pada **sistem aplikasi web/PWA berbasis peran** (nasabah, petugas, admin); website publik/edukasi dikembangkan terpisah sesuai prioritas backlog.

## Struktur repository

```text
.
├── fe-bsd/               # Frontend Next.js (App Router, TypeScript, Tailwind) - PWA & UI per role
├── be-bsd/               # Backend REST API (NestJS + TypeScript) - Prisma + PostgreSQL
├── docs/                 # PRD, backlog, catatan pengerjaan, dan dokumen proyek
├── .github/workflows/    # CI GitHub Actions
├── docker-compose.yml    # PostgreSQL lokal untuk pengembangan
├── AGENTS.md             # Aturan proyek & konteks kerja
└── CONTRIBUTING.md       # Panduan kontribusi (branch, commit, workflow)
```

## Prasyarat

- **Git**
- **Node.js** dan **npm** (disarankan Node.js LTS; gunakan versi yang kompatibel dengan dependensi proyek)
- **Docker + Docker Compose** (opsional tetapi direkomendasikan untuk menjalankan PostgreSQL lokal via `docker-compose.yml`)
- Akses terminal/PowerShell (panduan contoh menggunakan perintah umum; sesuaikan bila perlu)

## Setup dari nol

### 1. Clone repository

```bash
git clone <url-repo-bank-sampah-digital>
cd bank-sampah-digital
```

### 2. Siapkan environment variable

Salin file contoh env lalu sesuaikan jika diperlukan:

```bash
# Frontend
cp fe-bsd/.env.example fe-bsd/.env.local

# Backend
cp be-bsd/.env.example be-bsd/.env
```

**Frontend (`fe-bsd/.env.example`)**
- `NEXT_PUBLIC_API_URL` — URL base API backend (default contoh: `http://localhost:3001`)

**Backend (`be-bsd/.env.example`)**
- `PORT` — port server API (default: `3000`)
- `DATABASE_URL` — koneksi PostgreSQL (default selaras dengan `docker-compose.yml`)

> Jangan commit file `.env`, `.env.local`, atau rahasia lainnya.

### 3. Install dependensi

```bash
# Frontend
cd fe-bsd
npm install

# Backend
cd ../be-bsd
npm install
```

### 4. Jalankan PostgreSQL lokal

Dari root repository:

```bash
docker compose up -d
```

Layanan PostgreSQL akan berjalan dengan konfigurasi default pada `docker-compose.yml` (database: `bank_sampah_digital`, user/password: `postgres`).

> Jika Docker tidak tersedia, siapkan PostgreSQL lokal secara manual dan sesuaikan `DATABASE_URL` di `be-bsd/.env`.

### 5. Jalankan migrasi database (Prisma)

Setelah database aktif dan `DATABASE_URL` benar:

```bash
cd be-bsd
npx prisma migrate deploy
```

Untuk pengembangan skema (membuat/menerapkan migrasi baru), gunakan:

```bash
cd be-bsd
npx prisma migrate dev --name <nama_migrasi>
```

> **Catatan:** jangan menjalankan `prisma migrate reset` tanpa persetujuan. Migrasi yang sudah ter-commit tidak boleh diubah; buat migrasi baru jika diperlukan.

### 6. Jalankan aplikasi

**Backend API**
```bash
cd be-bsd
npm run start:dev
```
- Default: `http://localhost:3000`
- Health check: `GET /health` → `{ "status": "ok" }`

**Frontend**
```bash
cd fe-bsd
npm run dev
```
- Default Next.js dev server: `http://localhost:3000` (jika port bentrok, Next.js akan memilih port lain; sesuaikan `NEXT_PUBLIC_API_URL` di FE agar mengarah ke backend)

## Perintah penting

### Frontend (`fe-bsd`)
```bash
npm run dev           # Jalankan development server
npm run build         # Build production
npm run start         # Jalankan hasil build
npm run lint          # ESLint
npm run format        # Format dengan Prettier
npm run format:check  # Cek format Prettier
```

### Backend (`be-bsd`)
```bash
npm run start:dev     # Jalankan API (watch mode)
npm run build         # Build NestJS
npm run start         # Jalankan aplikasi
npm run start:prod    # Jalankan hasil build (dist)
npm run lint          # Oxlint
npm test              # Unit test (Jest)
npm run test:e2e      # E2E test
npm run format        # Format kode (Prettier)
```

### Database (root / `be-bsd`)
```bash
docker compose up -d                  # Jalankan PostgreSQL lokal
cd be-bsd && npx prisma validate      # Validasi schema/config Prisma
cd be-bsd && npx prisma migrate deploy
```

## Konvensi & kontribusi

- **Branch**: `feature/BSD-xx-nama-singkat`
- **Commit**: Conventional Commits + ID task, contoh: `feat(be): add price snapshot [BSD-58]`
- **Satu sesi/PR idealnya fokus pada satu task** (`BSD-xx`) sesuai backlog
- Jalankan lint/test area yang diubah sebelum menyelesaikan task
- Jangan menambah dependency baru tanpa konfirmasi
- Jangan commit `.env`/rahasia, jangan `git push`/hapus massal/reset database tanpa persetujuan

Detail lengkap: lihat [`CONTRIBUTING.md`](CONTRIBUTING.md) dan [`AGENTS.md`](AGENTS.md).

## Dokumen proyek

- `docs/PRD_Bank_Sampah_Digital_v1.1.md` — Product Requirements Document (versi aktif, disetujui 12 Nov 2026)
- `docs/PRD_Bank_Sampah_Digital_v1.md` — PRD v1.0 (histori)
- `docs/USER_STORIES_P0.md` — User story & acceptance criteria P0 (Given-When-Then)
- `docs/BPMN_USE_CASE_RBAC.md` — BPMN alur setoran, use case, dan matriks hak akses
- `docs/ERD_KAMUS_DATA.md` — ERD awal, kamus data, dan pemetaan Prisma
- `docs/USER_FLOW.md` — User flow nasabah, petugas, dan admin
- `docs/DESIGN_SYSTEM.md` — Token warna/tipografi, komponen UI, badge status, dan state
- `docs/PROTOTYPE_NASABAH.md` — Prototype halaman nasabah: peta halaman, alur, data simulasi, estimasi vs nilai final
- `docs/BACKLOG..md` — Backlog/task (BSD-xx)
- `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md` — Log pengerjaan, progres, changelog, keputusan
- `docs/WAWANCARA_PENGGUNA.md` — Instrumen wawancara & temuan awal pengguna
- `docs/RISIKO_OPERASIONAL.md` — Log risiko operasional & mitigasi (R-01 s.d. R-11)
- `docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md` — Materi validasi & temuan survei mitra

> Rujuk bagian spesifik yang relevan saat mengerjakan task (hindari membaca seluruh dokumen bila tidak diperlukan).
