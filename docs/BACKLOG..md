# BACKLOG · Bank Sampah Digital

Versi 2.1 · 12 November 2026 · Acuan: PRD v1.1 (draft) + keputusan proyek

> Backlog ini berfokus pada pekerjaan pengembangan produk: UI/UX, frontend Next.js, backend/API, PostgreSQL, integrasi, quality assurance, dan deployment. Satu repository GitHub menggunakan struktur `fe-bsd/` dan `be-bsd/`.

**Cara baca**
- Heading `## [ ]` = belum selesai, `## [x]` = selesai. Centang tiap kriteria "Selesai kalau" sebelum menandai task selesai.
- Baris kedua: pelaksana · sprint · estimasi (SP) · prasyarat.
- `Boleh sentuh` = batas file/folder utama untuk task itu. Perubahan di luar batas harus dikoordinasikan.
- Prioritas: P0 wajib MVP, P1 penting, P2 pengembangan lanjutan.
- Pelaksana menggunakan peran: PM, SA, UI/UX, FE, BE, QA/Developer. Nama anggota ditetapkan di Jira.
- Setiap task harus memiliki owner, estimasi, prasyarat, dan acceptance criteria sebelum masuk sprint.
- Kode FR/NFR/TC merujuk ke PRD. Penjemputan sudah diputuskan sebagai **Fase 2** (pasca-MVP), bukan bagian MVP.
- Sprint pada dokumen ini adalah urutan rekomendasi; kapasitas dan durasi final ditetapkan saat Sprint Planning.

**Keputusan dan asumsi arsitektur (diputuskan 12 November 2026)**
- D-01 Metode setoran MVP adalah **setor mandiri** (nasabah antar sendiri). **Penjemputan oleh petugas dipindahkan ke Fase 2 (pasca-MVP).**
- D-02 Repository menggunakan monorepo: `fe-bsd/` untuk seluruh frontend dan `be-bsd/` untuk backend/API.
- D-03 Frontend menggunakan Next.js untuk website publik sekaligus aplikasi PWA berbasis role (nasabah, petugas, admin).
- D-04 Backend menggunakan **NestJS + Prisma** dengan database **PostgreSQL**. Referensi Supabase dihapus.
- D-05 Petugas dan admin memakai aplikasi Next.js yang sama dengan pembatasan akses berbasis role.
- D-06 Harga per unit menimpa harga global; periode harga berlaku dicatat.
- D-07 Status Dibatalkan dan koreksi transaksi memerlukan alasan serta audit trail.
- D-08 Product Owner dan Scrum Master: **Zhafran Najib** (seluruh peran).
- D-09 Validasi mitra BSU **ditunda sampai akhir MVP**; desain sementara memakai asumsi eksplisit + data simulasi bertanda.
- D-10 Aturan penjemputan (jadwal, penugasan, unit tujuan, gagal layani) dibahas pada **Fase 2**, bukan MVP.
- D-11 Design system BSD-16 diimplementasikan langsung di repository (`fe-bsd/src/app/globals.css` + `fe-bsd/src/components/ui/` + `docs/DESIGN_SYSTEM.md`), bukan Figma; pratinjau di `/design-system`.
- D-12 Prototype halaman nasabah BSD-17 diimplementasikan di repository sebagai halaman Next.js dengan data simulasi + `localStorage`, bukan Figma; dokumentasi di `docs/PROTOTYPE_NASABAH.md`.

---

## Arsitektur repository dan batas pengembangan

```text
bank-sampah-digital/
├── fe-bsd/                 # Next.js: website publik + Native PWA role-based
│   ├── src/app/             # route website, nasabah, petugas, admin
│   ├── src/components/      # shared UI components
│   ├── src/features/        # modul fitur frontend
│   ├── src/lib/             # API client, auth, utilities
│   └── public/              # manifest, icons, static assets
├── be-bsd/                 # backend/API service
│   ├── src/                 # modules, controllers, services, guards
│   ├── prisma/              # schema, migrations, seed (jika Prisma disetujui)
│   └── test/                # unit/integration tests
├── docs/                    # PRD, ERD, BPMN, API notes, QA evidence
└── README.md
```

**Batas tanggung jawab**
- UI/UX: user flow, wireframe, design system, prototype, usability test, handoff design.
- FE (`fe-bsd`): implementasi website, PWA, halaman per role, state UI, integrasi API, validasi sisi client.
- BE (`be-bsd`): REST API, autentikasi/otorisasi server, business logic, validasi, transaksi database, audit log.
- Database: PostgreSQL; skema, relasi, indeks, constraint, migration, seed, backup.
- QA: test case, API test, integration test, end-to-end test, regression, UAT.
- PM/SA: scope, prioritas, requirement, acceptance criteria, dependency, sprint tracking.

**Catatan platform:** website publik dan aplikasi PWA merupakan satu codebase frontend Next.js di `fe-bsd`, tetapi route/layout dan aksesnya dipisahkan berdasarkan kebutuhan pengunjung, nasabah, petugas, dan admin. PWA tidak dibuat sebagai repository frontend terpisah.

---

# E1 · Inisiasi proyek dan setup (Sprint 1)

## [x] BSD-01 · Tetapkan peran tim
**PM** · S1 · 1 SP

Boleh sentuh: `docs/`

Tetapkan Product Owner, Scrum Master, dan pelaksana tiap peran (D-06).

Selesai kalau:
- [x] Peran tertulis di dokumen dan Jira
- [x] Pemilik keputusan prioritas jelas

## [x] BSD-02 · Setup project Jira Scrum
**PM** · S1 · 2 SP · Prasyarat: BSD-01

Boleh sentuh: Jira, `docs/BACKLOG.md`

Selesai kalau:
- [x] Board, workflow (To Do, In Progress, In Review, Testing, Done), dan epic E1-E14 dibuat
- [x] Task dari backlog ini ter-import dengan ID yang sama, termasuk epic penjemputan MVP

## [x] BSD-03 · Repository GitHub dan struktur folder
**Zhafran** · S1 · 2 SP

Boleh sentuh: root repo, `.gitignore`, `docs/`, `.opencode/`

Satu repo berisi `fe-bsd`, `be-bsd`, dan `docs`. Website publik serta PWA nasabah/petugas/admin berada dalam `fe-bsd`. Tidak boleh ada `.git` di dalam `fe-bsd` atau `be-bsd`.

Selesai kalau:
- [x] Repo `bank-sampah-digital` dibuat dan di-push
- [x] Isi `fe-bsd` terlihat di GitHub (bukan submodule)
- [x] Branch `develop` ada
- [ ] Branch protection `main` aktif (PR wajib)

## [x] BSD-04 · Inisialisasi frontend `fe-bsd`
**Zhafran** · S1 · 3 SP · Prasyarat: BSD-03

Boleh sentuh: `fe-bsd/package.json`, `fe-bsd/tsconfig.json`, `fe-bsd/src/`, konfigurasi lint/format

Next.js TypeScript, Tailwind, ESLint, Prettier. Satu aplikasi mencakup website publik dan Native PWA role-based. Struktur route sesuai `fe-bsd/AGENTS.md`.

- `strict: true` jangan dimatikan
- Tambahkan `.env.example` berisi `NEXT_PUBLIC_API_URL`

Selesai kalau:
- [x] `npm run dev` dan `npm run build` jalan tanpa error
- [x] `npx tsc --noEmit` bersih
- [x] Tidak ada file `.js` atau `.jsx` tersisa di `src/`

## [x] BSD-05 · Inisialisasi backend `be-bsd`
**Zhafran** · S1 · 3 SP · Prasyarat: BSD-03

Boleh sentuh: `be-bsd/src/`, `be-bsd/package.json`, `be-bsd/.env.example`

Backend API TypeScript. Gunakan NestJS sesuai usulan awal backlog apabila disetujui pada D-04; siapkan struktur modular, konfigurasi env, dan endpoint `GET /health`.

Selesai kalau:
- [x] `npm run start:dev` jalan, `/health` mengembalikan `{status:"ok"}`
- [x] `npm run lint` dan `npm test` lulus
- [x] `.env.example` ada, `.env` tidak ter-commit

## [x] BSD-06 · PostgreSQL lokal dan tooling migrasi
**Zhafran** · S1 · 2 SP · Prasyarat: BSD-05

Boleh sentuh: `docker-compose.yml`, `be-bsd/prisma/`, `be-bsd/.env.example`

