# CATATAN PENGERJAAN – Bank Sampah Digital









Log kerja proyek: task yang sudah dikerjakan, perubahan yang dilakukan, keputusan, kendala, dan perubahan kebutuhan. Dokumen ini diperbarui **setiap akhir hari kerja/sprint** dan menjadi pasangan dari dokumen BACKLOG (rujukan ID task: BSD-xx).









**Versi:** 1.29  |  **Dibuat:** 11 November 2026  |  **Pengelola:** Project Manager  |  **Terakhir diperbarui:** 25 November 2026









## 1. Cara Menggunakan Dokumen Ini









- Setiap kali task selesai (Done menurut DoD), tambahkan baris di **bagian 4 (Log Pengerjaan)** dan perbarui **bagian 3 (Progres Epic)**.




- Setiap perubahan kode yang relevan dicatat di **bagian 5 (Changelog)** dengan kategori: Added, Changed, Fixed, Removed, Security.




- Keputusan penting masuk **bagian 6**, perubahan kebutuhan masuk **bagian 7**, kendala masuk **bagian 8**.




- Tulis bukti: link Pull Request, commit, issue Jira, atau tangkapan layar.




- Jangan menandai Done sebelum memenuhi Definition of Done di BACKLOG.









## 2. Ringkasan Status Proyek









| Item | Status |




| --- | --- |




| Fase saat ini | Pengembangan MVP (E4 – autentikasi/role dan E7 – pengajuan setoran) |




| Sprint berjalan | Sprint 3 (dikerjakan mulai 18 November 2026) |




| Total task di backlog | 103 task MVP (BSD-01 s.d. BSD-103); 10 task penjemputan Fase 2 (BSD-104–113) dihitung terpisah |




| Task selesai | 60 dari 103 task backlog (BSD-01 s.d. BSD-17 selesai; dokumen perencanaan, design system, dan prototype nasabah selesai, lihat bagian 4). BSD-21 s.d. BSD-31 dan BSD-37–39 (fondasi backend, auth, RBAC, CRUD unit & kategori, API harga) selesai 17–22 Nov 2026, BSD-33–34 (auth FE) selesai 19 Nov 2026, lalu BSD-49/50/52/53/55 (API pengajuan setoran + estimasi nilai, layar setor nasabah, daftar pengajuan petugas per unit yang membaca API sungguhan) selesai 18–19 Nov 2026, serta BSD-56/57/58/59/60/61/62/63 (penerimaan pengajuan, timbang aktual, snapshot harga, kalkulasi nilai server, konfirmasi atomik/idempotent, jejak perubahan status, pembatalan/koreksi pasca-konfirmasi, UI timbang/konfirmasi) selesai 19–22 Nov 2026, BSD-65 (API riwayat dan detail transaksi nasabah) dan BSD-66 (saldo/nilai akumulatif dari transaksi) selesai 23 Nov 2026 — E3 selesai, E4/E5/E7/E8/E9 berjalan. Ralat hitungan 22 Nov 2026: BSD-64 sudah dicentang di backlog sejak 18 Nov 2026 tetapi sebelumnya tidak ikut dihitung, sehingga progres lama 43/103 seharusnya 44/103. Sinkronisasi 25 Nov 2026: BSD-44 diverifikasi dari kode detail unit yang sudah ada dan BSD-45 diselesaikan dengan validasi query + test filter; BSD-47 diverifikasi dari kode halaman setor yang sudah ada; BSD-48 menghubungkan pencarian/filter UI ke `GET /units`; hitungan kini mengikuti centang backlog 60/103 |




| Blocker aktif | Tidak ada blocker keputusan; keputusan produk/arsitektur utama sudah ditetapkan; validasi mitra BSU (D-09) ditunda sampai akhir MVP. Catatan teknis: database dev berjalan di PostgreSQL 16.6 portable (`D:\pg-bsd`, port 5432) karena Docker tidak tersedia; migrasi & seed sudah diverifikasi (K-04 tertutup), tapi server DB harus di-start manual tiap sesi (`pg_ctl -D D:\pg-bsd\data start`) |




| Risiko utama | Hanya 1 developer; Bank Sampah Unit (BSU) baru tersedia/diterapkan di akhir MVP sehingga validasi mitra ditunda |









## 3. Progres per Epic









| Epic | Nama | Sprint Rencana | Task Selesai / Total | Status |




| --- | --- | --- | --- | --- |




| E1 | Inisiasi proyek dan setup | 1 | 9 / 9 | Selesai |




| E2 | Analisis kebutuhan dan desain UX | 1 | 8 / 11 | Sedang berjalan |




| E3 | Fondasi backend dan database | 2 | 8 / 8 | Selesai (migrasi & seed terverifikasi di PostgreSQL 16.6 lokal, K-04 tertutup; batas rate limit khusus endpoint auth menyusul BSD-29) |




| E4 | Autentikasi, role, dan keamanan akses | 2 | 5 / 8 | Sedang berjalan (BSD-29, BSD-30, BSD-31, BSD-33, BSD-34 selesai; BSD-32 dan BSD-35/36 berikutnya) |




| E5 | Data master | 2–3 | 3 / 7 | Sedang berjalan (BSD-37, BSD-38, BSD-39 selesai; BSD-40/41 berikutnya) |




| E6 | Pencarian dan informasi Bank Sampah | 3 | 4 / 5 | Sedang berjalan (BSD-44, BSD-45, BSD-47, BSD-48 selesai 25 Nov 2026; BSD-46 berikutnya) |




| E7 | Pengajuan setoran | 3 | 6 / 7 | Sedang berjalan (BSD-49, BSD-50, BSD-51, BSD-52, BSD-53, BSD-55 selesai; BSD-54 notifikasi berikutnya) |




| E8 | Penimbangan dan transaksi | 4 | 8 / 9 | Sedang berjalan (BSD-56 s.d. BSD-63 selesai) |




| E9 | Riwayat, saldo, bukti transaksi | 4 | 2 / 5 | Sedang berjalan (BSD-65/66 selesai; BSD-67/68/69 berikutnya) |




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




| 17 Nov 2026 | BSD-21 | Menambahkan skema `users`, `bank_sampah_units`, `unit_staff` beserta enum `UserRole`, `UserStatus`, `ServiceStatus`, `PublicationStatus`, `UnitStaffStatus`; UUID `gen_random_uuid()`, waktu `TIMESTAMPTZ`, `unit_staff` unik per `(user_id, unit_id)`, index status publikasi/layanan dan status staf, FK `ON DELETE RESTRICT`. | Zhafran Najib | `be-bsd/prisma/schema.prisma`; migrasi `prisma/migrations/20261117000000_users_units_staff/migration.sql` (tabel + index + FK + `users_email_or_phone_check`); `npx prisma validate`, `npx prisma generate`, lint, test, build lulus | Selesai (sebagian: migrasi belum dijalankan/di-rollback ke PostgreSQL karena Docker tidak tersedia) |




| 17 Nov 2026 | BSD-22 | Menambahkan skema `waste_categories`, `waste_prices` (+ enum `ActiveStatus`): `unit_id` NULL = harga global, `price_per_kg DECIMAL(12,2)`, periode `DATE`, `is_simulated`, dua index histori. Anti-tumpang-tindih periode dijaga exclusion constraint `waste_prices_no_overlap` (`btree_gist` + `daterange`, `unit_id` di-`COALESCE`). | Zhafran Najib | `be-bsd/prisma/schema.prisma`; migrasi `prisma/migrations/20261117000100_waste_categories_prices/migration.sql`; `prisma validate` + `generate`, lint, test, build lulus | Selesai (migrasi belum dieksekusi ke PostgreSQL) |




| 17 Nov 2026 | BSD-23 | Menambahkan skema `deposits`, `deposit_items`, `transactions` (+ enum `DepositStatus`, `InspectionStatus`, `TransactionStatus`): berat `DECIMAL(10,3)`, nilai `DECIMAL(14,2)`, `unit_price_snapshot` + `line_total` di item, `transactions.deposit_id` unik dan `idempotency_key` unik untuk konfirmasi idempoten. | Zhafran Najib | `be-bsd/prisma/schema.prisma`; migrasi `prisma/migrations/20261117000200_deposits_items_transactions/migration.sql` (termasuk 4 CHECK: alasan pembatalan, estimasi > 0, berat aktual >= 0, alasan penolakan item); lint, test, build lulus | Selesai (migrasi belum dieksekusi ke PostgreSQL) |




| 17 Nov 2026 | BSD-24 | Menambahkan skema `transaction_events`, `content_articles`, `notifications` (+ enum `ArticleStatus`): audit event dengan status lama/baru, aktor, alasan, metadata; artikel slug unik; notifikasi per pengguna dengan index `(user_id, read_at)`. | Zhafran Najib | `be-bsd/prisma/schema.prisma`; migrasi `prisma/migrations/20261117000300_transaction_events_articles_notifications/migration.sql` (`transaction_events_target_check`); lint, test, build lulus | Selesai (migrasi belum dieksekusi ke PostgreSQL) |




