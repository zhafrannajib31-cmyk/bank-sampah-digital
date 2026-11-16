# CATATAN PENGERJAAN – Bank Sampah Digital

Log kerja proyek: task yang sudah dikerjakan, perubahan yang dilakukan, keputusan, kendala, dan perubahan kebutuhan. Dokumen ini diperbarui **setiap akhir hari kerja/sprint** dan menjadi pasangan dari dokumen BACKLOG (rujukan ID task: BSD-xx).

**Versi:** 1.0  |  **Dibuat:** 11 November 2026  |  **Pengelola:** Project Manager  |  **Terakhir diperbarui:** 12 November 2026

## 1. Cara Menggunakan Dokumen Ini

- Setiap kali task selesai (Done menurut DoD), tambahkan baris di **bagian 4 (Log Pengerjaan)** dan perbarui **bagian 3 (Progres Epic)**.
- Setiap perubahan kode yang relevan dicatat di **bagian 5 (Changelog)** dengan kategori: Added, Changed, Fixed, Removed, Security.
- Keputusan penting masuk **bagian 6**, perubahan kebutuhan masuk **bagian 7**, kendala masuk **bagian 8**.
- Tulis bukti: link Pull Request, commit, issue Jira, atau tangkapan layar.
- Jangan menandai Done sebelum memenuhi Definition of Done di BACKLOG.

## 2. Ringkasan Status Proyek

| Item | Status |
| --- | --- |
| Fase saat ini | Pra-Sprint 1 (persiapan dan perencanaan) |
| Sprint berjalan | Belum dimulai (usulan mulai 16 November 2026) |
| Total task di backlog | 103 task (BSD-01 s.d. BSD-103) |
| Task selesai | 17 dari 103 task backlog (BSD-01 s.d. BSD-17 selesai; dokumen perencanaan, design system, dan prototype nasabah selesai, lihat bagian 4) |
| Blocker aktif | Tidak ada blocker keputusan; keputusan produk/arsitektur utama sudah ditetapkan; validasi mitra BSU (D-09) ditunda sampai akhir MVP |
| Risiko utama | Hanya 1 developer; Bank Sampah Unit (BSU) baru tersedia/diterapkan di akhir MVP sehingga validasi mitra ditunda |

## 3. Progres per Epic

| Epic | Nama | Sprint Rencana | Task Selesai / Total | Status |
| --- | --- | --- | --- | --- |
| E1 | Inisiasi proyek dan setup | 1 | 9 / 9 | Selesai |
| E2 | Analisis kebutuhan dan desain UX | 1 | 8 / 11 | Sedang berjalan |
| E3 | Fondasi backend dan database | 2 | 0 / 8 | Belum mulai |
| E4 | Autentikasi, role, dan keamanan | 2 | 0 / 8 | Belum mulai |
| E5 | Data master | 2–3 | 0 / 7 | Belum mulai |
| E6 | Pencarian dan informasi Bank Sampah | 3 | 0 / 5 | Belum mulai |
| E7 | Pengajuan setoran | 3 | 0 / 7 | Belum mulai |
| E8 | Penimbangan dan transaksi | 4 | 0 / 9 | Belum mulai |
| E9 | Riwayat, saldo, bukti transaksi | 4 | 0 / 5 | Belum mulai |
| E10 | Dashboard dan laporan | 5 | 0 / 4 | Belum mulai |
| E11 | Website publik dan edukasi | 5 | 0 / 4 | Belum mulai |
| E12 | PWA dan non-fungsional | 3–5 | 0 / 6 | Belum mulai |
| E13 | Pengujian, deployment, pilot | 5+ | 0 / 13 | Belum mulai |
| E14 | Fase lanjutan | Pasca-MVP | 0 / 7 | Ditunda |

Legenda status: Belum mulai, Sedang berjalan, Selesai, Terblokir, Ditunda.

## 4. Log Pengerjaan (Task yang Sudah Dikerjakan)

Urutan terbaru di bawah. Format kolom: tanggal, ID task, uraian pekerjaan, pelaksana, hasil/bukti, status.

### Pra-Sprint 1 – Persiapan

| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |
| --- | --- | --- | --- | --- | --- |
| 11 Nov 2026 | – | Menyusun PRD Bank Sampah Digital v1.0 (ruang lingkup, kebutuhan fungsional dan non-fungsional, aturan bisnis, struktur database awal, rencana Scrum) | Tim (SA, PM) | File `PRD_Bank_Sampah_Digital_v1.pdf` | Selesai |
| 11 Nov 2026 | – | Menyusun Product Backlog v1.0 (14 epic, 103 task, rencana 5 sprint) dari PRD v1.0 | PM | Dokumen BACKLOG v1.0 | Selesai |
| 11 Nov 2026 | – | Membuat dokumen Catatan Pengerjaan (dokumen ini) | PM | Dokumen CATATAN PENGERJAAN v1.0 | Selesai |

### Sprint 1 (usulan 16–27 Nov 2026) – Analisis, Desain, Setup

**Sprint Goal:** Kebutuhan tervalidasi, desain awal disetujui, repository dan environment siap dipakai developer.

| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |
| --- | --- | --- | --- | --- | --- |
| 12 Nov 2026 | BSD-01 | Menetapkan peran tim: seluruh peran proyek (PM, Product Owner, Scrum Master, SA 1/2, UI/UX, FE, BE, QA) dikerjakan oleh Zhafran Najib; pemilik keputusan prioritas jelas. | Zhafran Najib | Pembaruan `docs/BACKLOG..md` dan `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md` (D-06, K-03) | Selesai |
| 12 Nov 2026 | BSD-02 | Setup project Jira Scrum: board, workflow (To Do, In Progress, In Review, Testing, Done), dan epic E1–E14 dibuat; task backlog ter-import dengan ID yang sama termasuk epic penjemputan MVP (sesuai konfirmasi). | Zhafran Najib | Konfirmasi pengguna; pembaruan `docs/BACKLOG..md` dan `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md` (bukti Jira eksternal) | Selesai |
| 12 Nov 2026 | BSD-03 | Verifikasi struktur repo (`fe-bsd/`, `be-bsd/`, `docs/` ada; tidak ada `.git` nested/submodule/gitlink), pembuatan branch `develop` lokal; `.gitignore` root ditinjau tanpa perubahan. | Zhafran Najib | `git branch develop`, `git submodule status` kosong, cek `fe-bsd/.git` & `be-bsd/.git` tidak ada; pembaruan `docs/BACKLOG..md` dan `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md` | Selesai (sebagian: branch protection `main` & push `develop`/verifikasi GitHub masih perlu tindakan di GitHub) |
| 12 Nov 2026 | BSD-04 | Inisialisasi/finalisasi frontend `fe-bsd`: tambah `.env.example`, Prettier + `eslint-config-prettier`, scaffold struktur route `src/app/(public|auth)/nasabah/petugas/admin` dan `src/components/ui`, `src/lib/api`, `src/lib/auth` (placeholder), pemindahan beranda ke `(public)`. | Zhafran Najib | `npm run lint`, `npx tsc --noEmit`, `npm run build` lulus; tidak ada `.js/.jsx` di `src/`; pembaruan docs backlog/catatan | Selesai |
| 12 Nov 2026 | BSD-05 | Inisialisasi backend `be-bsd`: tambah `.env.example`, endpoint `GET /health` (`{status:"ok"}`), kerangka `src/modules/` (auth, users, units, waste-categories, waste-prices, deposits, transactions, articles, reports), serta pembaruan test health. | Zhafran Najib | `npm run lint` & `npm test` lulus; verifikasi `start:dev` + `GET /health` mengembalikan `{"status":"ok"}`; pembaruan docs backlog/catatan | Selesai |
| 12 Nov 2026 | BSD-06 | Setup PostgreSQL lokal via `docker-compose.yml`, penyelarasan konfigurasi Prisma 7 (`be-bsd/prisma.config.ts`) & `.env.example`, serta inisialisasi migrasi baseline (`be-bsd/prisma/migrations/00000000000000_init`, `migration_lock.toml`). | Zhafran Najib | `docker-compose.yml` ditambahkan; `npx prisma validate` lulus; Docker CLI tidak tersedia di lingkungan ini sehingga eksekusi `docker compose up -d` dan uji migrasi pada DB kosong perlu diverifikasi di mesin dengan Docker | Selesai (perlu verifikasi eksekusi di lingkungan Docker) |
| 12 Nov 2026 | BSD-07 | Menambahkan workflow CI GitHub Actions (`.github/workflows/ci.yml`) untuk PR/push dengan deteksi perubahan path (`fe-bsd/**`, `be-bsd/**`) serta job lint/test/build FE dan lint/test/build BE sesuai folder yang berubah. | Zhafran Najib | File workflow dibuat; verifikasi "pipeline hijau pada PR percobaan" memerlukan eksekusi PR di GitHub | Selesai (sebagian: menunggu PR percobaan hijau) |
| 12 Nov 2026 | BSD-08 | Menyusun `README.md` (panduan setup dari nol: prasyarat, env, PostgreSQL, migrasi Prisma, perintah dev/lint/test/build) dan `CONTRIBUTING.md` (konvensi branch `feature/BSD-xx-nama-singkat`, Conventional Commits + ID task, alur PR, aturan kualitas). | Zhafran Najib | `README.md` dan `CONTRIBUTING.md` dibuat; isi diselaraskan dengan `AGENTS.md`, script `fe-bsd`/`be-bsd`, dan `.env.example` | Selesai |
| 12 Nov 2026 | BSD-09 | Menyiapkan materi validasi mitra Bank Sampah (daftar pertanyaan, format profil & pencatatan hasil), merangkum temuan survei masyarakat, dan mencatat risiko operasional awal beserta mitigasinya. | Zhafran Najib | `docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md` (materi & temuan awal) dan `docs/RISIKO_OPERASIONAL.md` (R-01 s.d. R-11); task ditutup lewat kriteria "risiko operasional dicatat" | Selesai (wawancara mitra langsung ditunda sampai BSU tersedia di akhir MVP) |
| 12 Nov 2026 | BSD-10 | Menyusun instrumen wawancara pengguna (nasabah, petugas, pengelola unit, admin) dan mengisi temuan awal: masalah utama (catatan kertas, antrean, salah hitung, info lokasi/jam, prosedur, harga), kebutuhan per peran, alur setor antar sendiri, traceability ke FR/NFR, persona/journey, serta rekomendasi PRD v1.1. | Zhafran Najib | `docs/WAWANCARA_PENGGUNA.md` (instrumen + temuan awal, label ASUMSI/KONTEKS); sumber: ringkasan pemilik proyek + konteks survei | Selesai (temuan awal; wawancara langsung & validasi BSU ditunda ke fase pilot) |
| 12 Nov 2026 | BSD-11 | Menyusun PRD v1.1: menetapkan keputusan D-01 s.d. D-05 (antar mandiri MVP, PostgreSQL + NestJS, satu aplikasi role, harga unit menimpa global, pembatalan/koreksi + audit), memasukkan temuan wawancara & risiko, menambah FR-22/FR-23, serta merapikan format tabel/penomoran. Menyelaraskan kriteria backlog BSD-14/15/18/21 agar penjemputan tidak menjadi syarat MVP. | Zhafran Najib | `docs/PRD_Bank_Sampah_Digital_v1.1.md` disetujui Product Owner; keputusan tercermin; kriteria Sprint 1/E3 selaras D-01 | Selesai |
| 12 Nov 2026 | BSD-12 | Menyusun user story dan acceptance criteria P0: 17 story (US-01 s.d. US-17) untuk seluruh FR P0 + kontrol akses, format Given-When-Then, aturan bisnis terkait, dan matriks traceability ke test case PRD 16.1. | Zhafran Najib | `docs/USER_STORIES_P0.md` dibuat; seluruh FR P0 tercakup; AC dapat dilacak ke TC | Selesai |
| 12 Nov 2026 | BSD-13 | Menyusun BPMN alur setoran mandiri, state transition status, 16 use case, matriks hak akses per use case dan endpoint API, serta aturan otorisasi server. Menetapkan kebijakan koreksi/pembatalan pasca-Selesai hanya untuk Admin. | Zhafran Najib | `docs/BPMN_USE_CASE_RBAC.md` disetujui tim/Product Owner | Selesai |
| 12 Nov 2026 | BSD-14 | Menyusun ERD awal & kamus data: 11 entitas MVP, relasi/kardinalitas, alur snapshot & histori harga, index/constraint, pemetaan ke Prisma, serta entitas penjemputan opsional Fase 2. | Zhafran Najib | `docs/ERD_KAMUS_DATA.md` dibuat; seluruh entitas MVP & snapshot harga tercakup | Selesai |
| 12 Nov 2026 | BSD-15 | Menyusun user flow nasabah, petugas, dan admin: diagram alur, peta halaman per role, navigasi antar halaman, state loading/empty/error, dan traceability ke user story. Alur penjemputan tidak digambar untuk MVP. | Zhafran Najib | `docs/USER_FLOW.md` disetujui Product Owner | Selesai |
| 12 Nov 2026 | BSD-16 | Mengimplementasikan design system di repository: memetakan token warna green/brown/blue dan tipografi Poppins ke Tailwind `@theme`, menambahkan font Poppins + `lang="id"`, membuat komponen dasar (`Button`, `Input`, `Card`, `Badge`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState`), halaman pratinjau `/design-system`, dan dokumentasi `docs/DESIGN_SYSTEM.md`. Warna danger `#dc2626` ditambahkan atas persetujuan PO. | Zhafran Najib | `npm run lint`, `npx tsc --noEmit`, `npm run build` lulus; 15 route termasuk `/design-system` berhasil diprerender | Selesai |
| 12 Nov 2026 | BSD-17 | Membuat prototype halaman nasabah di repository: beranda, pilih unit, pilih jenis + estimasi berat, ringkasan estimasi, detail status, riwayat dengan filter, saldo, dan profil ringkas. Data simulasi + store `useSyncExternalStore` dengan `localStorage`, draft di `sessionStorage`, navigasi bawah mobile-first, serta pemisahan tegas estimasi vs nilai final. Route dinamis memakai `useParams` di dalam `<Suspense>` dan nav aktif memakai `usePathname` di dalam `<Suspense>` agar dapat diprerender. | Zhafran Najib | `docs/PROTOTYPE_NASABAH.md` dibuat; `npm run lint`, `npx tsc --noEmit`, `npm run build` lulus (22 route, 2 route dinamis partial prerender) | Selesai |
| *isi* | BSD-03 |  |  |  |  |

(Tambahkan baris sesuai task yang dikerjakan.)

### Sprint 2 (usulan 30 Nov–11 Des 2026) – Fondasi, Auth, Data Master

**Sprint Goal:** Skema database, autentikasi, dan role berfungsi; admin dapat mengelola unit, kategori, dan harga.

| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |
| --- | --- | --- | --- | --- | --- |
| *isi* |  |  |  |  |  |

### Sprint 3 (usulan 14–25 Des 2026) – Pengajuan Setoran

**Sprint Goal:** Nasabah dapat mencari unit dan mengajukan setoran; petugas melihat pengajuan unitnya.

| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |
| --- | --- | --- | --- | --- | --- |
| *isi* |  |  |  |  |  |

### Sprint 4 (usulan 28 Des 2026–8 Jan 2027) – Penimbangan dan Transaksi

**Sprint Goal:** Alur pengajuan sampai transaksi selesai berjalan end-to-end dengan snapshot harga dan riwayat.

| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |
| --- | --- | --- | --- | --- | --- |
| *isi* |  |  |  |  |  |

### Sprint 5 (usulan 11–22 Jan 2027) – Integrasi, Website, Testing

**Sprint Goal:** Website dan dashboard selesai, pengujian end-to-end lulus, siap UAT dan pilot.

| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |
| --- | --- | --- | --- | --- | --- |
| *isi* |  |  |  |  |  |

## 5. Changelog (Perubahan yang Sudah Dikerjakan)

Format mengikuti Keep a Changelog. Versi mengikuti Semantic Versioning (0.x.y selama pengembangan MVP).

### &#91;Belum Dirilis\]

**Added**

- Dokumen PRD v1.0, BACKLOG v1.0, dan CATATAN PENGERJAAN v1.0 (11 Nov 2026).

**Changed**

- [BSD-01][DOCS] Menetapkan peran tim: seluruh peran proyek (termasuk Product Owner dan Scrum Master) dikerjakan oleh Zhafran Najib; pemilik keputusan prioritas ditetapkan.
- [BSD-02][DOCS] Mencatat setup project Jira Scrum (board, workflow, epic E1–E14, dan import task dengan ID sama termasuk penjemputan MVP) sesuai konfirmasi.
- [BSD-03][REPO/DOCS] Verifikasi struktur repo (tanpa nested `.git`/submodule), pembuatan branch `develop` lokal, dan pembaruan status BSD-03 di backlog/catatan (branch protection `main` masih perlu diaktifkan di GitHub).
- [BSD-04][FE] Inisialisasi frontend `fe-bsd`: `.env.example`, Prettier/ESLint config, scaffold struktur route & folder dasar (`app`, `components/ui`, `lib/api`, `lib/auth`), verifikasi lint/tsc/build lulus.
- [BSD-05][BE] Inisialisasi backend `be-bsd`: `.env.example`, endpoint `GET /health` (`{status:"ok"}`), kerangka struktur `src/modules/`, serta test/verifikasi lint & start:dev lulus.
- [BSD-06][DB/REPO] Tambah `docker-compose.yml` PostgreSQL lokal, konfigurasi Prisma (`be-bsd/prisma.config.ts`), dan migrasi baseline (`be-bsd/prisma/migrations/*`) untuk pengelolaan versi skema/migrasi.
- [BSD-07][CI] Tambah workflow GitHub Actions (`.github/workflows/ci.yml`) untuk lint/test/build FE & BE pada PR dengan pembatasan job berdasarkan folder yang berubah.
- [BSD-08][DOCS] Tambah `README.md` (panduan setup dari nol) dan `CONTRIBUTING.md` (konvensi branch/commit, alur PR, standar kualitas).
- [BSD-09][DOCS] Tambah materi validasi mitra Bank Sampah dan temuan awal survei masyarakat (`docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md`) serta log risiko operasional (`docs/RISIKO_OPERASIONAL.md`, R-01 s.d. R-11); BSD-09 ditutup lewat kriteria risiko operasional tercatat, wawancara mitra langsung ditunda sampai BSU tersedia di akhir MVP.
- [BSD-10][DOCS] Tambah instrumen wawancara pengguna & format pencatatan temuan (`docs/WAWANCARA_PENGGUNA.md`), isi temuan awal (masalah utama, kebutuhan per peran, alur setor antar sendiri), matriks traceability ke FR/NFR, persona/journey, dan rekomendasi PRD v1.1 dengan penandaan ASUMSI/KONTEKS; wawancara langsung & validasi BSU ditunda ke fase pilot.
- [BSD-11][DOCS] Tambah `docs/PRD_Bank_Sampah_Digital_v1.1.md`: keputusan D-01 s.d. D-05, MVP antar mandiri (penjemputan Fase 2), PostgreSQL + NestJS, satu aplikasi role, harga unit menimpa global, pembatalan/koreksi + audit, temuan wawancara & risiko, FR-22/FR-23, serta perbaikan format. Selaraskan kriteria BSD-14/15/18/21 dengan D-01 (penjemputan tidak menjadi syarat MVP). **Disetujui Product Owner 12 Nov 2026.**
- [BSD-12][DOCS] Tambah `docs/USER_STORIES_P0.md`: 17 user story P0 (US-01 s.d. US-17) dengan acceptance criteria Given-When-Then, aturan bisnis terkait, dan matriks traceability FR → US → TC.
- [BSD-13][DOCS] Tambah `docs/BPMN_USE_CASE_RBAC.md`: BPMN alur setoran mandiri, state transition, 16 use case, matriks RBAC per use case & endpoint, dan aturan otorisasi; kebijakan koreksi pasca-Selesai hanya Admin.
- [BSD-14][DOCS] Tambah `docs/ERD_KAMUS_DATA.md`: ERD Mermaid, kamus data 11 entitas MVP, relasi/kardinalitas, snapshot & histori harga, index/constraint, pemetaan Prisma, dan entitas penjemputan opsional Fase 2.
- [BSD-15][DOCS] Tambah `docs/USER_FLOW.md`: alur nasabah, petugas, admin, peta halaman per role, navigasi, state loading/empty/error, dan traceability ke user story; disetujui Product Owner.
- [BSD-16][FE/DOCS] Implementasi design system di repository: token warna/tipografi Tailwind (`globals.css`), font Poppins + `lang="id"`, komponen UI reusable (`Button`, `Input`, `Card`, `Badge`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState`), halaman pratinjau `/design-system`, dan `docs/DESIGN_SYSTEM.md`; warna danger `#dc2626` ditambahkan untuk error/aksi destruktif.
- [BSD-17][FE/DOCS] Prototype halaman nasabah di `fe-bsd/src/app/nasabah/` + `fe-bsd/src/features/nasabah/`: alur setoran lengkap (pilih unit → jenis & estimasi berat → ringkasan → konfirmasi → detail), riwayat berfilter, saldo, dan profil ringkas; data simulasi dengan `localStorage`/`sessionStorage`; dokumentasi `docs/PROTOTYPE_NASABAH.md`.

**Fixed**

- *(belum ada)*

### Template Entri Changelog

```
## [0.x.y] - YYYY-MM-DD  (Sprint N)
### Added
- [BSD-xx][FE|BE|DB] Deskripsi fitur baru (PR #nn)
### Changed
- [BSD-xx][FE|BE|DB] Deskripsi perubahan perilaku/struktur (PR #nn)
### Fixed
- [BSD-xx][FE|BE|DB] Deskripsi bug dan penyebabnya (PR #nn)
### Removed
- Deskripsi hal yang dihapus
### Security
- Deskripsi perbaikan keamanan
### Migrasi Database
- Nama file migrasi dan dampaknya
```

## 6. Log Keputusan

| ID | Tanggal | Keputusan / Isu | Opsi | Keputusan Final | Pemilik | Status |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | 11 Nov 2026 | Penjemputan sampah oleh petugas (brief proyek) vs antar mandiri (PRD v1.0) | (a) MVP antar mandiri, penjemputan Fase 2; (b) penjemputan masuk MVP | **Opsi (a): MVP antar mandiri, penjemputan Fase 2** | Product Owner | Diputuskan (12 Nov 2026) |
| D-02 | 11 Nov 2026 | Backend: Supabase (PRD) vs PostgreSQL dengan API sendiri di `be-bsd` | (a) Supabase; (b) PostgreSQL + API sendiri | **Opsi (b): PostgreSQL + REST API NestJS di `be-bsd`** | Developer + PM | Diputuskan (12 Nov 2026) |
| D-03 | 11 Nov 2026 | Petugas memakai PWA yang sama atau dashboard web terpisah | (a) Satu aplikasi berbasis role; (b) terpisah | **Opsi (a): satu aplikasi PWA berbasis role** | Tim | Diputuskan (12 Nov 2026) |
| D-04 | 11 Nov 2026 | Aturan prioritas harga (unit vs global) | Harga unit menimpa global | **Harga unit menimpa harga global** | Admin/mitra | Diputuskan (12 Nov 2026) |
| D-05 | 11 Nov 2026 | Status Dibatalkan dan alur koreksi transaksi | Masuk MVP atau ditunda | **Masuk MVP**; wajib alasan + jejak audit di `transaction_events` | Product Owner | Diputuskan (12 Nov 2026) |
| D-06 | 11 Nov 2026 | Penetapan Product Owner dan Scrum Master | – | Zhafran Najib mengerjakan seluruh peran (termasuk PO dan Scrum Master); pemilik keputusan prioritas: Zhafran Najib | Zhafran Najib | Selesai (12 Nov 2026) |
| D-07 | 11 Nov 2026 | Mitra Bank Sampah untuk pilot | – | Bank Sampah Unit (BSU) baru tersedia/diterapkan di akhir MVP; validasi mitra langsung ditunda sampai fase pilot, desain sementara memakai asumsi eksplisit + data simulasi bertanda | PM + SA | Ditunda (menunggu BSU akhir MVP) |
| D-11 | 12 Nov 2026 | Media implementasi design system BSD-16 | (a) Figma; (b) token + komponen langsung di repository | **Opsi (b): implementasi di repository** (`globals.css`, `components/ui`, `docs/DESIGN_SYSTEM.md`, pratinjau `/design-system`); nomor mengikuti BACKLOG v2.1 | Product Owner | Diputuskan (12 Nov 2026) |
| D-12 | 12 Nov 2026 | Media prototype halaman nasabah BSD-17 | (a) Figma; (b) halaman Next.js + data simulasi di repository | **Opsi (b): prototype di repository** dengan data simulasi + `localStorage`/`sessionStorage`, dokumentasi `docs/PROTOTYPE_NASABAH.md` | Product Owner | Diputuskan (12 Nov 2026) |
| D-13 | 16 Nov 2026 | Peran QR pada layar "Tahap 8 · Konfirmasi QR Nasabah" (Figma, Prototype Mobile): nasabah menyetujui hasil timbang atau tidak | (a) QR hanya identifikasi; petugas memindai lalu mengonfirmasi, status Selesai hanya oleh petugas, selisih disampaikan ke petugas (batal sebelum Selesai); (b) nasabah menyetujui hasil timbang / mengajukan keberatan lewat aplikasi sebelum Selesai | **Opsi (a), usulan Developer:** sesuai BPMN BSD-13 (Selesai = petugas konfirmasi, atomik & idempotent) dan aturan bisnis 4; opsi (b) menambah status/alur sengketa di luar PRD v1.1. Figma diubah: tombol "Setujui Hasil Timbang" dan "Ajukan Keberatan" dihapus, diganti "Lihat Status Setoran"; total ditandai "sementara". Halaman Backup di Figma menyimpan versi sebelumnya. Batas waktu QR belum ditetapkan | Product Owner | Diusulkan (16 Nov 2026), menunggu persetujuan PO |
| D-14 | 16 Nov 2026 | Penjemputan (Pickup) oleh petugas: tetap Fase 2 (D-01) atau masuk MVP | (a) Tetap Fase 2, MVP hanya antar mandiri; (b) Pickup masuk MVP bersama Antar Sendiri | **Opsi (b), usulan dari permintaan pengguna pada sesi prototype:** halaman Pickup dibuat di Figma "Prototype PWA" (Nasabah: Metode Setor, Atur Pickup, Status Penjemputan 7 tahap, Hubungi Petugas, Lihat di Peta; Petugas: Detail Pickup, Tugaskan Petugas, Status Pickup, Hubungi Nasabah, Rute Pickup, tab Diproses per tahap). Data petugas, armada, dan lokasi = SIMULASI. Jika disetujui, membalik sebagian D-01 dan perlu pembaruan PRD v1.1, BPMN BSD-13, USER_FLOW, ERD, aturan bisnis (status tahap penjemputan), serta kriteria BACKLOG BSD-14/15/18/21 | Product Owner | Diusulkan (16 Nov 2026), menunggu konfirmasi PO |

## 7. Log Perubahan Kebutuhan (Change Request)

| ID | Tanggal | Perubahan yang Diminta | Dampak (scope, jadwal, biaya) | Disetujui oleh | Status |
| --- | --- | --- | --- | --- | --- |
| CR-01 | 11 Nov 2026 | Brief proyek meminta petugas "mengambil sampah" sedangkan PRD v1.0 mengecualikan penjemputan dari MVP | Jika masuk MVP: tambah epic penjemputan (± 21 SP), geser jadwal, perlu aturan penugasan dan status baru | Product Owner | Diputuskan (D-01): penjemputan Fase 2, tidak masuk MVP |
| CR-02 | 11 Nov 2026 | Penggantian referensi Supabase di PRD menjadi PostgreSQL dengan backend `be-bsd`; RLS diganti guard di API | Perlu pembaruan PRD bagian 10, 11, dan 18 | Product Owner | Diputuskan (D-02): PostgreSQL + NestJS + Prisma, guard di API |
| CR-03 | 16 Nov 2026 | Pickup masuk MVP (membalik keputusan CR-01/D-01) setelah tinjauan prototype Figma | Tambah epic penjemputan (± 21 SP menurut CR-01), status/tahap penjemputan, dan penugasan petugas; perbarui PRD/BPMN/USER_FLOW/ERD/BACKLOG; jadwal dan estimasi perlu dihitung ulang | Product Owner | Diusulkan (D-14), menunggu konfirmasi PO; dokumen turunan belum diperbarui |

## 8. Kendala dan Risiko Berjalan

| ID | Tanggal | Kendala/Risiko | Dampak | Tindakan | PIC | Status |
| --- | --- | --- | --- | --- | --- | --- |
| K-01 | 11 Nov 2026 | Hanya 1 Software Developer untuk FE dan BE | Risiko keterlambatan Sprint 2–5 | Fokus P0, batasi WIP, evaluasi tambahan developer | PM | Terbuka |
| K-02 | 11 Nov 2026 | Mitra Bank Sampah belum tersedia; BSU direncanakan diterapkan di akhir MVP | Validasi mitra dan data aktual (harga, jam, kapasitas) tertunda | BSD-09 ditutup lewat kriteria risiko operasional tercatat (`docs/RISIKO_OPERASIONAL.md`); desain memakai asumsi eksplisit + data simulasi bertanda; validasi aktual pada fase pilot/akhir MVP | PM/SA | Terbuka (diterima sebagai asumsi) |
| K-03 | 11 Nov 2026 | Product Owner belum ditetapkan | Prioritas backlog tidak punya pemilik | Ditetapkan pada BSD-01 (Zhafran Najib sebagai PO/pemilik prioritas) | Zhafran Najib | Selesai |

## 9. Catatan Sprint Review dan Retrospective

### Template Sprint Review

- Sprint Goal tercapai? (Ya / Sebagian / Tidak)
- Task selesai (ID dan ringkasan):
- Task tidak selesai dan alasan (dipindah ke sprint mana):
- Demo yang ditunjukkan dan umpan balik pemangku kepentingan:
- Velocity (SP selesai / SP direncanakan):
- Perubahan backlog setelah review:

### Template Retrospective

| Yang berjalan baik | Yang perlu diperbaiki | Aksi perbaikan | PIC | Tenggat |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### Rekap Velocity

| Sprint | SP Direncanakan | SP Selesai | Catatan |
| --- | --- | --- | --- |
| 1 | ± 55 | – |  |
| 2 | ± 70 | – |  |
| 3 | ± 70 | – |  |
| 4 | ± 65 | – |  |
| 5 | ± 80 | – |  |

## 10. Catatan Rilis dan Migrasi Database

| Versi | Tanggal | Lingkungan | Isi Rilis | Migrasi DB | Hasil Verifikasi |
| --- | --- | --- | --- | --- | --- |
| *belum ada* |  |  |  |  |  |

## 11. Bug dan Perbaikan

| ID Bug | Tanggal Ditemukan | Deskripsi | Tingkat (Kritis/Tinggi/Sedang/Rendah) | Terkait Task | Penyebab dan Perbaikan | Tanggal Selesai | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| *belum ada* |  |  |  |  |  |  |  |

## 12. Riwayat Revisi Dokumen

| Versi | Tanggal | Perubahan | Oleh |
| --- | --- | --- | --- |
| 1.0 | 11 Nov 2026 | Pembuatan dokumen, pencatatan pekerjaan perencanaan, keputusan terbuka, dan change request awal | Project Manager |
| 1.1 | 12 Nov 2026 | Tambah log BSD-16 (design system), progres 16/103 & E2 7/11, changelog BSD-16, dan keputusan D-11 | Zhafran Najib |
| 1.2 | 12 Nov 2026 | Tambah log BSD-17 (prototype nasabah), progres 17/103 & E2 8/11, changelog BSD-17, dan keputusan D-12 | Zhafran Najib |
| 1.3 | 16 Nov 2026 | Tambah keputusan D-13 (peran QR Tahap 8, status diusulkan) | Zhafran Najib |
| 1.4 | 16 Nov 2026 | Tambah usulan D-14 dan CR-03 (Pickup masuk MVP, menunggu konfirmasi PO) | Zhafran Najib |