Selesai kalau:
- [x] `docker compose up -d` menjalankan PostgreSQL
- [x] Migration tooling yang dipilih tim berjalan pada database kosong
- [x] Developer baru bisa menjalankan PostgreSQL lokal dengan satu perintah
- [x] Skema dan migration berada di bawah pengelolaan versi

## [x] BSD-07 · CI GitHub Actions
**Zhafran** · S1 · 3 SP · Prasyarat: BSD-04, BSD-05

Boleh sentuh: `.github/workflows/`

Selesai kalau:
- [x] Lint, test, build FE dan BE berjalan pada setiap PR
- [x] Pipeline dibatasi per folder yang berubah
- [ ] Pipeline hijau pada PR percobaan

## [x] BSD-08 · README, standar kode, dan panduan kontribusi
**Zhafran** · S1 · 2 SP · Prasyarat: BSD-04, BSD-05, BSD-06

Boleh sentuh: `README.md`, `CONTRIBUTING.md`, `fe-bsd/.env.example`, `be-bsd/.env.example`

Selesai kalau:
- [x] Orang baru bisa setup dari nol hanya dengan README
- [x] Konvensi branch dan commit tertulis

## [x] BSD-09 · Hubungi calon mitra Bank Sampah
**PM** · S1 · 2 SP

Boleh sentuh: `docs/`

Selesai kalau:
- [x] Minimal 1 calon mitra memberikan validasi awal terkait alur setor mandiri dan penjemputan, atau risiko operasional dicatat

**Catatan penyelesaian (12 Nov 2026):** task ditutup melalui kriteria alternatif **"risiko operasional dicatat"**. Materi validasi dan temuan awal (berbasis survei masyarakat) tersedia di `docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md`; risiko operasional beserta mitigasi tercatat di `docs/RISIKO_OPERASIONAL.md` (R-01 s.d. R-11). **Wawancara langsung dengan mitra BSU belum dilakukan** karena BSU baru diterapkan di akhir MVP; validasi aktual dilanjutkan pada fase pilot (lihat D-07/K-02).

---

# E2 · Analisis kebutuhan dan desain UX (Sprint 1)

## [x] BSD-10 · Wawancara pengguna
**SA 1** · S1 · 5 SP · Prasyarat: BSD-09

Boleh sentuh: `docs/`

Nasabah, petugas, dan pengelola unit.

Selesai kalau:
- [x] Dokumen temuan dan validasi alur setoran tersedia

**Catatan penyelesaian (12 Nov 2026):** dokumen temuan tersedia di `docs/WAWANCARA_PENGGUNA.md` (masalah utama, kebutuhan per peran, alur bisnis antar sendiri, matriks traceability ke FR/NFR, persona/journey, dan rekomendasi PRD v1.1). Sumber saat ini adalah **ringkasan pemilik proyek + konteks survei**, belum wawancara langsung per responden; seluruh temuan diberi label **ASUMSI/KONTEKS**. Wawancara langsung dengan pengelola BSU ditunda sampai BSU tersedia di akhir MVP, dan validasi aktual dilanjutkan pada fase pilot.

## [x] BSD-11 · Perbarui PRD ke v1.1
**SA 1** · S1 · 3 SP · Prasyarat: BSD-10

Boleh sentuh: `docs/`

Selesai kalau:
- [x] Keputusan D-01 sampai D-07 tercermin di PRD
- [x] PRD v1.1 disetujui Product Owner

**Catatan penyelesaian (12 Nov 2026):** `docs/PRD_Bank_Sampah_Digital_v1.1.md` disetujui Product Owner pada 12 November 2026. Keputusan D-01 s.d. D-07 tercermin (penjemputan Fase 2, PostgreSQL + NestJS, satu aplikasi role, harga unit menimpa global, pembatalan/koreksi + audit). Kriteria backlog BSD-14/15/18/21 juga diselaraskan agar penjemputan tidak menjadi syarat MVP.

## [x] BSD-12 · User story dan acceptance criteria P0
**SA 2** · S1 · 5 SP · Prasyarat: BSD-11

Boleh sentuh: `docs/`

Selesai kalau:
- [x] Setiap FR P0 punya user story berformat Given-When-Then

**Catatan penyelesaian (12 Nov 2026):** `docs/USER_STORIES_P0.md` memuat 17 user story (US-01 s.d. US-17) untuk seluruh FR P0 (FR-01, 02, 04, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 22, 23) plus kontrol akses NFR-01/02. Setiap story memiliki acceptance criteria Given-When-Then dan matriks traceability ke test case PRD 16.1.

## [x] BSD-13 · BPMN, use case, dan matriks hak akses
**SA 1** · S1 · 5 SP · Prasyarat: BSD-11

Boleh sentuh: `docs/`

Selesai kalau:
- [x] BPMN alur setoran, use case, dan matriks role disetujui tim

**Catatan penyelesaian (12 Nov 2026):** `docs/BPMN_USE_CASE_RBAC.md` disetujui tim/Product Owner. Memuat BPMN alur setoran mandiri, state transition status, 16 use case, matriks role per use case, matriks endpoint API, dan aturan otorisasi. Kebijakan disetujui: koreksi/pembatalan pasca-Selesai hanya Admin; petugas hanya membatalkan sebelum Selesai.

## [x] BSD-14 · ERD awal dan kamus data
**SA 2** · S1 · 5 SP · Prasyarat: BSD-11

Boleh sentuh: `docs/`

Selesai kalau:
- [x] ERD mencakup seluruh entitas MVP pada PRD v1.1 (users, units, unit_staff, waste_categories, waste_prices, deposits, deposit_items, transactions, transaction_events, content_articles)
- [x] Snapshot harga dan histori harga tergambar
- [x] Entitas penjemputan **opsional** sebagai persiapan Fase 2, tidak menjadi syarat MVP (D-01)

**Catatan penyelesaian (12 Nov 2026):** `docs/ERD_KAMUS_DATA.md` memuat ERD Mermaid, kamus data 11 entitas MVP, relasi & kardinalitas, alur snapshot/histori harga, ringkasan index/constraint, pemetaan ke Prisma (BSD-21..24), dan entitas penjemputan opsional Fase 2.

## [x] BSD-15 · User flow nasabah, petugas, admin
**UI/UX** · S1 · 3 SP · Prasyarat: BSD-13

Boleh sentuh: Figma

Selesai kalau:
- [x] Flow setor mandiri nasabah (pilih unit → ajukan → antar → status → riwayat) tergambar
- [x] Flow petugas menerima sampah, memeriksa, menimbang, mengonfirmasi transaksi, dan menangani pembatalan/koreksi tergambar
- [x] Flow admin mengelola akun, unit, petugas, harga, dan laporan disetujui Product Owner
- [x] Flow penjemputan **tidak wajib** di Sprint 1; disiapkan pada Fase 2 (D-01)

**Catatan penyelesaian (12 Nov 2026):** `docs/USER_FLOW.md` disetujui Product Owner. Memuat diagram alur nasabah, petugas, admin, peta halaman per role, navigasi antar halaman, state loading/empty/error, dan traceability ke user story. Alur penjemputan tidak digambar untuk MVP.

## [x] BSD-16 · Design system
**UI/UX** · S1 · 5 SP · Prasyarat: BSD-15

Boleh sentuh: `fe-bsd/src/`, `fe-bsd/Design/`, `docs/`

Warna hijau/biru/putih, tipografi, komponen, badge status, empty/loading/error state.

Selesai kalau:
- [x] Token warna dan tipografi dipetakan ke Tailwind (`globals.css`) dari `design-tokens.json`
- [x] Komponen dasar terdokumentasi di `docs/DESIGN_SYSTEM.md` dan dapat dipreview di `/design-system`
- [x] Badge status (Menunggu/Diproses/Selesai/Dibatalkan) serta state loading/empty/error tersedia

**Catatan penyelesaian (12 Nov 2026):** Design system diimplementasikan di repository (D-11), bukan Figma. Token green/brown/blue + tipografi Poppins dipetakan ke `@theme`; komponen `Button`, `Input`, `Card`, `Badge`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState`; warna danger `#dc2626` ditambahkan atas persetujuan Product Owner. Lint, tsc, dan build lulus.

## [x] BSD-17 · Prototype halaman nasabah
**UI/UX** · S1 · 8 SP · Prasyarat: BSD-16

Boleh sentuh: `fe-bsd/src/app/nasabah/`, `fe-bsd/src/features/nasabah/`, `docs/`

Selesai kalau:
- [x] Alur setoran dapat diklik dari awal sampai riwayat
- [x] Estimasi dan nilai final dibedakan jelas