| 17 Nov 2026 | BSD-25 | Menambahkan `be-bsd/prisma/seed.ts` (idempoten, upsert ID tetap): 2 unit simulasi (`is_simulated = true`, label "BSDU Simulasi", alamat "(data fiktif)"), 4 kategori, 4 harga global + 1 harga khusus unit (ditandai `is_simulated`), 4 akun uji tiap role dengan penugasan unit petugas. Menambahkan driver adapter Prisma 7 (`@prisma/adapter-pg`, `pg`, `@types/pg`, disetujui) dan `migrations.seed` di `prisma7.config.ts`; `tsconfig.json` mendapat `ts-node.experimentalResolver`. | Zhafran Najib | `be-bsd/prisma/seed.ts`, `be-bsd/prisma7.config.ts`, `be-bsd/tsconfig.json`, `be-bsd/package.json`; `tsc --noEmit`, lint, test, build lulus; seed berhenti di `ECONNREFUSED` karena PostgreSQL tidak berjalan | Selesai (sebagian: seed belum dijalankan ke database) |




| 17 Nov 2026 | BSD-26 | Menambahkan arsitektur API dasar: filter exception global yang selalu membalas `{statusCode, message, code}` (pesan bawaan Nest diterjemahkan ke bahasa Indonesia, kode dipetakan per status dan bisa ditimpa), `ValidationPipe` global (`whitelist`, `transform`) dengan `exceptionFactory` berisi pesan constraint bahasa Indonesia + `code: VALIDATION_ERROR`, didaftarkan lewat `APP_PIPE`/`APP_FILTER` di `AppModule`. Dependency baru disetujui: `class-validator`, `class-transformer`. | Zhafran Najib | `src/common/http-exception.filter.ts`, `src/common/validation.ts`, `src/app.module.ts`, `test/api-architecture.e2e-spec.ts`; `npm test`, `npm run test:e2e` (5 kasus), lint, build lulus | Selesai |




| 17 Nov 2026 | BSD-27 | Menambahkan dokumentasi OpenAPI: `src/common/swagger.ts` (`DocumentBuilder` judul "Bank Sampah Digital API", versi 0.1.0, `addBearerAuth`) dipanggil dari `main.ts` hanya bila `NODE_ENV !== 'production'`; UI di `/docs`, spesifikasi di `/docs-json`. Dependency baru disetujui: `@nestjs/swagger`. | Zhafran Najib | `src/common/swagger.ts`, `src/main.ts`, `test/api-hardening.e2e-spec.ts`; `tsc`, lint, test, test:e2e, build lulus | Selesai |




| 17 Nov 2026 | BSD-28 | Menambahkan keamanan dasar: `helmet` (CSP dimatikan karena Swagger UI inline), CORS hanya untuk origin di `CORS_ORIGINS` (default `http://localhost:3000`), rate limit global `ThrottlerModule` + `ThrottlerGuard` 100 permintaan/menit per IP dengan pesan bahasa Indonesia. Dependency baru disetujui: `helmet`, `@nestjs/throttler`. | Zhafran Najib | `src/common/security.ts`, `src/app.module.ts`, `src/main.ts`, `.env.example`; `test/api-hardening.e2e-spec.ts` (CORS, header keamanan, 429 pada permintaan ke-101); lint, test, test:e2e (9 kasus), build lulus | Selesai (BSD-28: batas ketat 5/menit endpoint auth aktif) |