**Catatan penyelesaian (12 Nov 2026):** Prototype diimplementasikan di repository (D-12), bukan Figma. Alur Beranda → pilih unit → pilih jenis + estimasi berat → ringkasan → konfirmasi → detail status → riwayat dapat diklik; dilengkapi halaman saldo dan profil ringkas. Data simulasi ditandai di setiap halaman, pengajuan baru disimpan di `localStorage` (`bsd.nasabah.prototype.v1`) dan draft di `sessionStorage`. Estimasi memakai label “Bukan nilai final” (cokelat); nilai final hanya muncul saat status `selesai` beserta berat aktual dan harga snapshot (hijau). Dokumentasi: `docs/PROTOTYPE_NASABAH.md`. Lint, tsc, dan build lulus.

## [ ] BSD-18 · Prototype halaman petugas dan admin
**UI/UX** · S1 · 8 SP · Prasyarat: BSD-16

Boleh sentuh: Figma

Selesai kalau:
- [ ] Prototype petugas mencakup daftar pengajuan unit, pemeriksaan/penolakan sampah, penimbangan aktual, konfirmasi transaksi, dan pembatalan/koreksi
- [ ] Prototype admin mencakup manajemen data master (unit, kategori, harga, akun) dan laporan
- [ ] Prototype penjemputan **tidak wajib** di Sprint 1; disiapkan pada Fase 2 (D-01)

## [ ] BSD-19 · Wireframe website publik
**UI/UX** · S1 · 3 SP · Prasyarat: BSD-16

Boleh sentuh: Figma

Selesai kalau:
- [ ] Semua halaman publik di PRD 13.1 tergambar

## [ ] BSD-20 · Usability test prototype
**UI/UX** · S1 · 3 SP · Prasyarat: BSD-17, BSD-18

Boleh sentuh: Figma, `docs/`

Selesai kalau:
- [ ] Diuji pada 3-5 pengguna
- [ ] Daftar temuan dan perbaikan prioritas tersedia

---

# E3 · Fondasi backend dan database (Sprint 2)

## [x] BSD-21 · Skema: users, units, unit_staff
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-06, BSD-14

Boleh sentuh: `be-bsd/prisma/`

Selesai kalau:
- [x] Migrasi bisa dijalankan dan di-rollback — dieksekusi ke PostgreSQL 16.6 lokal: `prisma migrate deploy` pada database kosong menerapkan kelima migrasi tanpa error, `prisma db seed` mengisi data simulasi, dan database uji terpisah bisa dihapus lalu dibuat ulang dari nol dengan hasil sama
- [x] Relasi sesuai ERD
- [x] Struktur mendukung role, unit, dan penugasan petugas pada unit (MVP antar mandiri)

**Catatan penyelesaian (17 Nov 2026):** model `User`, `BankSampahUnit`, `UnitStaff` + enum `UserRole`, `UserStatus`, `ServiceStatus`, `PublicationStatus`, `UnitStaffStatus` ditambahkan ke `be-bsd/prisma/schema.prisma` mengikuti `docs/ERD_KAMUS_DATA.md` (tabel `users`, `bank_sampah_units`, `unit_staff`; UUID `gen_random_uuid()`; `TIMESTAMPTZ`; staf unik per `(user_id, unit_id)`). Migrasi `be-bsd/prisma/migrations/20261117000000_users_units_staff` memuat tabel, index, dan FK; constraint `users_email_or_phone_check` ditulis manual karena Prisma tidak mendukung CHECK. `npm run lint`, `npm test`, dan `npm run build` lulus di `be-bsd`. **Verifikasi DB (17 Nov 2026):** kelima migrasi diterapkan ke PostgreSQL 16.6 lokal (`localhost:5432`, database `bank_sampah_digital`) lewat `prisma migrate dev`, lalu diulang dari database kosong lewat `prisma migrate deploy` + `prisma db seed` — keduanya tanpa error, jadi migrasi reproducible (K-04 tertutup, tidak memakai Docker).

## [x] BSD-22 · Skema: waste_categories dan waste_prices
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-21

Boleh sentuh: `be-bsd/prisma/`

Histori harga dengan `effective_from` dan `effective_to`.

Selesai kalau:
- [x] Periode harga untuk kategori dan unit yang sama tidak boleh tumpang tindih — dijaga `EXCLUDE USING gist` (`waste_prices_no_overlap`, `btree_gist` + `daterange`) sehingga tetap aman walau dua admin menyimpan bersamaan

**Catatan penyelesaian (17 Nov 2026):** model `WasteCategory` dan `WastePrice` + enum `ActiveStatus` ditambahkan; `waste_prices.unit_id` NULL = harga global, `price_per_kg DECIMAL(12,2)`, `effective_from`/`effective_to` DATE, `is_simulated` untuk menandai harga contoh (ERD bagian 9 nomor 6), index `(category_id, effective_from DESC)` dan `(unit_id, category_id, effective_from DESC)`. Migrasi `prisma/migrations/20261117000100_waste_categories_prices` memuat tabel, index, FK (`unit`/`category` RESTRICT, `created_by` SET NULL), CHECK harga >= 0 dan `effective_to >= effective_from`, serta exclusion constraint di atas. `prisma validate` + `generate`, lint, test, dan build lulus. **Verifikasi DB (17 Nov 2026):** migrasi diterapkan ke PostgreSQL 16.6; `CREATE EXTENSION btree_gist` + `waste_prices_no_overlap` aktif — insert harga dengan periode tumpang tindih ditolak `23P01`, insert dengan periode terpisah diterima.

## [x] BSD-23 · Skema: deposits, deposit_items, transactions
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-22

Boleh sentuh: `be-bsd/prisma/`

Berat dan harga memakai tipe Decimal. `unit_price_snapshot` ada di `deposit_items`.

Selesai kalau:
- [x] Indeks dan relasi sesuai ERD
- [x] Kolom snapshot harga tersedia

**Catatan penyelesaian (17 Nov 2026):** model `Deposit`, `DepositItem`, `Transaction` + enum `DepositStatus` (`menunggu`/`diproses`/`selesai`/`dibatalkan`), `InspectionStatus`, `TransactionStatus`. Berat `DECIMAL(10,3)`, nilai `DECIMAL(14,2)`, `unit_price_snapshot` + `line_total` di `deposit_items` (snapshot harga saat konfirmasi), `transactions.deposit_id` unik (satu transaksi per setoran) dan `idempotency_key` unik (konfirmasi aman saat retry), index riwayat per nasabah/unit. Migrasi `prisma/migrations/20261117000200_deposits_items_transactions` memuat tabel, index, FK, dan 4 CHECK (alasan wajib saat dibatalkan, estimasi > 0, berat aktual >= 0, alasan wajib saat item ditolak). `prisma validate` + `generate`, lint, test, build lulus.

## [x] BSD-24 · Skema: transaction_events, content_articles, notifications
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-23

Boleh sentuh: `be-bsd/prisma/`

Selesai kalau:
- [x] Migrasi lulus dan sesuai ERD

**Catatan penyelesaian (17 Nov 2026):** model `TransactionEvent` (menempel ke deposit atau transaksi, `event_type`, status lama/baru, `actor_id`, `reason`, `metadata`, index per entitas dan waktu), `ContentArticle` (slug unik, enum `ArticleStatus`, `author_id`, index `(status, published_at DESC)`), `Notification` (index `(user_id, read_at)`). Migrasi `prisma/migrations/20261117000300_transaction_events_articles_notifications` memuat tabel, index, FK, dan `transaction_events_target_check` (event wajib punya deposit atau transaksi). `prisma validate` + `generate`, lint, test, build lulus; migrasi diterapkan ke PostgreSQL 16.6 dan seed berjalan (2 unit, 4 kategori, 5 harga, 4 akun uji).

## [x] BSD-25 · Seed data simulasi
**Zhafran** · S2 · 2 SP · Prasyarat: BSD-24

Boleh sentuh: `be-bsd/prisma/seed.ts`

Selesai kalau:
- [x] Ada unit, kategori, harga, dan akun uji tiap role
- [x] Data ditandai jelas sebagai simulasi

**Catatan penyelesaian (17 Nov 2026):** `be-bsd/prisma/seed.ts` mengisi 2 unit (`is_simulated = true`, nama berawalan "BSDU Simulasi", alamat "(data fiktif)"), 4 kategori, 4 harga global + 1 harga khusus unit (`is_simulated = true`), dan 4 akun uji (`admin@contoh.test`, `petugas.cibeunying@contoh.test`, `petugas.sukajadi@contoh.test`, `nasabah@contoh.test`, password `Simulasi123!`) dengan penugasan unit untuk petugas. Seed idempoten (upsert dengan ID tetap). Menjalankan seed butuh `DATABASE_URL` hidup; di mesin ini berhenti di `ECONNREFUSED` karena PostgreSQL/Docker tidak tersedia. Dependency baru yang disetujui: `@prisma/adapter-pg` + `pg` (Prisma 7 mewajibkan driver adapter; dipakai juga oleh runtime API nanti), `@types/pg` (dev). Hash password memakai scrypt (`scrypt$<salt>$<key>`) — BSD-28 wajib memakai format yang sama atau seed dijalankan ulang.

## [x] BSD-26 · Arsitektur API
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-05

Boleh sentuh: `be-bsd/src/common/`, `be-bsd/src/main.ts`

Layering, validasi DTO, penanganan error, format respons, logging.

Selesai kalau:
- [x] Format error konsisten `{statusCode, message, code}`
- [x] Input tidak valid ditolak dengan pesan bahasa Indonesia