| 17 Nov 2026 | BSD-29 | Menambahkan modul auth (register, login, logout, refresh): password di-hash scrypt (`scrypt$<salt>$<key>`, keylen 64) dengan `verify` via `timingSafeEqual`; registrasi publik hanya role `nasabah`; JWT access token (15m, payload `{sub, role, status}`) + refresh token (opaque, disimpan hash scrypt di tabel `refresh_tokens`, TTL 7 hari, rotasi per refresh, logout menghapus token); rate limit ketat auth 5 permintaan/menit via `@Throttle`. Dependency baru disetujui: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`. Migrasi `20261117153521_add_refresh_tokens` untuk tabel `refresh_tokens`. | Zhafran Najib | `src/modules/auth/*`, `src/common/prisma.service.ts`, `src/common/public.decorator.ts`, `src/app.module.ts`, `src/main.ts`, `test/auth.e2e-spec.ts`, `tsconfig.build.json`; `npm test`, `npm run test:e2e` (26 kasus), lint, build lulus; auth e2e 17 kasus lulus + login berjalan ke PostgreSQL | Selesai |




|| 17 Nov 2026 | BSD-30 | `be-bsd/src/modules/auth/` ditambah `forgotPassword` + `resetPassword`; migrasi `20261117164922_add_password_reset_tokens` (tabel `password_reset_tokens`). Respons forgot generik (`{ sent: true }` tanpa enumerasi akun), reset token sekali pakai TTL 30 menit, perbarui password scrypt, invalidate refresh token, rate limit ketat auth 5 permintaan/menit via `@Throttle`. | Zhafran Najib | `src/modules/auth/`, `src/modules/auth/dto/`, migrasi `20261117164922_add_password_reset_tokens`; `npm test`, `npm run test:e2e` (30 kasus e2e lulus), lint, build lulus | Selesai |









| 18 Nov 2026 | BSD-31 | RBAC lengkap: (1) `JwtAuthGuard` dipasang global lewat `{ provide: APP_GUARD, useClass: JwtAuthGuard }`, endpoint publik ditandai `@Public()` (auth register/login/refresh/forgot/reset, `/`, `/health`); (2) `PrismaModule` + `CommonModule` global agar `PrismaService` dan `UnitAccessService` bisa di-inject semua modul (sebelumnya hanya `AuthModule` yang menyediakan `PrismaService`); (3) `UnitAccessService` baru: `assertStaffOfUnit` (cek `unit_staff` aktif) dan `assertDepositOwner`/`assertTransactionOwner`; dipakai di `DepositService` (status/weight/snapshot/value/confirm), `TransactionService`, `ReportsService`; (4) baca data master (`GET /units`, `/waste-categories`, `/waste-prices`) dibuka untuk semua role login karena dibutuhkan nasabah saat mengajukan setoran; tulis tetap admin; (5) `TransactionModule` didaftarkan di `AppModule` (route `/transactions` sebelumnya 404); (6) identitas nasabah/petugas diambil dari token (`@CurrentUser('sub')`), bukan query `customerId`/`userId`; (7) perbaikan alur: DTO pengajuan memakai `@IsUUID` (bukan `@IsMongoId`) + pola berat desimal, `snapshotPrice` mencocokkan item per `categoryId` di pengajuan (sebelumnya memakai `categoryId` sebagai id item → 500), `updateWeight` dibatasi ke item milik pengajuan, konfirmasi idempoten mengembalikan transaksi yang sama saat retry (cek key sebelum validasi status), pembatalan nasabah wajib alasan. | Zhafran Najib | `src/app.module.ts`, `src/app.controller.ts`, `src/common/{common,prisma}.module.ts`, `src/common/services/unit-access.service.ts`, `src/modules/{auth,deposits,transactions,reports,units,waste-categories,waste-prices}/`; `npm run build` lulus, `npm run lint` (sisa warning lama), `npm test` 2/2, `npm run test:e2e` **30/30 lulus**; verifikasi manual ke server 3001: tanpa token 401, nasabah GET /units 200, nasabah GET /users 403, petugas unit Sukajadi GET /reports/petugas/Cibeunying 403 vs unit sendiri 200, admin GET /reports/petugas 403, alur pengajuan Cibeunying (status→berat→snapshot→nilai 2,4 kg × Rp1.500 = Rp3.600→konfirmasi) berhasil, retry konfirmasi dengan key sama mengembalikan id transaksi yang sama | Selesai |









| 19 Nov 2026 | BSD-33 | Menghubungkan form Login, Register, dan Lupa Kata Sandi ke be-bsd (bukan mock): `features/auth/api.ts` kini mengirim payload be-bsd (`phone` untuk register, `{ refreshToken }` saat logout) dan menyimpan sesi hasil login/register; `lib/api/client.ts` mengirim `Authorization: Bearer <accessToken>` dan otomatis mencoba satu kali `/auth/refresh` saat 401 lalu mengulang request; mode mock hanya aktif bila `NEXT_PUBLIC_API_URL` kosong. Aturan kata sandi di zod disamakan dengan be-bsd (huruf besar, huruf kecil, angka, simbol) agar pengguna mendapat pesan di klien sebelum 400. `fe-bsd/.env.local` berisi `NEXT_PUBLIC_API_URL=http://localhost:3001` (tidak di-commit). | Zhafran Najib | `fe-bsd/src/features/auth/{api,mock-auth,login-form,register-form,schemas}.*`, `fe-bsd/src/lib/api/client.ts`; `npx tsc --noEmit` bersih, `npm run lint` 0 error (15 warning lama), `npm run build` lulus; verifikasi server 3001: login `{user,accessToken,refreshToken,expiresIn}`, `GET /auth/me` OK, refresh merotasi token & token lama ditolak, logout mencabut refresh token, refresh setelah logout ditolak | Selesai |




| 19 Nov 2026 | BSD-34 | Auth state + proteksi route per role:




| 23 Nov 2026 | BSD-35 | API profil nasabah: `GET /auth/me` mengembalikan ringkasan profil `{id, name, email, phone, role, status, createdAt}` (Prisma `select` — tanpa `passwordHash`/`saldo`); `PATCH /auth/me` memperbarui name/email/phone (email & phone unik). Saldo `User.saldo` adalah akumulasi setoran, NOT dana cair (BSD-31) — tidak dikembalikan ke profil. Layar profil di FE (`app/nasabah/(tabs)/profil/page.tsx`) + API klien (`features/nasabah/api.ts`). | Zhafran Najib | `be-bsd/src/modules/auth/auth.service.ts`, `auth.controller.ts`, `fe-bsd/src/features/nasabah/types.ts`, `fe-bsd/src/features/nasabah/api.ts`, `fe-bsd/src/app/nasabah/(tabs)/profil/page.tsx`; `tsc`/`lint` bersih, curl: GET /auth/me aman (tanpa passwordHash), PATCH update sukses | Selesai | `lib/auth/session.ts` baru (simpan access/refresh token + user di `localStorage`, tulis cookie `bsd_session` berisi role untuk proxy, `clearSession` saat 401/logout); `lib/auth/index.ts` mengekspor API sesi; proxy (middleware) tidak diubah karena sudah memakai `resolveAccess`. Verifikasi: `/nasabah` sebagai petugas → 307 ke `/petugas`, `/petugas` sebagai nasabah → 307 ke `/nasabah`, `/admin` sebagai petugas → 307, role cocok → 200, tanpa cookie → 307 ke `/login?next=...`, halaman publik (`/tentang`, `/artikel`) → 200 tanpa login. Catatan: cookie hanya gating tampilan (bisa dipalsukan); be-bsd tetap penentu akses data. | Zhafran Najib | `fe-bsd/src/lib/auth/{session.ts,index.ts,guard.ts}`, `fe-bsd/src/proxy.ts`; bukti curl status/redirect di atas | 




| 17 Nov 2026 | BSD-32 | Menambahkan modul `users` + `UserController` / `UserService` untuk admin: `GET /users` (daftar petugas, filter role/status), `POST /users` (buat petugas baru; email/phone unik, role dasar `petugas`, terhubung ke unit lewat `unit_staff`), `PATCH /users/:id/aktifasi` (aktifkan/nonaktifkan). Migrasi `20261117164922` (password_reset_tokens) sudah punya tabel `users`; cek FK `unit_staff` RESTRICT. `prisma validate` + `generate`, lint, test, build lulus. | Zhafran Najib | `be-bsd/src/modules/users/`, `be-bsd/prisma/migrations/20261117164922_add_password_reset_tokens/migration.sql`; `tsc`, lint, build lulus | Selesai |









|




| 17 Nov 2026 | BSD-37 | Menambahkan API CRUD unit Bank Sampah: `GET /units` (daftar, filter publicationStatus/serviceStatus), `POST /units` (buat), `PATCH /units/:id` (perbarui), `DELETE /units/:id` (hapus). Hanya admin yang diizinkan (`@UseGuards(RoleGuard) + @Roles('admin')`). `address` opsional, `latitude`/`longitude` optional, `operatingHours`, `contactPhone`, `contactEmail`, `serviceStatus`, `publicationStatus`, `isSimulated` tersimpan. `prisma validate` + `generate`, lint, test, build lulus. | Zhafran Najib | `be-bsd/src/modules/units/`, `be-bsd/src/modules/units/dto/`; `tsc`, lint, build lulus | Selesai |









|| 17 Nov 2026 | BSD-38 | Menambahkan API CRUD kategori sampah: `GET /waste-categories` (daftar, filter status), `POST /waste-categories`, `PATCH /waste-categories/:id`, `DELETE /waste-categories/:id`. Hanya admin yang diizinkan. Kategori dapat diaktifkan/nonaktifkan. `prisma validate` + `generate`, lint, test, build lulus. | Zhafran Najib | `be-bsd/src/modules/waste-categories/`, `be-bsd/src/modules/waste-categories/dto/`; `tsc`, lint, build lulus | Selesai |









|| 17 Nov 2026 | BSD-39 | Menambahkan API harga sampah + histori: `GET /waste-prices` (daftar, filter status/categoryId), `POST /waste-prices`, `PATCH /waste-prices/:id`, `DELETE /waste-prices/:id`. Harga aktif dipilih berdasarkan tanggal berlaku dan unit. `unit_id` NULL = harga global; `is_simulated` untuk data contoh. Setiap perubahan harga dicatat dengan `createdBy` & `created_at` (NFR-04). `prisma validate` + `generate`, lint, test, build lulus. | Zhafran Najib | `be-bsd/src/modules/waste-prices/`, `be-bsd/src/modules/waste-prices/dto/`; `tsc`, lint, build lulus | Selesai |









### Sprint 3 (usulan 14–25 Des 2026) – Pencarian Unit dan Pengajuan Setoran









**Sprint Goal:** Nasabah dapat mencari unit dan mengajukan setoran; petugas melihat pengajuan unitnya.









| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |




| --- | --- | --- | --- | --- | --- |




| 18 Nov 2026 | BSD-49 | `POST /deposits` (role nasabah) menyimpan pengajuan + item kategori. DTO `CreateDepositDto` memakai `@IsUUID` untuk unit/kategori dan pola berat desimal positif (maks 3 desimal, dikirim string); unit harus published. Ditambahkan `GET /deposits` (daftar pengajuan milik nasabah, terbaru dulu) karena sebelumnya hanya ada `GET /deposits/:id`. | Zhafran Najib | `be-bsd/src/modules/deposits/`; e2e BE 30/30 lulus, build lulus; curl 2 item (2 kg PET @4000 + 0,5 kg Kaleng @8000) → `estimatedTotal` 12000, `code` BSD-2026-49259E | Selesai |




| 18 Nov 2026 | BSD-50 | `withEstimate()` mengisi `items[].pricePerKg`, `items[].estimatedValue`, `estimatedTotal`, dan label `"bukan nilai final"` pada create/detail/daftar. Harga memakai `activePrices()` dengan aturan harga unit menimpa global; respons juga memuat `code` tiket, `unitName`, `unitAddress`, `categoryName`. | Zhafran Najib | `be-bsd/src/modules/deposits/deposit.service.ts`; PET unit Cibeunying terbukti 4000 (bukan global 3500), e2e & build lulus | Selesai |




| 18 Nov 2026 | BSD-51 | API status & pembatalan: `GET /deposits/:id` (hanya milik nasabah) dan `PATCH /deposits/:id/batal` (alasan wajib, hanya status Menunggu, menulis `cancelledAt`/`cancellationReason` + event di `transaction_events`). | Zhafran Najib | `be-bsd/src/modules/deposits/`; e2e & build lulus | Selesai |




| 19 Nov 2026 | BSD-51 | UI pembatalan di FE: `nasabahApi.cancelDeposit` + aksi `cancelDeposit` di store (mengganti item deposit dari respons), tombol "Batalkan Pengajuan" pada detail setoran status Menunggu dengan panel alasan wajib (min. 5 karakter), tombol nonaktif saat proses, error bahasa Indonesia, dan tampilan otomatis berganti ke Dibatalkan. Baris "Dibatalkan oleh" yang mengarang "Petugas Unit" dihapus karena API tidak mengembalikan pelaku. | Zhafran Najib | `fe-bsd/src/features/nasabah/{api.ts,prototype-store.tsx,rincian-setoran.tsx}`; curl 3001: batal sukses, batal kedua 403, alasan kosong 400; `tsc` bersih, lint 0 error, `next build` lulus | Selesai |




| 19 Nov 2026 | BSD-52 | Layar setor membaca API sungguhan: `features/nasabah/api.ts` baru (mapper `toUnit`/`toCategory`/`toDeposit`, `resolvePrice` harga unit menimpa global, `nasabahApi`), `prototype-store.tsx` memuat units/kategori/harga/deposits/transaksi dengan kontrak `usePrototype()` tetap, `categoriesForUnit(unitId)` dipakai layar pilih unit, detail unit, jenis, berat, ringkasan. Daftar & detail unit dapat loading/error state; jarak disembunyikan (koordinat unit belum ada, BSD-46) dan filter "Terdekat" berhenti mengurutkan angka palsu. Konfirmasi mengirim berat sebagai string desimal. | Zhafran Najib | `fe-bsd/src/features/nasabah/{api.ts,prototype-store.tsx,category-tile.tsx}`, layar `app/nasabah/(flow)/setor/**`; `tsc` bersih, lint 0 error, `next build` lulus; bentuk respons dicocokkan ke mapper via curl 3001 | Selesai |




| 19 Nov 2026 | BSD-53 | Riwayat & detail setoran memakai status dari API dengan label Indonesia yang konsisten; nilai final hanya untuk status Selesai (dari `transactions.totalValue` per `depositId`), status lain berlabel "Estimasi". Pengelompokan "Hari ini" tidak lagi terpaku tanggal data contoh (25 Okt 2026) — kini tanggal perangkat dan label tanggal mengikuti hari berjalan. | Zhafran Najib | `fe-bsd/src/features/nasabah/deposit-ui.tsx`, `app/nasabah/(tabs)/riwayat/page.tsx`; `GET /deposits` berisi 4 pengajuan (2 menunggu, 2 selesai) terpetakan benar | Selesai |




| 19 Nov 2026 | BSD-55 | Daftar pengajuan untuk petugas: `GET /deposits/petugas?status=` (role petugas) membaca `unit_staff` aktif — tanpa penugasan aktif hasilnya kosong; respons membawa data nasabah, estimasi, nilai final, kode, unit, dan item. FE petugas beralih dari `localStorage` ke API lewat `features/petugas/api.ts` + `usePetugasQueue`, dengan loading/error/muat ulang di beranda, antrean, dan riwayat. | Zhafran Najib | `be-bsd/src/modules/deposits/`, `fe-bsd/src/features/petugas/{api.ts,store.ts}`, `fe-bsd/src/app/petugas/(tabs)/*`; curl: Cibeunying 4 pengajuan, Sukajadi 0, nasabah 403, status salah 400, filter 1/0/2/1; `tsc` bersih, lint 0 error, `next build` lulus | Selesai |









### Sprint 4 (usulan 28 Des 2026–8 Jan 2027) – Penimbangan dan Transaksi









**Sprint Goal:** Alur pengajuan sampai transaksi selesai berjalan end-to-end dengan snapshot harga dan riwayat.









| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |




| --- | --- | --- | --- | --- | --- |




| 19 Nov 2026 | BSD-56 | `PATCH /deposits/:id/status` (petugas unit) mengubah Menunggu → Diproses dengan `updateMany` bersyarat + event dalam satu `$transaction`; FE tombol "Terima & Periksa" memanggil API, menonaktifkan tombol saat proses, menampilkan error bahasa Indonesia, dan baru pindah halaman setelah sukses. | Zhafran Najib | `be-bsd/src/modules/deposits/`, `fe-bsd/src/features/petugas/{api.ts,store.ts}`, `fe-bsd/src/app/petugas/(flow)/pengajuan/[id]/page.tsx`; curl: Sukajadi 403, nasabah 403, Cibeunying 200 → diproses, retry 403; e2e BE 30/30, `tsc`/lint/build lulus | Selesai |




| 19 Nov 2026 | BSD-57 | `PATCH /deposits/:id/weight` menyimpan berat aktual per item + koreksi kategori aktif dengan validasi DTO dan event atomik; FE layar timbang memakai harga API, pilihan koreksi jenis, dan penyimpanan async dengan error bahasa Indonesia. | Zhafran Najib | `be-bsd/src/modules/deposits/{dto/update-weight.dto.ts,deposit.service.ts,deposit.controller.ts}`, `fe-bsd/src/app/petugas/(flow)/pengajuan/[id]/timbang/page.tsx`, `fe-bsd/src/features/petugas/{api.ts,store.ts}`, `fe-bsd/src/features/nasabah/{api.ts,types.ts}`, `fe-bsd/src/features/petugas/hasil-summary.tsx`; curl: 0/-1/2.1234/abc → 400, kategori asing 400, item asing 404, berat 2.75 tersimpan, koreksi kategori berhasil; e2e BE 30/30, `tsc`/lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-58 | Snapshot harga diisi server saat penimbangan: `WastePriceService.resolveActive()` memilih harga aktif per unit/kategori/tanggal (harga unit menimpa global), berat aktual + `unitPriceSnapshot` + event ditulis dalam satu `$transaction`; route `PATCH /deposits/:id/snapshoot` yang menerima harga dari klien dihapus. `confirmTransaction`/`calculateValue` menolak (400) item tanpa berat/snapshot. | Zhafran Najib | `be-bsd/src/modules/waste-prices/waste-prices.service.ts`, `be-bsd/src/modules/deposits/{deposit.service.ts,deposit.controller.ts,deposit.module.ts}`; curl: PET Cibeunying 4000 & Kaleng 8000 (bukan global 3500), harga diubah 4000 → 4500 tidak mengubah snapshot lama, timbang ulang memakai harga aktif baru, konfirmasi/nilai sebelum timbang → 400, 2,25 kg × 4000 = 9000,00; e2e BE 30/30, `tsc`/lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-39 | Pemilihan harga aktif per tanggal/unit dipindah ke modul harga (`resolveActive`) dan `createdBy` diisi dari token pada `POST`/`PATCH /waste-prices`; dua kriteria selesai yang tertunda sejak 19 Nov 2026 kini terpenuhi. | Zhafran Najib | `be-bsd/src/modules/waste-prices/{waste-prices.service.ts,waste-prices.controller.ts}`; curl: `PATCH /waste-prices/:id` mengisi `createdBy` admin dan tampil di `GET`; e2e BE 30/30, lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-59 | Kalkulasi nilai server memakai satu fungsi Decimal: `lineTotal` disimpan di `deposit_items` saat penimbangan, total = jumlah item, dipakai bersama oleh `/value` dan konfirmasi; test unit presisi ditambahkan. | Zhafran Najib | `be-bsd/src/modules/deposits/{deposit-totals.ts,deposit-totals.spec.ts,deposit.service.ts}`; curl: 2,25 × 4000 = 9000 + 1,5 × 8000 = 12000, `/value` 21000,00 & berat 3,750, konfirmasi + retry key sama → id transaksi sama; unit test 5/5, e2e 30/30, tsc/lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-60 | Konfirmasi transaksi diperketat: cek kunci, transisi status bersyarat, pembuatan transaksi, dan event berada dalam satu `$transaction`; retry kunci sama mengembalikan transaksi lama, kunci lain/duplikat ditolak 409. DTO kunci ditambahkan dan 7 test kasus konfirmasi ditulis. | Zhafran Najib | `be-bsd/src/modules/deposits/{deposit.service.ts,deposit.controller.ts,dto/confirm-transaction.dto.ts}`, `be-bsd/test/deposit-confirm.e2e-spec.ts`; curl: retry sama id identik, kunci lain 409, nasabah 403, kunci kosong 400; e2e 37/37, unit 5/5, tsc/lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-61 | Jejak perubahan status dipastikan lengkap: pembatalan sebelum/sesudah konfirmasi kini menulis status + `transaction_events` atomik dengan alasan di kolom `reason`, dan test menverifikasi field status lama/baru/pelaku/waktu untuk setiap transisi. | Zhafran Najib | `be-bsd/src/modules/deposits/deposit.service.ts`, `be-bsd/test/transaction-events.e2e-spec.ts`; curl + query DB: `CANCELLED | menunggu | dibatalkan | <nasabah> | Uji audit BSD-61 | created_at` terisi; e2e 40/40, unit 5/5, tsc/lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-62 | Admin dapat membatalkan/mengoreksi transaksi Selesai lewat `POST /transactions/:id/cancel` dan `/correct`. Alasan wajib, status transaksi dijaga dengan `updateMany where status = active`, perubahan + event + saldo dalam satu transaksi DB; saldo dihitung ulang dari transaksi aktif/terkoreksi sehingga tidak dobel. | Zhafran Najib | `be-bsd/src/modules/transactions/{transaction.service.ts,transaction.controller.ts,dto/transaction-action.dto.ts}`, `be-bsd/test/transaction-actions.e2e-spec.ts`; curl + query DB: batal 5000 → saldo 27000,00, koreksi 21000 → 24000 dengan saldo 30000,00, retry 409, tanpa alasan 400; e2e 47/47, unit 5/5, tsc/lint/build lulus | Selesai |




| 22 Nov 2026 | BSD-63 | Alur petugas tersambung penuh ke REST API: ringkasan hasil timbang mengambil nilai dari `POST /deposits/:id/value`, konfirmasi memanggil `POST /deposits/:id/confirm` dengan kunci idempotensi (bukan simulasi `setTimeout`); status loading/error/retry dan label offline ditambahkan. | Zhafran Najib | `fe-bsd/src/features/petugas/{api.ts,store.ts,hasil-summary.tsx}`, `fe-bsd/src/app/petugas/(flow)/pengajuan/[id]/{hasil,konfirmasi}/page.tsx`; curl: `/value` 21000,00 dan konfirmasi 21000,00, daftar petugas Selesai; 4 rute 200; tsc/lint(0 error)/build lulus | Selesai |




| 23 Nov 2026 | BSD-65 | Riwayat & detail transaksi nasabah dipastikan memenuhi FR-14/TC-07: daftar difilter dari token, detail memuat unit, berat, snapshot, `lineTotal`, status, dan alasan pembatalan lewat event. | Zhafran Najib | `be-bsd/src/modules/transactions/transaction.service.ts`, `be-bsd/test/transaction-history.e2e-spec.ts`; curl 3001: nasabah A 5 transaksi, detail unit Cibeunying + 9000/12000 + alasan "Uji batal BSD-62", nasabah baru `[]` & detail A 403, petugas 403; e2e 52/52, unit 5/5, tsc/lint/build lulus | Selesai |




|| 23 Nov 2026 | BSD-67 | UI Riwayat, Detail, dan Saldo nasabah: daftar difilter dari API, detail transaksi memuat unit, berat, snapshot, lineTotal, status, dan alasan pembatalan lewat event; nilai final hanya untuk status Selesai.




| Zhafran Najib | `fe-bsd/src/app/nasabah/(tabs)/riwayat/`, `fe-bsd/src/app/nasabah/(tabs)/saldo/`, `be-bsd/src/modules/transactions/transaction.service.ts`; e2e 52/52, tsc/lint/build lulus | Selesai |




|| 23 Nov 2026 | BSD-68 | Halaman detail bukti transaksi (unit, berat, snapshot, lineTotal, status, alasan pembatalan) di `fe-bsd/src/app/nasabah/riwayat/[id]/`.




| Zhafran Najib | `fe-bsd/src/app/nasabah/riwayat/[id]/` | Selesai |




|| 23 Nov 2026 | BSD-69 | Daftar riwayat unit untuk petugas dari API `GET /deposits/petugas` + `usePetugasQueue`.




| Zhafran Najib | `fe-bsd/src/app/petugas/(tabs)/riwayat/`, `be-bsd/src/modules/deposits/` | Selesai |




|| 23 Nov 2026 | BSD-70 | Ringkasan dashboard petugas `GET /reports/petugas/:unitId` — jumlah pengajuan dan transaksi harian untuk unit yang ditugaskan.




| Zhafran Najib | `be-bsd/src/modules/reports/` | Selesai |




|| 23 Nov 2026 | BSD-78 | Manifest PWA + pendaftaran service worker (`/sw.js`) + ikon: aplikasi dapat di-install di perangkat Android.




| Zhafran Najib | `fe-bsd/src/app/manifest.ts`, `fe-bsd/src/components/pwa-register.tsx` | Selesai |




|| 23 Nov 2026 | BSD-79 | Halaman offline + banner offline + retry; data transaksi dan saldo memakai network-first.




| Zhafran Najib | `fe-bsd/src/app/offline/`, `fe-bsd/src/components/offline-banner.tsx`, `fe-bsd/src/lib/use-online.ts` | Selesai |




|| *isi* |  |  |  |  |  |









### Sprint 5 (usulan 11–22 Jan 2027) – Integrasi, Website, Testing









**Sprint Goal:** Website dan dashboard selesai, pengujian end-to-end lulus, siap UAT dan pilot.









| Tanggal | ID Task | Pekerjaan yang Dilakukan | Pelaksana | Hasil / Bukti | Status |




| --- | --- | --- | --- | --- | --- |




| 25 Nov 2026 | BSD-44 | Verifikasi API detail unit: `GET /units/:id` memuat alamat, jam operasional, status, kategori, dan harga aktif (`prices` dengan `status: active` beserta `category`) dari commit `ab9835f`; kriteria FR-04/FR-06 terpenuhi. | Zhafran Najib | `be-bsd/src/modules/units/units.service.ts` (`findOne`); lint/build/test BE lulus | Selesai |






| 25 Nov 2026 | BSD-45 | Query `GET /units` divalidasi lewat `QueryUnitsDto` (`search`, `area`, `publicationStatus`, `serviceStatus`; enum + pesan bahasa Indonesia); kata kunci di-trim di service, pencarian OR nama/alamat dan filter area/status layanan dipertahankan. Test filter 3 kasus ditambahkan. | Zhafran Najib | `be-bsd/src/modules/units/{dto/query-units.dto.ts,units.controller.ts,units.service.ts,units.filter.spec.ts}`; `npm test` 8/8 lulus, lint 3 warning lama, build lulus | Selesai |






| 25 Nov 2026 | BSD-47 | Verifikasi halaman Daftar/Detail bank sampah: daftar memakai loading, empty, dan error state dari `usePrototype()` (error ada tombol retry); detail menampilkan alamat, jam operasional, status Buka/Tutup, harga aktif berlabel simulasi, dan petunjuk "Cara menyetor ke unit ini" (TC-02). Tidak ada perubahan kode. | Zhafran Najib | `fe-bsd/src/app/nasabah/(flow)/setor/{page.tsx,[unitId]/page.tsx}`, `fe-bsd/src/features/nasabah/prototype-store.tsx`; `npm run build` 50 route lulus, `tsc --noEmit` bersih, lint 0 error (16 warning lama) | Selesai |

| 25 Nov 2026 | BSD-48 | Pencarian nama/alamat dan filter "Buka Sekarang" dikirim ke `GET /units` lewat `nasabahApi.units({ search, publicationStatus, serviceStatus }, signal)` dengan debounce 250 ms dan abort permintaan usang; filter "Menerima Logam"/"Terdekat" tetap di klien. Hasil dipetakan dengan kategori aktif unit; loading/empty/error + retry tetap tersedia. | Zhafran Najib | `fe-bsd/src/features/nasabah/api.ts`, `fe-bsd/src/app/nasabah/(flow)/setor/page.tsx`; `npm run build` 50 route lulus, `tsc --noEmit` bersih, lint 0 error (16 warning lama) | Selesai |






| *isi* |  |  |  |  |  |









## 5. Changelog (Perubahan yang Sudah Dikerjakan)









Format mengikuti Keep a Changelog. Versi mengikuti Semantic Versioning (0.x.y selama pengembangan MVP).









### &#91;Belum Dirilis\]









**Added**









- [BSD-47][FE] Halaman daftar/detail bank sampah terverifikasi: state loading/empty/error (dengan retry) dan informasi alamat, jam, status, serta petunjuk setoran sesuai TC-02.
- [BSD-48][FE] Pencarian dan filter unit memanggil `GET /units` dengan `search`/`serviceStatus` (debounce 250 ms, abort, retry); filter logam/terdekat tetap di klien dan hasil memakai kategori aktif unit.




- [BSD-45][BE] Validasi query `GET /units` (`search`, `area`, `publicationStatus`, `serviceStatus`) dengan pesan bahasa Indonesia; pencarian nama/alamat dan filter area/status layanan diuji 3 kasus.




- [BSD-44][BE] Detail unit memuat kategori dan harga aktif (verifikasi kriteria FR-04/FR-06).




- Dokumen PRD v1.0, BACKLOG v1.0, dan CATATAN PENGERJAAN v1.0 (11 Nov 2026).




- [BSD-21][DB] Skema Prisma `User`, `BankSampahUnit`, `UnitStaff` + enum role/status, migrasi `20261117000000_users_units_staff` (tabel `users`, `bank_sampah_units`, `unit_staff`, index, FK, constraint email-atau-HP).




- [BSD-22][DB] Skema Prisma `WasteCategory`, `WastePrice` + enum `ActiveStatus`, migrasi `20261117000100_waste_categories_prices` (harga global via `unit_id` NULL, `is_simulated`, CHECK harga/periode, exclusion constraint `waste_prices_no_overlap`).




- [BSD-23][DB] Skema Prisma `Deposit`, `DepositItem`, `Transaction` + enum status, migrasi `20261117000200_deposits_items_transactions` (Decimal berat/nilai, `unit_price_snapshot`, unik `deposit_id` & `idempotency_key`, 4 CHECK).




- [BSD-24][DB] Skema Prisma `TransactionEvent`, `ContentArticle`, `Notification` + enum `ArticleStatus`, migrasi `20261117000300_transaction_events_articles_notifications` (audit event, slug unik, index notifikasi).




- [BSD-25][DB] `be-bsd/prisma/seed.ts`: data simulasi (2 unit, 4 kategori, 5 harga, 4 akun uji tiap role) yang ditandai `is_simulated`/label simulasi; didukung driver adapter `@prisma/adapter-pg` + `pg` dan konfigurasi `migrations.seed`.




- [BSD-26][BE] Arsitektur API dasar: filter exception global `{statusCode, message, code}` dengan pesan bahasa Indonesia, serta `ValidationPipe` global (`whitelist`, `transform`) yang menolak input tidak valid dengan pesan bahasa Indonesia (`code: VALIDATION_ERROR`); dependency `class-validator` + `class-transformer` (disetujui) dan test e2e `test/api-architecture.e2e-spec.ts`.




- [BSD-27][BE] Dokumentasi OpenAPI via `@nestjs/swagger` di `/docs` + `/docs-json` (aktif di luar produksi), konfigurasi di `src/common/swagger.ts`.




- [BSD-28][BE] Keamanan dasar API: `helmet`, CORS terbatas `CORS_ORIGINS`, dan rate limit global 100 permintaan/menit per IP (`@nestjs/throttler`) dengan pesan bahasa Indonesia; bukti e2e di `test/api-hardening.e2e-spec.ts`.




- [BSD-29][BE] Modul auth lengkap: register (hanya role `nasabah`, password scrypt `scrypt$<salt>$<key>`, duplikat email/HP → 409 `DUPLICATE_CREDENTIALS`), login (pesan umum `INVALID_CREDENTIALS`, akun nonaktif `ACCOUNT_INACTIVE`), logout (hapus refresh token), refresh (rotasi, TTL 7 hari) dengan JWT access token 15m + refresh token via tabel `refresh_tokens` (migrasi `20261117153521_add_refresh_tokens`); rate limit ketat auth 5 permintaan/menit via `@Throttle`. Dependency baru disetujui: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`.




|- [BSD-30][BE] Reset kata sandi: `POST /auth/forgot-password` (`{ email }` → `{ sent: true }`, respons generik tanpa enumerasi akun) dan `POST /auth/reset-password` (`{ token, password }` → hapus token sekali pakai, TTL 30 menit, validasi via tabel `password_reset_tokens` `20261117164922_add_password_reset_tokens`, perbarui password scrypt, invalidate refresh token); rate limit ketat auth 5 permintaan/menit via `@Throttle`.




- [BSD-31][BE] Guard RBAC global: `JwtAuthGuard` terpasang sebagai `APP_GUARD` dan endpoint publik ditandai `@Public()`; `RoleGuard` + `@Roles()` tetap per-route untuk pembatasan role. `CommonModule`/`PrismaModule` global menyediakan `PrismaService` + `UnitAccessService` (`assertStaffOfUnit`, `assertDepositOwner`, `assertTransactionOwner`) yang dipakai di deposit/transaksi/laporan. Identitas pengguna diambil dari token. Baca data master (units/kategori/harga) terbuka untuk semua role login; tulis tetap admin. `TransactionModule` didaftarkan. Perbaikan alur: DTO pengajuan `@IsUUID` + pola berat desimal, snapshot harga per `categoryId` dalam pengajuan, berat hanya item milik pengajuan, konfirmasi idempoten mengembalikan transaksi yang sama saat retry, pembatalan wajib alasan.




|- [BSD-32][BE] Modul `users` + `UserController` / `UserService` untuk admin: `GET /users` (daftar petugas, filter role/status), `POST /users` (buat petugas baru; email/phone unik, role dasar `petugas`, terhubung ke unit lewat `unit_staff`), `PATCH /users/:id/aktifasi` (aktifkan/nonaktifkan). `prisma validate` + `generate`, lint, test, build lulus.




|- [BSD-37][BE] API CRUD unit Bank Sampah: `GET /units` (daftar, filter publicationStatus/serviceStatus), `POST /units` (buat), `PATCH /units/:id` (perbarui), `DELETE /units/:id` (hapus). Hanya admin yang diizinkan (`@UseGuards(RoleGuard) + @Roles('admin')`). `address` opsional, `latitude`/`longitude` optional, `operatingHours`, `contactPhone`, `contactEmail`, `serviceStatus`, `publicationStatus`, `isSimulated` tersimpan. `prisma validate` + `generate`, lint, test, build lulus.




|- [BSD-38][BE] API CRUD kategori sampah: `GET /waste-categories` (daftar, filter status), `POST /waste-categories`, `PATCH /waste-categories/:id`, `DELETE /waste-categories/:id`. Hanya admin yang diizinkan. Kategori dapat diaktifkan/nonaktifkan. `prisma validate` + `generate`, lint, test, build lulus.




|- [BSD-39][BE] API harga sampah + histori: `GET /waste-prices` (daftar, filter status/categoryId), `POST /waste-prices`, `PATCH /waste-prices/:id`, `DELETE /waste-prices/:id`. `unit_id` NULL = harga global; `is_simulated` untuk data contoh. `created_at` tersimpan. Catatan: pemilihan harga aktif per tanggal/unit masih di `deposit.service.ts` dan `createdBy` belum diisi (ditutup 22 Nov 2026 lewat BSD-39/58). `prisma validate` + `generate`, lint, test, build lulus.




||- [BSD-49][BE] API pembuatan pengajuan setoran: `POST /deposits` (nasabah, role: nasabah), status `Menunggu`, item kategori + estimasi berat. Validasi unit published, kategori valid, berat > 0. `prisma validate` + `generate`, lint, test, build lulus.




||- [BSD-50][BE] Estimasi nilai: respons memuat `estimatedValue` = `estimatedWeight` x `pricePerKg` (harga aktif, unit/kategori), berlabel `"bukan nilai final"` (FR-08). `prisma validate` + `generate`, lint, test, build lulus.




||- [BSD-51][BE] API status & pembatalan: `GET /deposits/:id` (nasabah, data milik), `PATCH /deposits/:id/batal` (alasan, role: nasabah). Status `Menunggu` hanya bisa dibatalkan. `cancelledAt`, `cancellationReason` terisi. `prisma validate` + `generate`, lint, test, build lulus.




- [BSD-52][FE] Layar setor memakai API be-bsd: `features/nasabah/api.ts` (mapper `toUnit`/`toCategory`/`toDeposit`, `resolvePrice`, `nasabahApi`) + `prototype-store.tsx` memuat units/kategori/harga/deposits/transaksi dengan kontrak `usePrototype()` tetap; `categoriesForUnit(unitId)` dipakai layar pilih unit, detail unit, jenis, berat, dan ringkasan; daftar/detail unit punya loading + error state.




- [BSD-53][FE] Riwayat & detail setoran memakai status dari API dengan nilai final hanya untuk status Selesai (dari `transactions.totalValue`) dan estimasi untuk status lain.




- [BSD-51][FE] Pembatalan pengajuan oleh nasabah: `cancelDeposit` di `nasabahApi` dan store, panel konfirmasi beralasan pada detail setoran status Menunggu (textarea wajib min. 5 karakter, tombol nonaktif + "Membatalkan…" saat proses, error bahasa Indonesia, fokus kembali ke tombol saat dibatalkan).




- [BSD-55][BE] `GET /deposits/petugas?status=` khusus role petugas: pengajuan dari `unit_staff` aktif milik user (tanpa penugasan → daftar kosong), terbaru dulu, status tak dikenal 400. Respons memuat `customerName`/`customerPhone`, `estimatedTotal`, `finalTotal` (dari transaksi), `code`, `unitName`, `unitAddress`, dan item per kategori.




- [BSD-55][FE] `features/petugas/api.ts` + `usePetugasQueue` di `features/petugas/store.ts`: beranda, antrean, dan riwayat petugas membaca `GET /deposits/petugas` dengan state loading/error/muat ulang; label "(simulasi)" dihapus karena data berasal dari server.




- [BSD-56][BE] `PATCH /deposits/:id/status`: transisi Menunggu → Diproses hanya untuk petugas unit terkait, `updateMany` bersyarat + event di satu `$transaction` (aman saat dua petugas menekan bersamaan), respons memuat estimasi berlabel "bukan nilai final" dan data nasabah.




- [BSD-56][FE] `petugasApi.acceptDeposit` + aksi store mengganti item dari respons API; tombol "Terima & Periksa" menunggu respons (label "Memproses…", tombol nonaktif, error bahasa Indonesia) dan baru berpindah ke periksa setelah sukses.




- [BSD-57][BE] `PATCH /deposits/:id/weight` dengan `UpdateWeightDto`: berat desimal positif (maks 3 desimal), koreksi kategori aktif, item harus milik pengajuan, update + event dalam satu `$transaction`.




- [BSD-57][FE] `petugasApi.updateWeight` + `weighDeposit` async; layar timbang memakai harga aktif API, `<select>` koreksi jenis sampah per item, tombol "Simpan Berat Aktual" menunggu respons dengan error bahasa Indonesia.




- [BSD-58][BE] `PATCH /deposits/:id/weight` mengisi `unitPriceSnapshot` dari harga aktif (server), memvalidasi kategori pengganti aktif, dan menulis berat + kategori + snapshot + event `WEIGHT_UPDATE` dalam satu `$transaction`. `assertWeighed()` menolak konfirmasi/nilai (400) bila masih ada item tanpa berat aktual atau snapshot.




- [BSD-59][BE] `deposit-totals.ts`: `lineTotalOf()` dan `depositTotals()` memakai `Decimal` untuk `line_total = berat aktual × snapshot` dan total keseluruhan; `deposit_items.lineTotal` kini tersimpan saat penimbangan dan ikut direspons item. Unit test presisi/penjumlahan ditambahkan.




- [BSD-60][BE] `ConfirmTransactionDto` memvalidasi `idempotencyKey` (wajib, teks, maks 100 karakter); test konfirmasi dengan provider tiruan mencakup atomisitas, replay kunci sama, duplikat kunci lain, misuse kunci lintas pengajuan, RBAC unit, dan status prasyarat.




- [BSD-61][BE] Test `transaction-events.e2e-spec.ts` memverifikasi pencatatan status lama/baru/pelaku/alasan untuk pembatalan, pembatalan pasca-konfirmasi, dan transisi Menunggu → Diproses.




- [BSD-62][BE] `CancelTransactionDto` dan `CorrectTransactionDto` mewajibkan alasan berisi teks bukan spasi; koreksi juga mewajibkan minimal satu `itemId` UUID dengan berat desimal positif.




- [BSD-63][FE] `petugasApi.value()` dan `petugasApi.confirm()` ditambahkan; `useDepositValue()` mengambil nilai server dengan state galat dan tombol retry yang memakai kunci yang sama.




- [BSD-65][BE] Test `transaction-history.e2e-spec.ts` (5 kasus): filter daftar dari token, detail lengkap, 403 untuk transaksi nasabah lain, 404 untuk ID tidak ada, dan metadata role nasabah pada kedua rute.




|- [BSD-66][BE] `GET /transactions/saldo` (nasabah) mengembalikan `saldo` dan keterangan "Catatan nilai setoran, bukan dana yang dapat ditarik."; test `transaction-saldo.e2e-spec.ts` (3 kasus) mencakup filter status, nol tanpa transaksi, dan pembacaan tanpa penulisan.




|- [BSD-67][FE] UI Riwayat, Detail, dan Saldo nasabah memakai status API; detail transaksi menyertakan unit, berat, snapshot, lineTotal, status, alasan pembatalan; nilai final hanya untuk status Selesai.









|- [BSD-68][FE] Halaman bukti transaksi terhubung ke API (unit, berat, snapshot, lineTotal, status, alasan pembatalan).









|- [BSD-68][FE] Halaman bukti transaksi terhubung ke API (unit, berat, snapshot, lineTotal, status, alasan pembatalan).


|- [BSD-69][FE] Daftar riwayat unit untuk petugas dari API unit-scoped (`GET /deposits/petugas`).


|- [BSD-70][BE] Ringkasan dashboard petugas `GET /reports/petugas/:unitId` (hanya unit yang ditugaskan); jumlah pengajuan & transaksi harian.


|- [BSD-78][FE] Manifest PWA + service worker + ikon; aplikasi dapat di-install di Android.


|- [BSD-79][FE] Halaman offline + banner + retry; data transaksi & saldo network-first.







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




- [BSD-25][BE/DB] Backend kini memakai driver adapter Prisma 7 (`@prisma/adapter-pg`, `pg`, `@types/pg`) dan perintah seed `ts-node prisma/seed.ts`; `tsconfig.json` ditambah `ts-node.experimentalResolver` agar seed bisa memuat generated client.




- [BSD-33][FE] Form login, register, dan lupa kata sandi terhubung ke be-bsd: `lib/api/client.ts` menyisipkan `Authorization: Bearer` dan menyegarkan access token sekali saat 401; data sesi (`user`, `accessToken`, `refreshToken`) disimpan oleh `features/auth/api.ts`; mock hanya dipakai bila `NEXT_PUBLIC_API_URL` kosong.




- [BSD-34][FE] `lib/auth/session.ts`: simpan/baca/hapus sesi di `localStorage` + cookie role `bsd_session` untuk proxy; `resolveAccess` tetap jadi satu-satunya aturan gating route per role.




- [BSD-52][FE] Sumber data layar nasabah berpindah dari mock ke be-bsd: `BankUnit.distanceKm` jadi opsional (koordinat unit belum diisi) sehingga kartu unit tidak menampilkan jarak dan filter "Terdekat" tidak mengurutkan data yang tidak ada; pengelompokan kategori per unit memakai harga aktif API, bukan `categoryIds` mock.




- [BSD-53][FE] `isToday` memakai tanggal perangkat (sebelumnya terpaku `SEED_TODAY` 25 Okt 2026) dan label grup "Hari ini" mengikuti tanggal berjalan.




- [BSD-55][FE] Sumber data layar petugas berpindah dari `localStorage` ke be-bsd: store memakai `useSyncExternalStore` + fetch API (bukan lagi `seedDeposit`), nama unit di beranda/antrean diambil dari data pengajuan, dan tombol "Muat Ulang" memanggil `reload` alih-alih `window.location.reload()`.




- [BSD-39][DOCS] Klaim "harga aktif dipilih berdasarkan tanggal & unit" dan "`createdBy` dicatat" pada catatan rilis dipersempit: modul harga baru menyediakan CRUD, sedangkan pemilihan harga aktif masih di `deposit.service.ts` dan `createdBy` belum disimpan — BSD-39 tetap terbuka.




- [BSD-56][BE] `updateStatus` kini menulis status dan `transaction_events` dalam satu transaksi DB dengan pengecekan status di `WHERE` (sebelumnya dua operasi terpisah dan cek status sebelum update), serta mengembalikan respons lengkap seperti endpoint daftar.




- [BSD-57][FE] `DepositItem.pricePerKg` dipetakan dari kolom `pricePerKg` respons API (harga aktif unit/global); layar timbang dan ringkasan hasil tidak lagi memakai kategori/harga mock. Ringkasan menampilkan "Nilai menyusul"/"—" sampai server menghitung nilai final (BSD-59), bukan Rp0 palsu.




- [BSD-39][BE] Aturan pemilihan harga aktif pindah dari `deposit.service.ts` (`activePrices()`) ke `WastePriceService.resolveActive()`; modul harga kini satu-satunya pemilik logika unit-menimpa-global dan rentang berlaku. `POST`/`PATCH /waste-prices` mengisi `createdBy` dari token (aktor terakhir) dan mengembalikannya di daftar/detail.




- [BSD-58][BE] Snapshot harga tidak lagi bisa dikirim klien: `snapshotPrice()` dan route `PATCH /deposits/:id/snapshoot` dihapus; snapshot hanya lahir dari penimbangan petugas dan dihitung ulang setiap penyimpanan timbangan (transaksi baru final saat konfirmasi).




- [BSD-59][BE] Tiga loop kalkulasi yang duplikat (`calculateValue`, `calculateConfirmedValue`, `confirmTransaction`) diganti satu pemanggilan `depositTotals()`, sehingga nilai yang ditampilkan dan nilai yang disimpan tidak bisa berbeda.




- [BSD-60][BE] Konfirmasi dipindah seluruhnya ke dalam `$transaction`: kunci dicek ulang di dalam transaksi, status diubah lewat `updateMany` bersyarat sebelum transaksi dibuat, dan event ditulis setelahnya; sebelumnya kunci dicek di luar transaksi dan status diubah dengan `update` biasa setelah transaksi dibuat.




- [BSD-61][BE] Pembatalan (sebelum dan sesudah konfirmasi) kini memperbarui status dan menulis event dalam satu `$transaction` dengan `updateMany` bersyarat; alasan pembatalan pasca-konfirmasi dipindah dari `metadata` ke kolom `reason` yang memang tersedia di skema.




- [BSD-62][BE] Pembatalan/koreksi pasca-konfirmasi dipindah ke modul `transactions` sesuai RBAC (Admin saja) dan endpoint BPMN `POST /transactions/:id/{cancel,correct}`; keduanya memakai `updateMany status = active` + agregasi saldo dalam satu `$transaction`, bukan `update` biasa.




- [BSD-62][BE] Saldo tidak lagi bergantung pada penambahan manual saat konfirmasi: ia dihitung ulang dari `SUM(total_value)` transaksi `active`/`corrected` pada setiap aksi, sehingga koreksi/duplikat tidak bisa menggandakannya.




- [BSD-63][FE] `confirmDeposit` tidak lagi menyimpan status Selesai di perangkat: kini async memanggil `POST /deposits/:id/confirm` dan memakai `totalValue`/`confirmedAt` dari respons server. Kunci idempotensi tetap dibuat sekali per kunjungan layar dan dipakai ulang saat retry.




- [BSD-63][FE] `HasilSummary` mengambil total dari `deposit.finalTotal` (respons API), bukan menjumlahkan `item.finalValue` di klien; berat, snapshot harga, dan `lineTotal` per item disalin dari `POST /deposits/:id/value`.




- [BSD-65][BE] Detail transaksi kini meng-include `unit` dan `event` milik transaksi serta memetakan `unitAddress`, `completedAt`, `cancellationReason`, dan daftar event (jenis/alasan/waktu) untuk kebutuhan AC-12.2/12.4.




- [BSD-66][BE] Saldo pada daftar dan detail kini memakai agregasi transaksi yang sama dengan endpoint saldo; `refreshSaldo()` memakai helper `currentSaldo()` sehingga nilai tersimpan tidak bisa berbeda dari nilai yang ditampilkan.









**Fixed**









- [FE] `/petugas/riwayat` punya dua halaman yang resolve ke path sama (`app/petugas/riwayat` dan `app/petugas/(tabs)/riwayat`) sehingga `next build` gagal; halaman duplikat (yang tidak memakai layout tab petugas) dihapus.




- [FE] `/nasabah/riwayat/[id]` memakai `useParams()` tanpa `<Suspense>` sehingga prerender build gagal; komponen dibungkus `Suspense`.




- [BSD-52][FE] `CategoryTile` hanya mengenal slug mock (`plastik`, `kertas`, `logam`, …), sehingga data API ber-UUID menampilkan kotak kosong tanpa ikon; komponen kini mencocokkan nama kategori dan menerima prop `name` dari layar pemanggil.




- [BSD-52][FE] Payload `POST /deposits` mengirim `estimatedWeight` sebagai angka sehingga ditolak 400 (`estimatedWeight must be a string`); nilai kini dikirim sebagai string desimal sesuai DTO be-bsd.




- [BSD-52][FE] Ikon kategori dan filter "Menerima Logam" memakai id mock (`logam`), tidak pernah cocok dengan kategori API; keduanya sekarang berbasis nama/id dari API.




- [BSD-53][FE] Semua setoran nyata masuk grup "Sebelumnya" karena `isToday` membandingkan dengan tanggal data contoh; kini memakai tanggal perangkat.




- [BSD-60][BE] Konfirmasi ulang pengajuan Selesai dengan kunci idempotensi berbeda dulu dikembalikan 403 "Hanya pengajuan Diproses…"; kini 409 `DUPLICATE` yang menyatakan pengajuan sudah dikonfirmasi.




- [BSD-60][DOCS] Ralat hitungan progres: BSD-64 sudah dicentang di backlog sejak 18 Nov 2026 tetapi tidak ikut dihitung; progres sebelum BSD-60 seharusnya 44/103, bukan 43/103.




- [BSD-62][BE] Kode lama `cancelConfirmed`/`correctAfterConfirmation` di `deposit.service.ts` tidak punya rute dan mengizinkan nasabah mengubah transaksi Selesai; implementasi baru memakai endpoint Admin di modul `transactions`. Kode lama sengaja dibiarkan (di luar cakupan file BSD-62) dan tidak bisa dipanggil dari API.




- [BSD-63][FE] Konfirmasi dulu hanya simulasi `setTimeout(700)` + `navigator.onLine`, sehingga layar "Transaksi Berhasil" bisa tampil walau transaksi tidak tersimpan; kini menunggu respons API, tombol dinonaktifkan saat offline atau saat nilai belum tersedia, dan galat jaringan ditampilkan dengan tombol Coba Lagi.




- [BSD-65][BE] Detail transaksi mengembalikan `finalValue: undefined` karena kolom sebenarnya `line_total`; kini memakai `lineTotal` dan menyertakan `id` item. Nama unit sebelumnya kosong karena `unit` hanya di-include di dalam `deposit`.




- [BSD-66][BE] Saldo yang ditampilkan basi: konfirmasi baru tidak pernah menambah `users.saldo`, sehingga kolomnya menunjukkan 30000 padahal transaksi sah berjumlah 51000. Sekarang saldo dihitung dari transaksi saat dibaca (bukan ditambahkan per konfirmasi), jadi tidak bisa tertinggal atau berlipat saat retry.









**Removed**









- [BSD-52][FE] `buildDeposit()` di `features/nasabah/prototype-api.ts` dihapus: pembuatan pengajuan sekarang dilakukan `POST /deposits`, dan fungsi ini sudah tidak dipakai (kode mati).




- [BSD-58][BE] `PATCH /deposits/:id/snapshoot` beserta `DepositService.snapshotPrice()` dihapus: endpoint menerima harga dari klien (lubang kepercayaan) dan tidak dipakai FE.









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




| K-04 | 17 Nov 2026 | Docker/PostgreSQL tidak tersedia di lingkungan kerja saat BSD-21 s.d. BSD-25 dikerjakan | Migrasi dan seed belum pernah dieksekusi; drift SQL belum terverifikasi | Selesai: PostgreSQL 16.6 portable dipasang di `D:\pg-bsd` (binari zonky, tanpa admin), `prisma migrate dev` menerapkan kelima migrasi, `prisma db seed` mengisi data simulasi, exclusion constraint harga diuji (tumpang tindih ditolak `23P01`), dan `prisma migrate deploy` + seed diulang dari database kosong sebagai bukti reproducible | Zhafran Najib | Tertutup |









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




| 1.5 | 17 Nov 2026 | Tambah log BSD-21 (skema `users`, `bank_sampah_units`, `unit_staff`), progres 18/103 & E3 1/8, dan changelog BSD-21 | Zhafran Najib |




| 1.6 | 17 Nov 2026 | Tambah log BSD-22 s.d. BSD-25 (skema kategori/harga, setoran/transaksi, audit/konten/notifikasi, seed simulasi), kendala K-04 (Docker tidak tersedia), progres 22/103 & E3 5/8, serta changelog terkait | Zhafran Najib |




| 1.7 | 17 Nov 2026 | Tambah log BSD-26 (format error `{statusCode, message, code}` + validasi DTO bahasa Indonesia), progres 23/103 & E3 6/8, serta changelog terkait | Zhafran Najib |




| 1.8 | 17 Nov 2026 | Tambah log BSD-27 (OpenAPI `/docs`) dan BSD-28 (helmet, CORS, rate limit), progres 25/103, E3 8/8 selesai, serta changelog terkait | Zhafran Najib |




| 1.9 | 17 Nov 2026 | Tambah log BSD-29 (modul auth register/login/logout/refresh + migrasi refresh_tokens, rate limit auth 5/menit), progres 26/103, E4 1/8, changelog BSD-29, serta penutupan K-04 (migrasi & seed diverifikasi di PostgreSQL 16.6 lokal) | Zhafran Najib |




| 1.10 | 17 Nov 2026 | Tambah log BSD-30 (reset kata sandi via token, migrasi password_reset_tokens, respons generik forgot), progres 27/103, E4 2/8, changelog BSD-30 | Zhafran Najib |




| 1.11 | 18 Nov 2026 | Tambah log BSD-31 (JwtAuthGuard global + @Public, CommonModule/PrismaModule global, unit membership check, route baca data master untuk semua role login, pendaftaran TransactionModule, perbaikan DTO/snapshot/idempotensi/pembatalan), progres 28/103, E4 3/8, changelog BSD-31 | Zhafran Najib |




| 1.12 | 19 Nov 2026 | Tambah log BSD-33/34 (auth FE terhubung be-bsd: simpan sesi token, header Authorization + refresh otomatis, cookie role, proteksi route per role terverifikasi), perbaikan build FE (route `/petugas/riwayat` duplikat, `useParams` butuh Suspense), progres 30/103, E4 5/8 | Zhafran Najib |




| 1.13 | 19 Nov 2026 | Tambah log BSD-49/50/51/52/53 (API pengajuan setoran, estimasi nilai berlabel "bukan nilai final", pembatalan, layar setor nasabah terhubung API sungguhan, status setoran konsisten), progres 34/103, E7 4/7 (BSD-51 API selesai, UI menyusul), changelog Added/Changed/Fixed/Removed | Zhafran Najib |




| 1.14 | 19 Nov 2026 | Ralat centang BSD-37 & BSD-38 (kode dan changelog sudah ada, heading tertinggal belum dicentang), progres 36/103, E5 2/7; BSD-39 tetap terbuka karena pemilihan harga aktif per tanggal/unit dan `createdBy` belum ada | Zhafran Najib |




| 1.15 | 19 Nov 2026 | Tambah UI pembatalan pengajuan nasabah (panel alasan di detail setoran status Menunggu, error bahasa Indonesia, tampilan Dibatalkan otomatis), BSD-51 selesai, progres 37/103, E7 5/7 | Zhafran Najib |




| 1.16 | 19 Nov 2026 | Tambah `GET /deposits/petugas` (unit-scoped) dan alihkan store petugas dari localStorage ke API, BSD-55 selesai, progres 38/103, E7 6/7; ralat catatan rilis BSD-39 (pemilihan harga aktif & `createdBy` belum ada, task tetap terbuka) | Zhafran Najib |




| 1.17 | 19 Nov 2026 | Selesaikan BSD-56: transisi Menunggu → Diproses atomik & unit-scoped di BE, tombol terima FE menunggu respons API, progres 39/103, E8 1/9 | Zhafran Najib |




| 1.18 | 19 Nov 2026 | Selesaikan BSD-57: berat aktual + koreksi kategori tersimpan lewat API dengan validasi DTO dan event atomik, layar timbang lepas dari data mock, progres 40/103, E8 2/9 | Zhafran Najib |




| 1.19 | 22 Nov 2026 | Selesaikan BSD-58 (snapshot harga dihitung server saat penimbangan, endpoint snapshot dari klien dihapus, konfirmasi/nilai menolak item belum ditimbang) dan BSD-39 (harga aktif per tanggal/unit di modul harga, `createdBy` dicatat), progres 42/103, E5 3/7, E8 3/9 | Zhafran Najib |




| 1.20 | 22 Nov 2026 | Selesaikan BSD-59: `line_total` tersimpan dan dihitung Decimal, satu fungsi kalkulasi untuk `/value` dan konfirmasi, unit test presisi ditambahkan, progres 43/103, E8 4/9 | Zhafran Najib |




| 1.21 | 22 Nov 2026 | Selesaikan BSD-60: konfirmasi atomik/idempotent diperkuat (cek kunci + `updateMany` bersyarat dalam satu transaksi), DTO kunci, test 7 kasus, ralat hitungan progres (BSD-64 ikut terhitung); progres 45/103, E8 5/9 | Zhafran Najib |




| 1.22 | 22 Nov 2026 | Selesaikan BSD-61: jejak status lama/baru/pelaku/waktu terverifikasi, pembatalan atomik dengan alasan di kolom `reason`, test 3 kasus ditambahkan; progres 46/103, E8 6/9 | Zhafran Najib |




| 1.23 | 22 Nov 2026 | Selesaikan BSD-62: endpoint Admin cancel/correct pasca-konfirmasi, alasan wajib, saldo dihitung ulang dari sumber transaksi, event menyimpan nilai lama, test 7 kasus; progres 47/103, E8 7/9 | Zhafran Najib |




| 1.24 | 22 Nov 2026 | Selesaikan BSD-63: ringkasan hasil timbang dan konfirmasi petugas memakai nilai/transaksi dari be-bsd, kunci idempotensi dipakai ulang saat retry, state loading/error/offline ditambahkan; progres 48/103, E8 8/9 | Zhafran Najib |




| 1.25 | 23 Nov 2026 | Selesaikan BSD-65: detail transaksi nasabah memuat unit, `lineTotal`, `completedAt`, `cancellationReason`, dan event; test riwayat/detail 5 kasus; progres 49/103, E9 1/5 | Zhafran Najib |




| 1.26 | 23 Nov 2026 | Selesaikan BSD-66: saldo diagregasi dari transaksi aktif/terkoreksi lewat `GET /transactions/saldo` dan respons riwayat/detail; test saldo 3 kasus; progres 50/103, E9 2/5 | Zhafran Najib |




| 1.29 | 25 Nov 2026 | Selesaikan BSD-48: pencarian/filter UI memakai query `GET /units` (BSD-45) dengan debounce + abort, retry error, dan pemetaan kategori aktif; progres 60/103, E6 4/5 | Zhafran Najib |

| 1.28 | 25 Nov 2026 | Verifikasi BSD-47 (state loading/empty/error + TC-02 pada halaman setor), centang di backlog tanpa perubahan kode; progres 59/103, E6 3/5 | Zhafran Najib |





| 1.27 | 25 Nov 2026 | Verifikasi BSD-44 dan selesaikan BSD-45 (query DTO + test filter), centang keduanya di backlog; progres 58/103, E6 2/5 | Zhafran Najib |





|| 1.11 | 17 Nov 2026 | Tambah log BSD-37 (API CRUD unit), BSD-38 (API CRUD kategori), BSD-39 (API harga + histori), progres 30/103, E5 3/8, changelog terkait | Zhafran Najib |