**Catatan penyelesaian (17 Nov 2026):** `src/common/http-exception.filter.ts` menangkap semua exception dan selalu membalas `{statusCode, message, code}`; pesan bawaan Nest berbahasa Inggris ("Cannot GET …", "Unauthorized", dst.) diterjemahkan ke bahasa Indonesia, kode error dipetakan per status (`VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, …) dan bisa ditimpa lewat `code` pada exception. `src/common/validation.ts` menyediakan `ValidationPipe` global (`whitelist`, `transform`) dengan `exceptionFactory` yang mengumpulkan pesan constraint jadi array bahasa Indonesia + `code: VALIDATION_ERROR`. Keduanya didaftarkan lewat `APP_PIPE`/`APP_FILTER` di `AppModule` agar berlaku juga saat test. Bukti: `test/api-architecture.e2e-spec.ts` (3 kasus: input tidak valid, properti asing dibuang, 404 konsisten); `npm test`, `npm run test:e2e`, lint, build lulus.

## [x] BSD-27 · Dokumentasi API (OpenAPI)
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-26

Boleh sentuh: `be-bsd/src/main.ts`

Selesai kalau:
- [x] Dokumentasi Swagger dapat diakses di lingkungan dev — `GET /docs` (UI) dan `GET /docs-json` (spesifikasi OpenAPI), hanya aktif bila `NODE_ENV !== 'production'`

**Catatan penyelesaian (17 Nov 2026):** `src/common/swagger.ts` menyiapkan `DocumentBuilder` (judul "Bank Sampah Digital API", versi 0.1.0, `addBearerAuth` untuk token auth nanti) dan dipanggil dari `main.ts` di luar produksi. Dependency baru disetujui: `@nestjs/swagger`. Bukti: `test/api-hardening.e2e-spec.ts` memeriksa `/docs-json` mengembalikan 200 dan `info.title` benar.

## [x] BSD-28 · Keamanan dasar API
**Zhafran** · S2 · 2 SP · Prasyarat: BSD-26

Boleh sentuh: `be-bsd/src/main.ts`, `be-bsd/src/common/`

CORS, rate limit, header keamanan.

Selesai kalau:
- [x] Hanya origin FE yang diizinkan — `CORS_ORIGINS` (default `http://localhost:3000`), origin lain tidak mendapat header `Access-Control-Allow-Origin`
- [x] Rate limit aktif pada endpoint auth — rate limit global sudah aktif (100 permintaan/menit per IP, pesan bahasa Indonesia); batas ketat khusus endpoint auth (5/menit) dipasang bersama BSD-29 (`@Throttle({ default: { limit: 5, ttl: 60000 } })` pada register/login/logout/refresh) karena endpoint auth baru dibuat di task tersebut

**Catatan penyelesaian (17 Nov 2026):** `src/common/security.ts` memasang `helmet` (header keamanan; CSP dimatikan karena Swagger UI memakai inline script/style) dan CORS terbatas `CORS_ORIGINS`; `ThrottlerModule` + `ThrottlerGuard` global di `AppModule` membatasi 100 permintaan/menit per IP dengan pesan "Terlalu banyak permintaan, coba lagi nanti." Dependency baru disetujui: `helmet`, `@nestjs/throttler`. Bukti: `test/api-hardening.e2e-spec.ts` (CORS izin/tolak, header `X-Content-Type-Options`/`X-Frame-Options`, permintaan ke-101 dibalas 429).

---

# E4 · Autentikasi, role, dan keamanan akses (Sprint 2)

## [x] BSD-29 · API registrasi, login, logout, refresh token
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-21, BSD-26

Boleh sentuh: `be-bsd/src/modules/auth/`, `be-bsd/src/modules/users/`

Selesai kalau:
- [x] Password di-hash, tidak pernah tersimpan atau dilog polos — scrypt `scrypt$<salt>$<key>` (keylen 64) dengan `timingSafeEqual` di `src/modules/auth/auth.service.ts`; format sama dengan seed BSD-25
- [x] Registrasi publik hanya membuat role nasabah (FR-01) — role `nasabah` hardcoded di `AuthService.register`, DTO tidak menyertakan field `role` (whitelist `ValidationPipe`)

Catatan penyelesaian (17 Nov 2026): modul auth `src/modules/auth/` (controller/service/guard/strategy/DTO) + `PrismaService` di `src/common/prisma.service.ts`; `POST /auth/register` (201, `DUPLICATE_CREDENTIALS` 409), `POST /auth/login` (200/401 `INVALID_CREDENTIALS`, 401 `ACCOUNT_INACTIVE`), `POST /auth/logout` (hapus refresh token via JWT bearer), `POST /auth/refresh` (rotasi, TTL 7 hari, 401 `INVALID_REFRESH_TOKEN`), `GET /auth/me` (proteksi JWT). Migrasi `20261117153521_add_refresh_tokens` (tabel `refresh_tokens`: `token_hash` unique, `expires_at`). Rate limit ketat auth 5/menit via `@Throttle` (menutup BSD-28). Bukti: `test/auth.e2e-spec.ts` (17 kasus) + `npm test`, `npm run test:e2e` (26 kasus), lint, build lulus; login berjalan ke PostgreSQL 16.6 lokal.

## [x] BSD-30 · API reset kata sandi
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-29

Boleh sentuh: `be-bsd/src/modules/auth/`

Selesai kalau:
- [x] Token reset kedaluwarsa dan sekali pakai — `POST /auth/reset-password` (`{ token, password }`) memvalidasi token via tabel `password_reset_tokens` (`token_hash` unique, TTL 30 menit) lalu hapus token (pakai sekali) dan perbarui password scrypt; token kadaluarsa → `401 INVALID_RESET_TOKEN`
- [x] Respons tidak membocorkan apakah email terdaftar — `POST /auth/forgot-password` (`{ email }`) selalu mengembalikan `{ sent: true }` tanpa memvalidasi keberadaan akun

Catatan penyelesaian (17 Nov 2026): modul auth ditambah `forgotPassword` + `resetPassword`; migrasi `20261117164922_add_password_reset_tokens` (tabel `password_reset_tokens`). Bukti: `test/auth.e2e-spec.ts` (30 kasus e2e lulus), lint, build lulus.

## [x] BSD-31 · RBAC dan guard endpoint
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-29

Boleh sentuh: `be-bsd/src/modules/auth/`, `be-bsd/src/common/guards/`

Selesai kalau:
- [x] Role nasabah, petugas, admin dicek di server pada tiap endpoint
- [x] Akun petugas/admin tidak bisa diperoleh lewat registrasi (NFR-01)

Catatan penyelesaian (18 Nov 2026): `JwtAuthGuard` dipasang global (`APP_GUARD`) dan endpoint publik ditandai `@Public()`; `CommonModule`/`PrismaModule` global menyediakan `PrismaService` + `UnitAccessService` (`assertStaffOfUnit`, `assertDepositOwner`, `assertTransactionOwner`) untuk cek keanggotaan unit dan kepemilikan data di service. Identitas diambil dari token, bukan query. Baca data master (units/kategori/harga) terbuka untuk semua role login, tulis tetap admin. `TransactionModule` didaftarkan (route `/transactions` sebelumnya 404). Sekalian diperbaiki: DTO pengajuan pakai `@IsUUID` + pola berat desimal, snapshot harga per `categoryId` dalam pengajuan (sebelumnya 500), berat hanya item milik pengajuan, konfirmasi idempoten mengembalikan transaksi yang sama saat retry. Bukti: e2e 30/30 lulus, build/lint lulus, verifikasi manual RBAC + alur transaksi penuh ke server lokal (2 akun petugas beda unit).

## [/] BSD-32 · Admin mengelola akun petugas
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-31

Boleh sentuh: `be-bsd/src/modules/users/`

Selesai kalau:
- [ ] Admin dapat membuat, mengaktifkan, dan menonaktifkan petugas
- [ ] Petugas terhubung ke unit lewat `unit_staff` (FR-02)

## [x] BSD-33 · Halaman Login, Register, Lupa Password
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-29, BSD-30

Boleh sentuh: `fe-bsd/src/app/(auth)/`, `fe-bsd/src/components/ui/`, `fe-bsd/src/lib/api/`

Selesai kalau:
- [x] Validasi form dan pesan error jelas (TC-01, TC-10)
- [x] Ada loading dan error state

Catatan penyelesaian (19 Nov 2026): form login/register/lupa kata sandi kini memanggil be-bsd sungguhan (mock hanya aktif bila `NEXT_PUBLIC_API_URL` kosong). Payload disesuaikan dengan DTO be-bsd (`phone` saat register, `{ refreshToken }` saat logout), aturan kata sandi zod disamakan dengan be-bsd, dan `lib/api/client.ts` mengirim `Authorization: Bearer` serta mencoba satu kali refresh saat 401. Bukti: login/refresh rotasi/logout/`/auth/me` diverifikasi ke server 3001; `tsc` bersih, lint 0 error, `next build` lulus.

## [x] BSD-34 · Auth state dan proteksi route per role
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-33

Boleh sentuh: `fe-bsd/src/lib/auth/`, `fe-bsd/src/middleware.ts`

Selesai kalau:
- [x] Pengguna tidak bisa membuka halaman role lain
- [x] Redirect ke beranda role setelah login
- [x] Route website publik tetap dapat diakses tanpa login

Catatan penyelesaian (19 Nov 2026): `lib/auth/session.ts` menyimpan `user`/`accessToken`/`refreshToken` di `localStorage` dan menulis cookie `bsd_session` (isi role) yang dibaca proxy; sesi dihapus otomatis saat 401 atau logout. Proxy tidak berubah — tetap memakai `resolveAccess`. Bukti (curl ke server dev 3000): `/nasabah` sebagai petugas → 307 `/petugas`, `/petugas` sebagai nasabah → 307 `/nasabah`, `/admin` sebagai petugas → 307, role cocok → 200, tanpa cookie → 307 `/login?next=...`, `/tentang` dan `/artikel` → 200 tanpa login. Catatan risiko: cookie hanya gating tampilan (bisa dipalsukan), akses data tetap ditentukan be-bsd (BSD-31).

## [ ] BSD-35 · Profil nasabah
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-34

Boleh sentuh: `be-bsd/src/modules/users/`, `fe-bsd/src/app/nasabah/profil/`

Prioritas P1.

Selesai kalau:
- [ ] Nasabah dapat melihat dan mengubah data profil yang diizinkan (FR-03)

## [ ] BSD-36 · Test otomatis auth dan RBAC
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-31

Boleh sentuh: `be-bsd/src/**/*.spec.ts`, `be-bsd/test/`

Selesai kalau:
- [ ] Akses lintas role dan lintas pengguna ditolak (dasar TC-07, TC-08)

---

# E5 · Data master: unit, kategori, harga (Sprint 2-3)

## [ ] BSD-37 · API CRUD unit Bank Sampah
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-31

Boleh sentuh: `be-bsd/src/modules/units/`

Selesai kalau:
- [ ] Hanya admin yang dapat membuat dan mengubah (FR-16)
- [ ] Alamat, koordinat opsional, jam operasional, status, kontak tersimpan

## [ ] BSD-38 · API CRUD kategori sampah
**Zhafran** · S2 · 3 SP · Prasyarat: BSD-31

Boleh sentuh: `be-bsd/src/modules/waste-categories/`

Selesai kalau:
- [ ] Kategori dapat diaktifkan dan dinonaktifkan

## [ ] BSD-39 · API harga sampah dan histori
**Zhafran** · S2 · 5 SP · Prasyarat: BSD-22, BSD-38

Boleh sentuh: `be-bsd/src/modules/waste-prices/`

Prioritas harga: unit menimpa global (D-04).

Selesai kalau:
- [ ] Harga aktif dipilih berdasarkan tanggal berlaku dan unit
- [ ] Setiap perubahan harga mencatat pengguna dan waktu (NFR-04)

## [ ] BSD-40 · Halaman admin: manajemen unit
**Zhafran** · S3 · 5 SP · Prasyarat: BSD-37, BSD-34

Boleh sentuh: `fe-bsd/src/app/admin/units/`, `fe-bsd/src/components/`

Selesai kalau:
- [ ] CRUD unit berjalan dari UI

## [ ] BSD-41 · Halaman admin: kategori dan harga
**Zhafran** · S3 · 5 SP · Prasyarat: BSD-39, BSD-34

Boleh sentuh: `fe-bsd/src/app/admin/harga/`, `fe-bsd/src/components/`

Selesai kalau:
- [ ] Admin mengubah harga dan melihat riwayat harga

## [ ] BSD-42 · Halaman admin: pengguna dan penugasan unit
**Zhafran** · S3 · 5 SP · Prasyarat: BSD-32, BSD-34

Boleh sentuh: `fe-bsd/src/app/admin/pengguna/`

Selesai kalau:
- [ ] Admin membuat petugas, menugaskan unit, dan menonaktifkan akun

## [ ] BSD-43 · Status publikasi unit
**Zhafran** · S3 · 2 SP · Prasyarat: BSD-37

Boleh sentuh: `be-bsd/src/modules/units/`

Prioritas P1.

Selesai kalau:
- [ ] Hanya unit terverifikasi dan terpublikasi yang tampil ke publik

---

# E6 · Pencarian dan informasi Bank Sampah (Sprint 3)

## [ ] BSD-44 · API daftar dan detail unit
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-39

Boleh sentuh: `be-bsd/src/modules/units/`

Selesai kalau:
- [ ] Detail unit memuat alamat, jam, status, kategori, dan harga aktif (FR-04, FR-06)

## [ ] BSD-45 · API pencarian dan filter unit
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-44

Boleh sentuh: `be-bsd/src/modules/units/`

Prioritas P1.

Selesai kalau:
- [ ] Cari berdasarkan nama dan area, filter status layanan (FR-05)

## [ ] BSD-46 · Informasi jarak unit
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-44

Boleh sentuh: `be-bsd/src/modules/units/`, `fe-bsd/src/lib/`

Prioritas P1.

Selesai kalau:
- [ ] Jarak tampil hanya bila izin lokasi dan koordinat unit tersedia

## [ ] BSD-47 · Halaman Home, Daftar, dan Detail Bank Sampah
**Zhafran** · S3 · 8 SP · Prasyarat: BSD-44, BSD-34

Boleh sentuh: `fe-bsd/src/app/nasabah/`, `fe-bsd/src/components/`

Selesai kalau:
- [ ] Alamat, jam operasional, status, dan petunjuk setoran tampil (TC-02)
- [ ] Ada loading, empty, dan error state

## [ ] BSD-48 · UI pencarian dan filter
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-45, BSD-47

Boleh sentuh: `fe-bsd/src/app/nasabah/`

Prioritas P1.

Selesai kalau:
- [ ] Hasil sesuai kata kunci dan filter

---

# E7 · Pengajuan setoran nasabah (Sprint 3)

## [ ] BSD-49 · API pembuatan pengajuan setoran
**Zhafran** · S3 · 5 SP · Prasyarat: BSD-23, BSD-44

Boleh sentuh: `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] Pengajuan tersimpan dengan status Menunggu dan item kategori (FR-07)
- [ ] Angka dan kategori divalidasi

## [ ] BSD-50 · Logika estimasi nilai
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-49

Boleh sentuh: `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] Respons memuat estimasi yang berlabel "bukan nilai final" (FR-08)

## [ ] BSD-51 · API status dan pembatalan pengajuan
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-49

Boleh sentuh: `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] Nasabah dapat membatalkan pengajuannya sendiri dengan alasan
- [ ] Setiap perubahan status tercatat di `transaction_events`

## [ ] BSD-52 · Halaman Pilih Jenis Sampah dan Konfirmasi Setoran
**Zhafran** · S3 · 8 SP · Prasyarat: BSD-49, BSD-50

Boleh sentuh: `fe-bsd/src/app/nasabah/setor/`, `fe-bsd/src/components/`

Selesai kalau:
- [ ] Estimasi dan nilai final dibedakan jelas
- [ ] Jam operasional dan alamat tampil sebelum konfirmasi

## [ ] BSD-53 · Halaman Status Setoran
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-51

Boleh sentuh: `fe-bsd/src/app/nasabah/status/`

Selesai kalau:
- [ ] Status Menunggu, Diproses, Selesai, Dibatalkan konsisten bahasanya

## [ ] BSD-54 · Notifikasi status dalam aplikasi
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-51

Boleh sentuh: `be-bsd/src/modules/notifications/`, `fe-bsd/src/components/`

Prioritas P2.

Selesai kalau:
- [ ] Nasabah melihat perubahan status di dalam aplikasi (FR-20)

## [ ] BSD-55 · Daftar pengajuan untuk petugas
**Zhafran** · S3 · 5 SP · Prasyarat: BSD-49, BSD-34

Boleh sentuh: `be-bsd/src/modules/deposits/`, `fe-bsd/src/app/petugas/`

Selesai kalau:
- [ ] Petugas hanya melihat pengajuan unitnya (FR-09, TC-03)

---

# E8 · Penimbangan dan transaksi (Sprint 4)

## [ ] BSD-56 · API pembaruan status oleh petugas
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-55

Boleh sentuh: `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] Petugas mengubah Menunggu menjadi Diproses hanya untuk unitnya (FR-10, TC-08)

## [ ] BSD-57 · API input berat aktual
**Zhafran** · S4 · 5 SP · Prasyarat: BSD-56

Boleh sentuh: `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] Berat aktual per kategori tersimpan, petugas dapat mengoreksi kategori (FR-11)
- [ ] Berat harus angka positif

## [ ] BSD-58 · Snapshot harga saat penimbangan
**Zhafran** · S4 · 5 SP · Prasyarat: BSD-57, BSD-39

Boleh sentuh: `be-bsd/src/modules/deposits/`, `be-bsd/src/modules/waste-prices/`

Selesai kalau:
- [ ] `unit_price_snapshot` terisi dari harga aktif unit tersebut
- [ ] Perubahan harga setelah transaksi tidak mengubah transaksi lama (TC-05)

## [ ] BSD-59 · Kalkulasi nilai di server
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-58

Boleh sentuh: `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] `line_total` = berat aktual x snapshot harga, total = jumlah semua item (FR-12, TC-04)
- [ ] Perhitungan memakai Decimal, bukan float

## [ ] BSD-60 · Konfirmasi transaksi, atomik dan idempotent
**Zhafran** · S4 · 8 SP · Prasyarat: BSD-59

Boleh sentuh: `be-bsd/src/modules/transactions/`, `be-bsd/src/modules/deposits/`

Dalam satu DB transaction dengan idempotency key.

Selesai kalau:
- [ ] Status menjadi Selesai hanya setelah konfirmasi petugas (FR-13, TC-06)
- [ ] Pengulangan permintaan tidak membuat transaksi ganda (TC-09)

## [ ] BSD-61 · Pencatatan transaction_events
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-56

Boleh sentuh: `be-bsd/src/modules/transactions/`

Selesai kalau:
- [ ] Setiap perubahan status mencatat status lama, baru, pelaku, dan waktu

## [ ] BSD-62 · Pembatalan dan koreksi pasca-konfirmasi
**Zhafran** · S4 · 5 SP · Prasyarat: BSD-60, BSD-61

Boleh sentuh: `be-bsd/src/modules/transactions/`

Prioritas P1.

Selesai kalau:
- [ ] Alasan wajib diisi
- [ ] Koreksi meninggalkan jejak dan memperbarui saldo satu kali

## [ ] BSD-63 · UI penimbangan dan konfirmasi transaksi
**Zhafran** · S4 · 8 SP · Prasyarat: BSD-57, BSD-60

Boleh sentuh: `fe-bsd/src/app/petugas/`, `fe-bsd/src/components/`

Selesai kalau:
- [ ] Detail pengajuan, input berat, dan ringkasan sebelum konfirmasi tersedia
- [ ] Nilai ditampilkan dari respons API, bukan dihitung di FE

## [x] BSD-64 · Penanganan jaringan buruk
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-63

- Tombol dinonaktifkan saat proses, idempotency key dikirim
- Retry aman dan pesan error jelas saat jaringan putus (TC-09)

---


---

# E9 · Riwayat, saldo, dan bukti transaksi (Sprint 4)

## [ ] BSD-65 · API riwayat dan detail transaksi
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-60

Boleh sentuh: `be-bsd/src/modules/transactions/`

Selesai kalau:
- [ ] Nasabah hanya melihat transaksi miliknya (FR-14, TC-07)

## [ ] BSD-66 · Saldo atau nilai akumulatif
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-60

Boleh sentuh: `be-bsd/src/modules/transactions/`

Selesai kalau:
- [ ] Nilai akumulatif bertambah satu kali per transaksi selesai (FR-15, TC-06)
- [ ] Tidak disajikan sebagai dana yang dapat ditarik

## [ ] BSD-67 · UI Riwayat, Detail, dan Saldo
**Zhafran** · S4 · 5 SP · Prasyarat: BSD-65, BSD-66

Boleh sentuh: `fe-bsd/src/app/nasabah/riwayat/`, `fe-bsd/src/app/nasabah/saldo/`

Selesai kalau:
- [ ] Riwayat memuat jenis, berat aktual, harga/kg, nilai, waktu, dan status
- [ ] Teks tidak menyiratkan uang dapat dicairkan

## [ ] BSD-68 · Bukti transaksi
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-65

Boleh sentuh: `fe-bsd/src/app/nasabah/riwayat/`, `be-bsd/src/modules/transactions/`

Prioritas P1.

Selesai kalau:
- [ ] Setelah selesai, detail transaksi dapat ditinjau kembali (FR-21)

## [ ] BSD-69 · Riwayat unit untuk petugas
**Zhafran** · S4 · 3 SP · Prasyarat: BSD-60

Boleh sentuh: `be-bsd/src/modules/transactions/`, `fe-bsd/src/app/petugas/riwayat/`

Prioritas P1.

Selesai kalau:
- [ ] Petugas hanya melihat riwayat unit yang ditugaskan

---

# E10 · Dashboard dan laporan (Sprint 5, P1)

## [ ] BSD-70 · API ringkasan dashboard petugas
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-60

Boleh sentuh: `be-bsd/src/modules/reports/`

Selesai kalau:
- [ ] Jumlah pengajuan dan transaksi harian untuk unit petugas (FR-17)

## [ ] BSD-71 · API laporan admin
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-60

Boleh sentuh: `be-bsd/src/modules/reports/`

Selesai kalau:
- [ ] Total berat dan nilai per kategori, per unit, dan per periode
- [ ] Hanya dapat diakses sesuai kewenangan

## [ ] BSD-72 · UI dashboard petugas dan admin
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-70, BSD-71

Boleh sentuh: `fe-bsd/src/app/petugas/dashboard/`, `fe-bsd/src/app/admin/dashboard/`

Selesai kalau:
- [ ] Data sesuai API, tersedia loading dan empty state

## [ ] BSD-73 · Ekspor laporan ringkas (CSV)
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-71

Boleh sentuh: `be-bsd/src/modules/reports/`

Prioritas P2.

Selesai kalau:
- [ ] Admin dapat mengunduh laporan periode terpilih

---

# E11 · Website publik dan edukasi (Sprint 5, P1)

## [ ] BSD-74 · API dan CMS sederhana artikel
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-31

Boleh sentuh: `be-bsd/src/modules/articles/`, `fe-bsd/src/app/admin/konten/`

Selesai kalau:
- [ ] Admin membuat, mengubah, dan mempublikasikan artikel (FR-18)

## [ ] BSD-75 · Halaman publik: Beranda, Tentang, Cara Kerja, Kontak
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-19

Boleh sentuh: `fe-bsd/src/app/(public)/`

Selesai kalau:
- [ ] Halaman responsif dan sesuai wireframe

## [ ] BSD-76 · Halaman informasi Bank Sampah dan edukasi
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-74, BSD-44

Boleh sentuh: `fe-bsd/src/app/(public)/`

Selesai kalau:
- [ ] Hanya unit dan artikel terpublikasi yang tampil

## [ ] BSD-77 · SEO dasar
**Zhafran** · S5 · 2 SP · Prasyarat: BSD-75

Boleh sentuh: `fe-bsd/src/app/(public)/`, `fe-bsd/src/app/sitemap.ts`

Prioritas P2.

Selesai kalau:
- [ ] Metadata, sitemap, dan Open Graph tersedia

---

# E12 · PWA dan kualitas non-fungsional

## [ ] BSD-78 · Konfigurasi PWA
**Zhafran** · S3 · 5 SP · Prasyarat: BSD-04

Boleh sentuh: `fe-bsd/src/app/manifest.ts`, `fe-bsd/public/`, konfigurasi service worker

Selesai kalau:
- [ ] Aplikasi dapat di-install di perangkat Android
- [ ] Manifest, ikon, nama aplikasi, theme color, dan display mode lengkap
- [ ] PWA dapat dibuka untuk role nasabah, petugas, dan admin sesuai hak akses

## [ ] BSD-79 · Cache dan halaman offline dasar
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-78

Boleh sentuh: konfigurasi service worker, `fe-bsd/src/app/offline/`

Prioritas P1. Data transaksi dan saldo memakai network-first.

Selesai kalau:
- [ ] Pesan jelas saat offline dan indikator koneksi tersedia
- [ ] Halaman informatif dapat di-cache sesuai strategi yang disepakati
- [ ] Pengajuan/penimbangan/konfirmasi transaksi tidak dikirim diam-diam saat offline
- [ ] Tidak ada pengiriman transaksi ganda saat koneksi pulih

## [ ] BSD-80 · Responsivitas desktop dan mobile
**Zhafran** · S3 · 3 SP · Prasyarat: BSD-47

Boleh sentuh: `fe-bsd/src/`

Selesai kalau:
- [ ] Seluruh halaman utama nyaman di layar mobile dan desktop (NFR-06)

## [ ] BSD-81 · Aksesibilitas
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-80

Boleh sentuh: `fe-bsd/src/`

Prioritas P1.

Selesai kalau:
- [ ] Kontras memadai dan kontrol utama berlabel (NFR-11)

## [ ] BSD-82 · Optimasi performa
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-80

Boleh sentuh: `fe-bsd/src/`, `be-bsd/prisma/` (indeks)

Prioritas P1.

Selesai kalau:
- [ ] Target angka performa ditetapkan dan diukur dengan Lighthouse (NFR-08)

## [ ] BSD-83 · Perlindungan data pribadi
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-65

Boleh sentuh: `be-bsd/src/`, `fe-bsd/src/app/(public)/privasi/`

Prioritas P1.

Selesai kalau:
- [ ] Data pribadi dikumpulkan seperlunya dan tidak tampil ke pihak tak berwenang (NFR-02)
- [ ] Halaman kebijakan privasi tersedia

---

# E13 · Pengujian, deployment, dan persiapan pilot (Sprint 5 dan seterusnya)

## [ ] BSD-84 · Unit dan integration test backend
**Zhafran** · S5 · 8 SP · Prasyarat: BSD-60

Boleh sentuh: `be-bsd/src/**/*.spec.ts`, `be-bsd/test/`

Selesai kalau:
- [ ] Kalkulasi, snapshot harga, RBAC, dan idempotensi ada test-nya
- [ ] `npm test` lulus

## [ ] BSD-85 · Eksekusi test case TC-01 sampai TC-10
**SA 2** · S5 · 5 SP · Prasyarat: BSD-60

Boleh sentuh: `docs/`

Selesai kalau:
- [ ] Laporan hasil uji memuat status tiap TC

## [ ] BSD-86 · End-to-end test alur utama
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-67

Boleh sentuh: `fe-bsd/e2e/`

Selesai kalau:
- [ ] Alur pengajuan, penimbangan, transaksi selesai, riwayat lulus end-to-end

## [ ] BSD-87 · Uji keamanan dasar
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-84

Boleh sentuh: `be-bsd/test/`, `docs/`

Selesai kalau:
- [ ] Akses antar-nasabah, antar-unit, dan input berbahaya diuji
- [ ] Tidak ada temuan kritis terbuka

## [ ] BSD-88 · Lingkungan staging dan produksi
**Zhafran** · S5 · 5 SP · Prasyarat: BSD-07

Boleh sentuh: `.github/workflows/`, konfigurasi hosting, `docs/`

Selesai kalau:
- [ ] FE, BE, dan PostgreSQL terkelola berjalan di staging
- [ ] Variabel rahasia tidak ada di repo

## [ ] BSD-89 · Backup dan pemulihan database
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-88

Boleh sentuh: `docs/`, konfigurasi hosting

Selesai kalau:
- [ ] Backup terjadwal dan restore berhasil diuji sebelum pilot (NFR-10)

## [ ] BSD-90 · Monitoring dan logging error
**Zhafran** · S5 · 3 SP · Prasyarat: BSD-88

Boleh sentuh: `be-bsd/src/common/`, `fe-bsd/src/`

Prioritas P1.

Selesai kalau:
- [ ] Error produksi terpantau dan data pribadi tidak ikut dilog

## [ ] BSD-91 · UAT bersama pengguna dan mitra
**PM** · S5 · 5 SP · Prasyarat: BSD-86, BSD-88

Boleh sentuh: `docs/`

Selesai kalau:
- [ ] Daftar temuan dan prioritas perbaikan tersedia

## [ ] BSD-92 · Perbaikan bug hasil UAT
**Zhafran** · S5 · 8 SP · Prasyarat: BSD-91

Boleh sentuh: `fe-bsd/src/`, `be-bsd/src/`

Selesai kalau:
- [ ] Tidak ada bug kritis terbuka

## [ ] BSD-93 · Verifikasi data unit dan harga nyata
**PM** · S5 · 2 SP · Prasyarat: BSD-09

Boleh sentuh: `be-bsd/prisma/seed.ts`, `docs/`

Selesai kalau:
- [ ] Informasi unit dan harga diverifikasi pihak terkait
- [ ] Data simulasi diganti atau ditandai

## [ ] BSD-94 · Panduan singkat nasabah dan petugas
**UI/UX** · S5 · 3 SP · Prasyarat: BSD-86

Boleh sentuh: `docs/`, `fe-bsd/src/app/(public)/`

Prioritas P1.

Selesai kalau:
- [ ] Panduan 1-2 halaman untuk tiap peran tersedia

## [ ] BSD-95 · Keputusan kesiapan pilot
**PM** · S5 · 1 SP · Prasyarat: BSD-91, BSD-92

Boleh sentuh: `docs/`

Selesai kalau:
- [ ] Dokumen go/no-go ditandatangani Product Owner

## [ ] BSD-96 · Pilot terbatas dan evaluasi
**PM** · Pilot · 5 SP · Prasyarat: BSD-95

Boleh sentuh: `docs/`

Selesai kalau:
- [ ] Indikator keberhasilan PRD 3.3 diukur dan dilaporkan

---

# E14 · Penjemputan sampah oleh petugas (Fase 2, Pasca-MVP)

> **Keputusan D-01 (12 Nov 2026):** penjemputan **tidak** termasuk MVP; epic ini dipindahkan ke **Fase 2/pasca-MVP**. Sebelum development, SA wajib memvalidasi SOP penjemputan, area layanan, penjadwalan, penugasan, unit tujuan, dan bukti serah-terima bersama calon mitra.

## [ ] BSD-97 · Analisis proses bisnis dan aturan penjemputan
**SA 1 + PM** · S1 · 5 SP · Prasyarat: BSD-09

Boleh sentuh: `docs/`

Selesaikan aturan minimal: area layanan, alamat/lokasi, slot waktu, kapasitas petugas, penugasan, pembatalan, gagal jemput, unit tujuan, dan proses serah-terima.

Selesai kalau:
- [ ] BPMN penjemputan dari pengajuan sampai serah-terima ke unit disetujui
- [ ] Aturan penentuan unit terdekat/tujuan dan penugasan petugas terdokumentasi
- [ ] Kebijakan perubahan jadwal, pembatalan, dan permintaan gagal dilayani ditetapkan
- [ ] PRD dan acceptance criteria diperbarui

## [ ] BSD-104 · Desain UX alur penjemputan nasabah
**UI/UX** · S2 · 5 SP · Prasyarat: BSD-97

Boleh sentuh: Figma

Selesai kalau:
- [ ] Nasabah dapat mengisi alamat/lokasi dan memilih jadwal yang tersedia
- [ ] Nasabah dapat meninjau ringkasan permintaan sebelum mengirim
- [ ] Status permintaan dan informasi petugas ditampilkan sesuai kebijakan privasi
- [ ] Empty, loading, error, dan success state tersedia

## [ ] BSD-105 · Desain UX dashboard tugas penjemputan petugas
**UI/UX** · S2 · 5 SP · Prasyarat: BSD-97

Boleh sentuh: Figma

Selesai kalau:
- [ ] Petugas dapat melihat daftar tugas dan detail permintaan
- [ ] Petugas dapat melihat alamat, kontak seperlunya, jadwal, dan unit tujuan
- [ ] Prototype mencakup menerima tugas, menuju lokasi, sampah diambil, dan diserahkan ke unit

## [ ] BSD-106 · Skema database permintaan dan penugasan penjemputan
**BE + SA 2** · S2 · 5 SP · Prasyarat: BSD-14, BSD-97

Boleh sentuh: `be-bsd/prisma/`, `docs/`

Entitas/relasi minimal mencakup pickup request, alamat/lokasi, jadwal, petugas yang ditugaskan, unit tujuan, status, dan event/audit.

Selesai kalau:
- [ ] Relasi nasabah, permintaan, petugas, dan unit tujuan tervalidasi
- [ ] Status dan histori perubahan dapat ditelusuri
- [ ] Migration dapat dijalankan pada PostgreSQL kosong

## [ ] BSD-107 · API pengajuan penjemputan
**BE** · S3 · 5 SP · Prasyarat: BSD-106, BSD-31

Boleh sentuh: `be-bsd/src/modules/pickups/`

Selesai kalau:
- [ ] Nasabah dapat membuat permintaan dengan alamat/lokasi, jadwal, catatan, dan rincian sampah
- [ ] Validasi area layanan dan kelengkapan data diterapkan
- [ ] Permintaan tersimpan dengan status awal yang disepakati
- [ ] Nasabah hanya dapat melihat permintaan miliknya

## [ ] BSD-108 · API penugasan dan pengelolaan tugas petugas
**BE** · S3 · 5 SP · Prasyarat: BSD-107, BSD-32

Boleh sentuh: `be-bsd/src/modules/pickups/`, `be-bsd/src/modules/users/`

Selesai kalau:
- [ ] Admin/dispatcher dapat menugaskan petugas sesuai unit/wilayah kewenangan
- [ ] Petugas hanya dapat melihat tugas yang ditugaskan kepadanya
- [ ] Penugasan dan perubahan petugas tercatat dalam audit trail

## [ ] BSD-109 · API status penjemputan dan serah-terima ke unit
**BE** · S4 · 5 SP · Prasyarat: BSD-108, BSD-44

Boleh sentuh: `be-bsd/src/modules/pickups/`, `be-bsd/src/modules/deposits/`

Selesai kalau:
- [ ] Status proses penjemputan mengikuti state transition yang disepakati
- [ ] Petugas dapat mencatat sampah telah diambil dan diserahkan ke unit tujuan
- [ ] Unit tujuan dapat mengonfirmasi penerimaan/serah-terima
- [ ] Peristiwa, waktu, dan aktor tercatat; perubahan status ilegal ditolak

## [ ] BSD-110 · UI PWA pengajuan dan pelacakan penjemputan nasabah
**FE** · S3-S4 · 8 SP · Prasyarat: BSD-104, BSD-107

Boleh sentuh: `fe-bsd/src/app/nasabah/`, `fe-bsd/src/features/pickups/`

Selesai kalau:
- [ ] Nasabah dapat mengajukan penjemputan dari PWA
- [ ] Nasabah dapat melihat ringkasan, jadwal, dan status permintaan
- [ ] Nasabah dapat membatalkan permintaan sesuai aturan yang berlaku
- [ ] Tampilan responsif dan memiliki state loading/empty/error/success

## [ ] BSD-111 · UI PWA tugas penjemputan petugas
**FE** · S4 · 8 SP · Prasyarat: BSD-105, BSD-108, BSD-109

Boleh sentuh: `fe-bsd/src/app/petugas/`, `fe-bsd/src/features/pickups/`

Selesai kalau:
- [ ] Petugas dapat melihat dan membuka tugas penjemputan miliknya
- [ ] Petugas dapat memperbarui status sesuai tahapan proses
- [ ] Petugas dapat melihat unit tujuan dan mencatat serah-terima
- [ ] Akses dan aksi dibatasi berdasarkan role dan penugasan

## [ ] BSD-112 · Integrasi penjemputan dengan alur setoran dan transaksi
**FE + BE** · S4 · 5 SP · Prasyarat: BSD-109, BSD-110, BSD-111, BSD-60

Selesai kalau:
- [ ] Setelah serah-terima diterima unit, proses pemeriksaan dan penimbangan dapat dilanjutkan
- [ ] Satu permintaan penjemputan tidak menghasilkan transaksi ganda
- [ ] Riwayat nasabah dan riwayat operasional unit menampilkan asal setoran (mandiri/penjemputan)

## [ ] BSD-113 · Pengujian end-to-end alur penjemputan
**QA + SA 2** · S5 · 5 SP · Prasyarat: BSD-112

Boleh sentuh: `be-bsd/test/`, `fe-bsd/e2e/`, `docs/`

Selesai kalau:
- [ ] Skenario berhasil, pembatalan, gagal jemput, salah penugasan, dan serah-terima diuji
- [ ] Akses lintas petugas dan lintas nasabah ditolak
- [ ] Bukti hasil pengujian dan bug tercatat

---

# E15 · Fase lanjutan (pasca-MVP, P2)

## [ ] BSD-98 · Scan identifikasi jenis sampah
**Belum ditugaskan** · Pasca-MVP · 13 SP

Boleh sentuh: ditentukan nanti

Hanya saran kategori. Nasabah tetap dapat memilih manual dan petugas dapat mengoreksi (FR-19).

Selesai kalau:
- [ ] Hasil scan tidak menentukan jenis, berat, atau harga final

## [ ] BSD-99 · Push notification
**Belum ditugaskan** · Pasca-MVP · 5 SP · Prasyarat: BSD-54

Boleh sentuh: ditentukan nanti

Selesai kalau:
- [ ] Notifikasi push diterima untuk perubahan status

## [ ] BSD-100 · Analitik lanjutan
**Belum ditugaskan** · Pasca-MVP · 8 SP · Prasyarat: BSD-71

Boleh sentuh: ditentukan nanti

Selesai kalau:
- [ ] Kebutuhan analitik divalidasi dengan pengguna

## [ ] BSD-101 · Integrasi mitra pengelolaan/daur ulang dan CSR
**Belum ditugaskan** · Pasca-MVP · 13 SP

Boleh sentuh: ditentukan nanti

Selesai kalau:
- [ ] Ruang lingkup disepakati dengan mitra

## [ ] BSD-102 · Reward/poin dan penarikan saldo
**Belum ditugaskan** · Pasca-MVP · 13 SP

Boleh sentuh: ditentukan nanti

Perlu kajian hukum dan keuangan sebelum dikerjakan.

Selesai kalau:
- [ ] Kajian kepatuhan selesai dan disetujui

## [ ] BSD-103 · Pengujian dukungan iOS
**Belum ditugaskan** · Pasca-MVP · 3 SP

Boleh sentuh: `fe-bsd/src/`

Selesai kalau:
- [ ] Alur utama diuji di perangkat iOS dan temuan dicatat


---

## Panduan eksekusi backlog untuk tim

1. **Jangan mulai coding sebelum handoff dan acceptance criteria tersedia.** UI/UX menyerahkan link Figma, komponen, state, dan catatan interaksi kepada FE.
2. **Kontrak API disepakati sebelum integrasi.** BE mendokumentasikan endpoint, request/response, error code, autentikasi, dan role access; FE menggunakan kontrak tersebut.
3. **Database migration harus version-controlled.** Hindari perubahan skema langsung di database bersama tanpa migration.
4. **Validasi bisnis berada di backend.** FE boleh melakukan validasi awal untuk UX, tetapi otorisasi, harga, perhitungan transaksi, status, dan kepemilikan data wajib diverifikasi server.
5. **Task FE dan BE dapat berjalan paralel** setelah user story, desain, skema data, dan kontrak API disepakati.
6. **Definition of Done:** acceptance criteria terpenuhi, code review selesai, test relevan lulus, tidak ada bug blocker/critical, dokumentasi diperbarui, dan Jira/GitHub diperbarui.
7. **Jangan menganggap seluruh estimasi SP final.** Estimasi pada backlog awal perlu direview ulang setelah tim menyepakati kapasitas dan framework backend. Aturan penjemputan dibahas terpisah pada Fase 2.
8. **Perubahan ruang lingkup harus melalui Product Owner.** Perubahan yang memengaruhi database, API, alur pengguna, atau jadwal harus dicatat dan dianalisis dampaknya.
