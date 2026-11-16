# Product Requirements Document (PRD)

## Bank Sampah Digital

**Dokumen kebutuhan produk untuk aplikasi web PWA dan website pendukung**

> **Versi 1.1** — revisi dari PRD v1.0 berdasarkan temuan wawancara pengguna, validasi mitra, log risiko, dan keputusan proyek tanggal 12 November 2026.
> Dokumen ini **disetujui Product Owner** pada 12 November 2026 dan menjadi acuan resmi pengembangan. Data operasional Bank Sampah Unit (BSU) yang belum tersedia ditandai sebagai **SIMULASI/ASUMSI**.

## Informasi Dokumen

| Item | Keterangan |
| --- | --- |
| Versi | 1.1 — Revisi temuan & keputusan proyek |
| Status | **Disetujui Product Owner** (12 November 2026) |
| Metode Pengembangan | SDLC Agile dengan Scrum |
| Platform | Aplikasi web PWA Next.js + REST API NestJS + PostgreSQL |
| Tim | Zhafran Najib (seluruh peran: PM, PO, Scrum Master, SA, UI/UX, FE, BE, QA) |
| Tanggal | 12 November 2026 |
| Dokumen sumber | PRD v1.0, `docs/BACKLOG..md`, `docs/WAWANCARA_PENGGUNA.md`, `docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md`, `docs/RISIKO_OPERASIONAL.md`, `AGENTS.md` |

### Riwayat Revisi

| Versi | Tanggal | Ringkasan Perubahan |
| --- | --- | --- |
| 1.0 | 11 November 2026 | Draft awal dari konversi PDF; ruang lingkup, FR/NFR, aturan bisnis, ERD awal, rencana Scrum. |
| 1.1 | 12 November 2026 | Menetapkan keputusan D-01 s.d. D-05; menegaskan MVP antar mandiri (penjemputan Fase 2); memindahkan backend ke PostgreSQL + API NestJS; menambahkan temuan wawancara & risiko; menambah FR pemeriksaan/penolakan sampah dan pembatalan/koreksi; merapikan format tabel dan penomoran. |

### Changelog v1.1

- **Scope (D-01):** MVP adalah **nasabah antar sendiri**; penjemputan menjadi **Fase 2** dan tidak diimplementasikan di MVP.
- **Arsitektur (D-02):** backend **PostgreSQL + REST API NestJS** di `be-bsd`; referensi Supabase dihapus.
- **Aplikasi (D-03):** **satu aplikasi berbasis role** (nasabah, petugas, admin), bukan dashboard terpisah.
- **Harga (D-04):** **harga unit menimpa harga global**; snapshot harga wajib disimpan per transaksi.
- **Pembatalan/koreksi (D-05):** masuk MVP, wajib alasan dan jejak audit di `transaction_events`.
- **Temuan pengguna:** masalah catatan kertas, antrean pencatatan, kesalahan hitung, keterbatasan info lokasi/jam, prosedur belum jelas, dan harga belum terbuka.
- **FR baru:** FR-22 (pemeriksaan & penolakan sampah) dan FR-23 (pembatalan & koreksi transaksi).
- **Format:** memperbaiki penomoran yang rusak pada bagian alur bisnis dan aturan bisnis.

## Daftar Isi

- 1. Ringkasan Produk
- 2. Latar Belakang dan Permasalahan
- 3. Visi, Tujuan, dan Indikator Keberhasilan
- 4. Ruang Lingkup Produk
- 5. Pengguna dan Hak Akses
- 6. Alur Bisnis Utama
- 7. Kebutuhan Fungsional
- 8. Kebutuhan Non-Fungsional
- 9. Aturan Bisnis
- 10. Data dan Struktur Database Awal
- 11. Integrasi dan Arsitektur Teknologi
- 12. Model Bisnis
- 13. UI/UX dan Prinsip Desain
- 14. Prioritas Product Backlog
- 15. Rencana Implementasi Scrum
- 16. Pengujian dan Acceptance Criteria
- 17. Risiko dan Mitigasi
- 18. Asumsi, Batasan, dan Ketergantungan
- 19. Rencana Pengembangan Berikutnya
- 20. Glosarium dan Referensi Awal
- Lampiran A. Log Keputusan Proyek

## 1. Ringkasan Produk

Bank Sampah Digital adalah sistem pengelolaan sampah berbasis digital yang membantu masyarakat memilah dan menyetorkan sampah, menemukan informasi Bank Sampah, serta memantau proses penimbangan dan transaksi secara lebih mudah dan transparan. Sistem membantu petugas Bank Sampah mencatat nasabah, menerima setoran, menginput hasil penimbangan, mengelola harga per kilogram, dan menyimpan riwayat transaksi. Website digunakan sebagai media informasi dan edukasi, sedangkan aplikasi PWA digunakan oleh nasabah, petugas, dan admin sesuai perannya.

| Elemen | Penjelasan |
| --- | --- |
| Masalah utama | Informasi Bank Sampah sulit ditemukan, pencatatan masih manual/berisiko hilang, antrean pencatatan, kesalahan perhitungan, prosedur setor dan harga belum transparan. |
| Solusi | Aplikasi web PWA berbasis role untuk nasabah, petugas, dan admin, didukung website informasi/edukasi. |
| Nilai utama | Mempermudah masyarakat mengubah sampah terpilah menjadi nilai ekonomi melalui proses digital yang tercatat dan transparan. |
| Model pengembangan | MVP antar mandiri, diuji terbatas bersama calon pengguna; BSU direncanakan diterapkan di akhir MVP. |
| Model bisnis awal | B2B2C: menghubungkan nasabah, Bank Sampah, dan mitra pengelolaan/daur ulang; potensi pendapatan dari layanan digital, kemitraan, CSR, dan industri. |

## 2. Latar Belakang dan Permasalahan

Pengelolaan sampah melibatkan banyak pihak dan proses, mulai dari pemilahan rumah tangga, penyetoran, penimbangan, pencatatan, hingga penyaluran sampah. Pada proses yang belum terdigitalisasi, informasi lokasi dan jam operasional sulit diakses, pencatatan transaksi berisiko tidak konsisten atau hilang, dan nasabah kesulitan melihat riwayat setoran atau nilai sampah yang sudah diterima.

### 2.1 Permasalahan yang ingin diselesaikan

Berdasarkan temuan awal (`docs/WAWANCARA_PENGGUNA.md`) dan konteks survei:

- **Risiko kehilangan buku tabungan/catatan kertas** sehingga riwayat dan nilai setoran tidak dapat dibuktikan.
- **Antrean pencatatan** di unit membuat waktu tunggu lama dan petugas kewalahan.
- **Kesalahan perhitungan nilai** karena pencatatan/penghitungan manual.
- **Keterbatasan informasi lokasi dan jam operasional** sehingga nasabah berisiko datang sia-sia.
- **Prosedur penyetoran belum jelas** dan informasi **harga per kilogram belum terbuka**.
- Petugas membutuhkan daftar pengajuan, pencatatan pemeriksaan/penimbangan, dan konfirmasi transaksi yang rapi.
- Pengguna membutuhkan riwayat transaksi yang dapat ditinjau kembali.
- Informasi edukasi tentang pemilahan sampah perlu mudah diakses.

> **Catatan validasi:** temuan di atas masih berlabel **ASUMSI/KONTEKS** karena wawancara langsung per responden dan validasi BSU belum dilaksanakan. Validasi aktual dilakukan pada fase pilot.

### 2.2 Pernyataan masalah

Bagaimana menyediakan platform digital yang membantu nasabah menemukan Bank Sampah dan melakukan setoran secara terstruktur, serta membantu petugas mencatat hasil pemeriksaan, penimbangan, dan transaksi secara akurat dan transparan?

## 3. Visi, Tujuan, dan Indikator Keberhasilan

### 3.1 Visi produk

Membangun ekosistem pengelolaan Bank Sampah yang lebih mudah diakses, transparan, dan terhubung melalui teknologi digital.

### 3.2 Tujuan

- Memudahkan nasabah mencari Bank Sampah dan memahami cara menyetor sampah.
- Mengubah pencatatan setoran dan transaksi menjadi proses digital yang konsisten.
- Meningkatkan transparansi melalui informasi berat aktual, harga per kilogram, nilai transaksi, dan riwayat.
- Mengurangi risiko kehilangan catatan serta kesalahan perhitungan.
- Membantu petugas mengelola pengajuan, pemeriksaan, penimbangan, dan konfirmasi transaksi.
- Mendukung edukasi pemilahan dan pengelolaan sampah.

### 3.3 Indikator keberhasilan awal

| Indikator | Target awal untuk pilot (dapat disesuaikan) |
| --- | --- |
| Keberhasilan alur utama | Minimal 90% peserta uji coba menyelesaikan simulasi setoran tanpa bantuan. |
| Akurasi perhitungan | 100% hasil perhitungan nilai pada skenario uji sesuai berat aktual × harga/kg. |
| Kelengkapan transaksi | Setiap transaksi selesai memiliki jenis sampah, berat aktual, harga/kg, nilai, waktu, petugas, dan status. |
| Kegunaan informasi | Pengguna uji coba dapat menemukan alamat dan jam operasional Bank Sampah yang dipilih. |
| Stabilitas pilot | Tidak ada bug kritis yang menghambat pengajuan, penimbangan, atau penyimpanan transaksi. |

Angka di atas adalah target awal untuk evaluasi proyek, bukan klaim performa sistem yang sudah berjalan.

## 4. Ruang Lingkup Produk

### 4.1 Dalam ruang lingkup MVP

- Aplikasi web PWA Next.js **berbasis role** untuk nasabah, petugas, dan admin.
- Autentikasi nasabah: login, registrasi, dan lupa kata sandi.
- Autentikasi petugas/admin melalui akun yang dibuat/diaktifkan admin; tidak ada registrasi petugas secara publik.
- Informasi dan pencarian Bank Sampah: nama, alamat, jam operasional, status layanan, dan kontak.
- Pengajuan setoran dengan pilihan Bank Sampah, kategori sampah, dan estimasi berat.
- Ringkasan estimasi yang ditandai **bukan nilai final**.
- Status pengajuan sampai proses pemeriksaan, penimbangan, dan transaksi selesai.
- Pemeriksaan jenis/kondisi sampah dan pencatatan alasan penolakan oleh petugas.
- Input berat aktual oleh petugas dan perhitungan nilai transaksi di server berdasarkan harga aktif.
- Konfirmasi transaksi yang **atomik** dan **idempotent**.
- Pembatalan/koreksi transaksi setelah konfirmasi dengan alasan dan jejak audit.
- Riwayat setoran/transaksi dan informasi saldo/nilai akumulatif (bukan dana cair).
- Pengelolaan data master oleh admin: akun, unit, kategori sampah, harga, status publikasi.
- Website Next.js untuk informasi, edukasi, artikel, publikasi, dan halaman pendukung.
- Database terpusat PostgreSQL dengan Prisma.
- Identifikasi jenis sampah berbasis scan bersifat opsional; pengguna tetap memilih manual dan petugas dapat mengoreksi.

### 4.2 Di luar ruang lingkup MVP

- **Layanan penjemputan sampah, kurir, ojek, atau perantara.** Model operasional MVP adalah nasabah mengantar sendiri ke Bank Sampah. Penjemputan direncanakan sebagai **Fase 2** (keputusan D-01).
- Penarikan saldo ke rekening atau e-wallet.
- Pembayaran digital langsung ke rekening bank/e-wallet.
- Penetapan harga otomatis berdasarkan pasar tanpa verifikasi admin.
- Integrasi penuh dengan industri daur ulang atau sistem pemerintah.
- Identifikasi sampah berbasis AI sebagai penentu final jenis, berat, atau harga.
- Program reward/point kompleks, marketplace material daur ulang, dan fitur sosial berskala luas.

> **Catatan backlog:** epic E14 (penjemputan) pada `docs/BACKLOG..md` dipindahkan ke **pasca-MVP** sesuai D-01. Rancangan data penjemputan boleh disiapkan sebagai persiapan Fase 2, tetapi tidak diimplementasikan di MVP.

## 5. Pengguna dan Hak Akses

| Pengguna | Kebutuhan | Hak akses utama |
| --- | --- | --- |
| Nasabah | Mencari Bank Sampah, mengajukan setoran, melihat status dan riwayat. | Mengelola profil sendiri; membuat pengajuan; melihat transaksi dan saldo/nilai akumulatif milik sendiri. |
| Petugas Bank Sampah | Menerima sampah, memeriksa, menimbang, dan mencatat transaksi. | Melihat pengajuan yang ditujukan ke unitnya; memperbarui status; memasukkan berat aktual; menolak dengan alasan; menyelesaikan transaksi. |
| Admin | Mengelola data master dan mengawasi operasional. | Mengelola akun/role, unit Bank Sampah, kategori dan harga sampah, serta melihat laporan sesuai kewenangan. |
| Pengunjung website | Mendapatkan informasi dan edukasi. | Melihat halaman publik, artikel, informasi program, dan Bank Sampah yang dipublikasikan. |

Catatan:
- Akun petugas dan admin **tidak boleh** memperoleh akses hanya dengan mendaftar sebagai nasabah.
- Otorisasi dan kepemilikan data divalidasi **di server**, bukan hanya di antarmuka.

## 6. Alur Bisnis Utama

### 6.1 Alur setoran mandiri (MVP)

1. Nasabah login ke aplikasi.
2. Nasabah memilah sampah dan membuka menu Setor.
3. Nasabah memilih Bank Sampah Unit berdasarkan informasi lokasi, jam operasional, dan layanan.
4. Nasabah memilih kategori sampah dan memasukkan estimasi berat.
5. Sistem menampilkan ringkasan estimasi; nilai ini **bukan nilai final**.
6. Nasabah mengonfirmasi pengajuan dan membawa sampah sendiri ke unit yang dipilih.
7. Petugas menerima sampah dan memeriksa jenis serta kondisi sampah.
8. Jika sampah tidak sesuai, petugas mencatat alasan penolakan dan pengajuan ditutup/dibatalkan.
9. Petugas menimbang sampah dan memasukkan berat aktual per kategori.
10. Sistem menghitung nilai final di server: berat aktual × harga/kg snapshot.
11. Petugas memeriksa ringkasan dan mengonfirmasi transaksi selesai (atomik & idempotent).
12. Sistem menyimpan transaksi, memperbarui riwayat dan saldo/nilai akumulatif, serta menampilkan bukti transaksi.

### 6.2 Status setoran

| Status | Makna |
| --- | --- |
| Menunggu | Pengajuan dibuat dan menunggu nasabah datang atau ditangani petugas. |
| Diproses | Sampah telah diterima dan sedang diperiksa/ditimbang. |
| Selesai | Berat dan nilai final dikonfirmasi, transaksi tersimpan. |
| Dibatalkan | Pengajuan/transaksi dibatalkan dengan alasan yang tercatat (termasuk penolakan sampah). |

Status yang terlihat kepada nasabah menggunakan bahasa Indonesia yang konsisten. Perubahan status dicatat di `transaction_events`.

### 6.3 Alur pembatalan dan koreksi

1. Petugas/admin membuka pengajuan atau transaksi.
2. Pengguna berwenang memilih aksi batal/koreksi dan **wajib mengisi alasan**.
3. Sistem memvalidasi status dan kewenangan (unit/role).
4. Perubahan disimpan dalam transaksi database dan dicatat di `transaction_events` (status lama, status baru, aktor, alasan, waktu).
5. Jika transaksi sudah Selesai, koreksi tidak boleh menghapus riwayat; nilai lama tetap dapat ditelusuri.

## 7. Kebutuhan Fungsional

| ID | Fitur | Kebutuhan | Prioritas |
| --- | --- | --- | --- |
| FR-01 | Autentikasi nasabah | Nasabah dapat mendaftar, login, logout, dan meminta reset kata sandi. | High |
| FR-02 | Autentikasi petugas/admin | Petugas dan admin login menggunakan akun yang diatur admin; role diperiksa sebelum akses diberikan. | High |
| FR-03 | Profil nasabah | Nasabah dapat melihat dan memperbarui data profil yang diizinkan. | Medium |
| FR-04 | Daftar Bank Sampah | Sistem menampilkan daftar unit beserta nama, alamat, jam operasional, status, dan kontak. | High |
| FR-05 | Pencarian/filter | Nasabah dapat mencari unit dan memfilter informasi dasar yang tersedia. | Medium |
| FR-06 | Informasi jenis dan harga sampah | Sistem menampilkan kategori sampah dan harga/kg aktif per unit atau kebijakan yang ditentukan. | High |
| FR-07 | Pengajuan setoran | Nasabah memilih unit, kategori sampah, dan estimasi berat, lalu mengirim pengajuan. | High |
| FR-08 | Ringkasan estimasi | Sistem menampilkan berat/nilai estimasi dan menjelaskan bahwa nilai final ditentukan dari penimbangan petugas. | High |
| FR-09 | Daftar pengajuan petugas | Petugas dapat melihat pengajuan yang ditujukan ke unitnya. | High |
| FR-10 | Pembaruan status | Petugas dapat memperbarui status pengajuan sesuai tahap proses. | High |
| FR-11 | Penimbangan aktual | Petugas dapat memasukkan berat aktual untuk setiap kategori sampah yang diterima. | High |
| FR-12 | Perhitungan transaksi | Sistem menghitung nilai per kategori dan total berdasarkan berat aktual × harga/kg snapshot; perhitungan di server. | High |
| FR-13 | Konfirmasi transaksi | Petugas mengonfirmasi hasil akhir sebelum transaksi ditandai selesai; konfirmasi atomik dan idempotent. | High |
| FR-14 | Riwayat transaksi | Nasabah dapat melihat daftar dan detail transaksi miliknya. | High |
| FR-15 | Saldo/nilai akumulatif | Sistem menampilkan nilai transaksi yang tercatat sebagai saldo/nilai akumulatif sesuai kebijakan Bank Sampah. | High |
| FR-16 | Pengelolaan data master | Admin mengelola unit, kategori sampah, harga aktif, akun, dan status publikasi. | High |
| FR-17 | Dashboard petugas/admin | Petugas/admin dapat melihat ringkasan pengajuan dan transaksi sesuai kewenangannya. | Medium |
| FR-18 | Konten edukasi website | Pengunjung dapat membaca informasi pemilahan, artikel, berita, dan program. | Medium |
| FR-19 | Identifikasi sampah opsional | Jika dikembangkan, scan hanya memberi saran kategori dan selalu menyediakan pilihan manual/koreksi petugas. | Low |
| FR-20 | Notifikasi status | Sistem memberi informasi perubahan status di dalam aplikasi; push notification menjadi pengembangan lanjutan. | Low |
| FR-21 | Bukti transaksi | Setelah transaksi selesai, sistem menampilkan detail transaksi yang dapat ditinjau kembali. | High |
| FR-22 | Pemeriksaan & penolakan sampah | Petugas mencatat hasil pemeriksaan jenis/kondisi sampah; jika ditolak, alasan wajib diisi dan status pengajuan menjadi Dibatalkan. | High |
| FR-23 | Pembatalan & koreksi transaksi | Petugas/admin berwenang dapat membatalkan atau mengoreksi transaksi dengan alasan; perubahan tercatat di `transaction_events`. | High |

## 8. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan |
| --- | --- | --- |
| NFR-01 | Keamanan | Akses data dibatasi berdasarkan role dan kepemilikan; nasabah hanya dapat melihat data miliknya. |
| NFR-02 | Privasi | Data pribadi dikumpulkan seperlunya dan tidak ditampilkan ke pengguna yang tidak berwenang. |
| NFR-03 | Integritas data | Nilai transaksi dihitung sistem; berat aktual, harga/kg snapshot, petugas, dan waktu transaksi tersimpan. |
| NFR-04 | Auditability | Perubahan harga, status, pembatalan, dan koreksi menyimpan waktu, aktor, dan alasan. |
| NFR-05 | Usability | Antarmuka menggunakan bahasa Indonesia yang jelas, alur singkat, dan status yang mudah dipahami. |
| NFR-06 | Responsiveness | Website dapat digunakan pada layar desktop dan perangkat mobile. |
| NFR-07 | Reliability | Sistem menampilkan pesan kesalahan yang jelas dan tidak menggandakan transaksi saat pengguna mengulangi aksi (idempotent). |
| NFR-08 | Performance | Halaman utama dan daftar data umum ditargetkan tampil dalam waktu yang wajar pada jaringan normal; target angka ditetapkan saat pengujian. |
| NFR-09 | Maintainability | Kode, komponen UI, skema database, dan konfigurasi disusun agar mudah dipelihara. |
| NFR-10 | Backup/recovery | Strategi backup dan pemulihan data ditentukan sebelum pilot operasional. |
| NFR-11 | Accessibility | Teks mudah dibaca, kontras memadai, dan kontrol utama memiliki label yang jelas. |
| NFR-12 | Compatibility | Aplikasi diuji pada perangkat Android sasaran; dukungan iOS mengikuti prioritas dan sumber daya tim. |

## 9. Aturan Bisnis

1. Nasabah mengantar sampah sendiri ke Bank Sampah yang dipilih; sistem MVP **tidak** menyediakan layanan penjemputan (D-01).
2. Berat yang dimasukkan nasabah adalah **estimasi**, bukan dasar nilai transaksi final.
3. Berat aktual ditentukan oleh petugas melalui penimbangan di Bank Sampah.
4. Nilai final setiap kategori = berat aktual (kg) × harga per kg yang berlaku untuk transaksi tersebut.
5. Total transaksi adalah penjumlahan nilai seluruh kategori sampah yang diterima.
6. Harga sampah dikelola admin/pihak berwenang dan dapat berbeda berdasarkan jenis/unit/periode.
7. **Harga unit menimpa harga global** jika keduanya tersedia (D-04).
8. Harga yang digunakan pada transaksi disimpan sebagai **snapshot** (`unit_price_snapshot`); perubahan harga berikutnya tidak boleh mengubah transaksi lama.
9. Transaksi hanya berstatus **Selesai** setelah berat aktual dan nilai final dikonfirmasi petugas.
10. Konfirmasi transaksi harus **atomik** (satu transaksi database) dan **idempotent** (retry tidak menggandakan transaksi/saldo).
11. Saldo/nilai akumulatif pada MVP adalah **catatan nilai setoran**, bukan dana yang dapat ditarik ke rekening/e-wallet.
12. Petugas hanya boleh memproses setoran untuk unit yang menjadi tanggung jawabnya; kepemilikan dan role divalidasi di server.
13. Scan/identifikasi sampah bersifat bantuan; hasilnya tidak menggantikan pemeriksaan petugas.
14. Setiap pembatalan, penolakan, atau koreksi setelah konfirmasi **wajib memiliki alasan** dan tercatat di `transaction_events` (D-05).
15. Data harga, lokasi, jam, dan kapasitas yang belum diverifikasi wajib ditandai sebagai **data simulasi** dan tidak boleh diperlakukan sebagai fakta operasional mitra.

## 10. Data dan Struktur Database Awal

Struktur berikut merupakan rancangan awal untuk diskusi dengan developer dan disesuaikan dengan PostgreSQL + Prisma. Penamaan akhir mengikuti konvensi migrasi di `be-bsd/prisma/`.

| Entitas | Data utama | Catatan relasi |
| --- | --- | --- |
| users | id, nama, email/telepon, role, status akun, created_at | Role: nasabah/petugas/admin; terhubung ke autentikasi. |
| bank_sampah_units | id, nama, alamat, koordinat opsional, jam operasional, status, kontak | Satu unit memiliki banyak petugas dan setoran. |
| unit_staff | id, user_id, unit_id, status | Menghubungkan petugas dengan unit yang ditangani. |
| waste_categories | id, nama kategori, deskripsi, status | Kategori sampah yang diterima sistem. |
| waste_prices | id, unit_id opsional, category_id, price_per_kg, effective_from, effective_to, status | Histori harga; unit menimpa global (D-04). |
| deposits | id, customer_id, unit_id, status, submitted_at, processed_at, completed_at, cancelled_at, cancellation_reason, notes | Satu pengajuan dapat memiliki beberapa detail kategori. |
| deposit_items | id, deposit_id, category_id, estimated_weight, actual_weight, unit_price_snapshot, line_total | Menyimpan estimasi, hasil timbang aktual, snapshot harga, dan nilai final. |
| transactions | id, deposit_id, customer_id, unit_id, total_weight, total_value, confirmed_by, confirmed_at | Dibuat/ditetapkan ketika setoran dikonfirmasi selesai. |
| transaction_events | id, deposit_id/transaction_id, old_status, new_status, actor_id, note/reason, created_at | Jejak perubahan status, penolakan, pembatalan, dan koreksi. |
| content_articles | id, title, slug, body, author_id, published_at, status | Konten edukasi website. |
| notifications (opsional) | id, user_id, title, message, read_at, created_at | Notifikasi dalam aplikasi jika masuk MVP. |

Catatan desain:
- Transaksi menyimpan harga saat transaksi (**snapshot**), bukan hanya mengambil harga terbaru dari tabel harga.
- Otorisasi baris diterapkan di **API/guard** dan divalidasi kepemilikannya, bukan mengandalkan UI.
- Entitas penjemputan (`pickup_requests`, `pickup_assignments`, `pickup_events`) **tidak termasuk MVP**; boleh dirancang sebagai persiapan Fase 2.
- Semua tabel transaksi menyimpan `created_at`/`updated_at` dan aktor perubahan untuk audit.

## 11. Integrasi dan Arsitektur Teknologi

| Komponen | Teknologi | Tanggung jawab |
| --- | --- | --- |
| Frontend PWA | Next.js (App Router, TypeScript, Tailwind) | Antarmuka nasabah, petugas, dan admin dalam satu aplikasi berbasis role; website informasi/edukasi. |
| Backend API | NestJS (TypeScript) | Autentikasi, otorisasi role, logika bisnis, perhitungan nilai, validasi, dan API REST. |
| Database | PostgreSQL + Prisma | Penyimpanan data, migrasi skema, snapshot harga, dan audit. |
| Autentikasi & otorisasi | Guard/role di API | Pemeriksaan role dan kepemilikan data di server. |
| Design | Figma atau alat desain setara | User flow, wireframe, design system, dan prototype UI/UX. |
| Project tracking | Jira Scrum | Product backlog, sprint backlog, assignee, status, dan review pekerjaan. |
| CI/CD | GitHub Actions | Lint, test, dan build FE/BE per folder yang berubah. |

Keputusan arsitektur:
- **D-02:** backend menggunakan PostgreSQL + API NestJS sendiri di `be-bsd`; referensi Supabase dihapus.
- **D-03:** petugas dan admin memakai **aplikasi PWA yang sama** dengan role berbeda.
- **D-01:** tidak ada layanan penjemputan di MVP.

## 12. Model Bisnis

### 12.1 Model utama

Model yang direncanakan adalah B2B2C: platform menghubungkan nasabah sebagai pengguna akhir dengan Bank Sampah sebagai mitra operasional, serta membuka peluang kerja sama dengan perusahaan, program CSR, dan industri daur ulang. Pada tahap awal, prioritasnya adalah validasi kebutuhan dan penggunaan, bukan memaksimalkan biaya transaksi.

### 12.2 Segmen pengguna dan mitra

- Nasabah rumah tangga dan individu.
- Bank Sampah Unit dan pengelola.
- Sekolah, kampus, komunitas, dan organisasi.
- Perusahaan/program CSR.
- Mitra pengangkutan atau industri daur ulang pada tahap pengembangan lanjutan.

### 12.3 Potensi pendapatan

- Langganan layanan digital atau dashboard untuk Bank Sampah jika terbukti memberikan nilai.
- Kerja sama program dan pendanaan CSR dari perusahaan.
- Kerja sama layanan dengan mitra industri daur ulang.
- Biaya layanan transaksi hanya jika disepakati mitra dan tidak menghambat partisipasi nasabah.
- Promosi atau publikasi program yang relevan dan transparan.

Pendapatan di atas merupakan opsi bisnis, belum menjadi komitmen fitur atau pendapatan aktual. Model harga perlu diuji dengan Bank Sampah mitra dan calon sponsor.

## 13. UI/UX dan Prinsip Desain

- Gunakan bahasa Indonesia yang sederhana dan konsisten.
- Prioritaskan tugas utama: cari Bank Sampah, ajukan setoran, lihat status, dan periksa riwayat.
- Bedakan dengan jelas estimasi dari hasil timbang aktual dan nilai final.
- Tampilkan jam operasional, alamat, status layanan, dan petunjuk setoran sebelum pengguna mengonfirmasi.
- Gunakan desain visual bersih dengan warna hijau (lingkungan), biru (kepercayaan/teknologi), dan putih (latar); warna final diputuskan designer.
- Berikan empty state, loading state, error state, dan konfirmasi untuk aksi penting.
- Jangan menyamarkan saldo catatan setoran sebagai uang yang dapat dicairkan.
- Pastikan tampilan responsif dan komponen dapat digunakan kembali.
- Tandai data simulasi (harga, lokasi, jam) secara visual agar tidak dianggap data final.

### 13.1 Daftar halaman utama

| Platform | Halaman |
| --- | --- |
| PWA — Nasabah | Login, Register, Lupa Password, Home, Daftar Bank Sampah, Detail Bank Sampah, Pilih Jenis Sampah, Konfirmasi Setoran, Status Setoran, Ringkasan Transaksi, Riwayat, Detail Riwayat, Saldo/Nilai Akumulatif, Profil. |
| PWA — Petugas | Login, Dashboard, Daftar Pengajuan, Detail Pengajuan, Pemeriksaan & Penimbangan, Konfirmasi Transaksi, Pembatalan/Koreksi, Riwayat Unit. |
| PWA — Admin | Login, Dashboard, Manajemen Unit, Pengguna/Petugas, Kategori Sampah, Harga Sampah, Pengajuan/Transaksi, Konten, Laporan. |
| Website publik | Beranda, Tentang, Cara Kerja, Informasi Bank Sampah, Edukasi/Artikel, Berita/Kegiatan, Kontak. |

## 14. Prioritas Product Backlog

| Prioritas | Fitur | Alasan |
| --- | --- | --- |
| P0 — Wajib MVP | Autentikasi dan role; data unit; kategori/harga; pengajuan setoran; status; pemeriksaan/penolakan; input berat aktual; hitung transaksi; konfirmasi atomik; riwayat; saldo/nilai akumulatif; kontrol akses; pembatalan/koreksi. | Mendukung alur setoran dari awal hingga transaksi selesai. |
| P1 — Penting | Pencarian/filter unit; dashboard petugas/admin; artikel edukasi; laporan ringkas; bukti transaksi. | Meningkatkan kemudahan penggunaan dan operasional. |
| P2 — Lanjutan | Scan identifikasi sampah; notifikasi push; analitik lanjutan; integrasi mitra; reward; penjemputan (Fase 2). | Membutuhkan validasi tambahan atau kompleksitas teknis. |

Prioritas dapat berubah setelah wawancara dan validasi bersama calon pengguna. Fitur yang terlihat menarik tidak otomatis lebih prioritas daripada kebutuhan inti transaksi.

## 15. Rencana Implementasi Scrum

Scrum dijalankan dalam Sprint berdurasi yang disepakati tim (misalnya 1–2 minggu). Setiap Sprint memiliki Sprint Goal, backlog terpilih, hasil yang dapat direview, dan retrospective.

| Sprint | Fokus | Output yang diharapkan |
| --- | --- | --- |
| Sprint 1 | Analisis kebutuhan dan desain awal | Requirement, user story, BPMN/use case, ERD awal, user flow, wireframe/prototype awal, setup repository dan environment. |
| Sprint 2 | Fondasi sistem dan autentikasi | Skema database awal, login/role, profil, data unit, kategori dan harga dasar. |
| Sprint 3 | Alur pengajuan setoran | Daftar/detail unit, pengajuan setoran, ringkasan estimasi, status pengajuan, daftar pengajuan petugas. |
| Sprint 4 | Penimbangan dan transaksi | Pemeriksaan, input berat aktual, snapshot harga, kalkulasi nilai, konfirmasi transaksi, pembatalan/koreksi, saldo/nilai akumulatif dan riwayat. |
| Sprint 5 | Integrasi, website, dan testing | Website informasi/edukasi, integrasi alur utama, pengujian end-to-end, perbaikan bug dan persiapan pilot. |

### 15.1 Peran tim

| Peran proyek | Tanggung jawab utama |
| --- | --- |
| Project Manager / Scrum coordination | Menjaga tujuan, koordinasi, timeline, board Jira, hambatan, review, dan komunikasi tim. |
| Product Owner | Pemilik keputusan prioritas produk dan persetujuan PRD/backlog. |
| Scrum Master | Menjaga proses Scrum, fasilitasi ceremony, dan menghilangkan hambatan. |
| System Analyst 1 | Menggali kebutuhan pengguna, memetakan proses bisnis, BPMN, aturan bisnis, dan validasi kebutuhan. |
| System Analyst 2 | Menyusun user story, acceptance criteria, use case, rancangan data/ERD, serta membantu pengujian. |
| UI/UX Designer | Membuat user flow, wireframe, design system, prototype, dan mengevaluasi kemudahan penggunaan. |
| Software Developer | Menyiapkan repository/environment, mengimplementasikan aplikasi, website, database/integrasi, kontrol akses, dan memperbaiki bug. |
| QA | Menyusun dan menjalankan pengujian, mencatat bug, dan memverifikasi perbaikan. |

**Catatan D-06:** seluruh peran di atas dikerjakan oleh **Zhafran Najib**; keputusan prioritas tetap melekat pada Product Owner (Zhafran Najib).

### 15.2 Definition of Done (DoD)

- Acceptance criteria untuk task terpenuhi.
- Desain/implementasi sesuai requirement yang disepakati.
- Perubahan telah direview oleh anggota tim yang relevan.
- Pengujian dasar lulus dan tidak ada bug kritis yang diketahui.
- Dokumentasi atau catatan penggunaan diperbarui bila diperlukan.
- Perubahan tersimpan di repository dan/atau file tim yang disepakati.
- Task Jira diperbarui dengan status dan bukti hasil.

## 16. Pengujian dan Acceptance Criteria

### 16.1 Skenario pengujian inti

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| TC-01 | Nasabah membuat akun dan login. | Akun valid dapat masuk; data tidak valid mendapat pesan yang jelas. |
| TC-02 | Nasabah mencari dan membuka detail unit. | Informasi unit yang benar tampil. |
| TC-03 | Nasabah mengirim pengajuan setoran. | Pengajuan tersimpan dengan status awal dan muncul pada akun petugas unit terkait. |
| TC-04 | Petugas memasukkan berat aktual per kategori. | Sistem menghitung nilai per kategori dan total dengan benar. |
| TC-05 | Harga berubah setelah transaksi lama selesai. | Nilai transaksi lama tetap sesuai snapshot harga saat transaksi. |
| TC-06 | Petugas menyelesaikan transaksi. | Status menjadi Selesai, riwayat dan nilai akumulatif diperbarui satu kali. |
| TC-07 | Nasabah mencoba membuka transaksi milik orang lain. | Akses ditolak. |
| TC-08 | Petugas mencoba mengakses unit lain tanpa kewenangan. | Akses ditolak. |
| TC-09 | Jaringan terputus saat pengiriman transaksi, lalu dicoba kembali. | Sistem memberi feedback dan mencegah transaksi ganda (idempotent). |
| TC-10 | Data wajib belum diisi. | Sistem meminta pengguna melengkapi data sebelum melanjutkan. |
| TC-11 | Petugas menolak sampah dengan alasan. | Status pengajuan menjadi Dibatalkan; alasan dan aktor tercatat di `transaction_events`. |
| TC-12 | Petugas/admin mengoreksi transaksi yang sudah selesai. | Alasan wajib; nilai lama tetap tertelusur; audit tercatat. |
| TC-13 | Harga unit dan harga global sama-sama tersedia. | Harga unit digunakan dan tersimpan sebagai snapshot. |
| TC-14 | Estimasi nasabah berbeda dari berat aktual. | Nilai final memakai berat aktual; estimasi tetap ditandai bukan nilai final. |

### 16.2 Kriteria penerimaan MVP

- Alur pengajuan → pemeriksaan → penimbangan → konfirmasi transaksi dapat dijalankan end-to-end.
- Perhitungan nilai benar dan dapat ditelusuri berdasarkan berat aktual serta harga yang tersimpan.
- Nasabah hanya dapat mengakses data sendiri.
- Petugas hanya dapat memproses transaksi unit yang diizinkan.
- Konfirmasi transaksi tidak menghasilkan data ganda saat retry.
- Pembatalan/koreksi memiliki alasan dan jejak audit.
- Riwayat transaksi menampilkan informasi penting dan konsisten.
- Informasi Bank Sampah yang dipublikasikan telah diverifikasi oleh pihak terkait.
- Uji coba pengguna menghasilkan daftar temuan, prioritas perbaikan, dan keputusan kesiapan pilot.

## 17. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi | Rujukan |
| --- | --- | --- | --- |
| BSU belum tersedia sampai akhir MVP | Validasi mitra dan data aktual tertunda | Desain dengan asumsi eksplisit + data simulasi bertanda; validasi aktual pada fase pilot | R-01, K-02, D-07 |
| Perbedaan scope penjemputan | Prioritas/desain berubah di tengah jalan | D-01 ditetapkan: antar mandiri MVP, penjemputan Fase 2 | R-02, D-01 |
| Harga sampah berubah | Nilai transaksi keliru atau diperdebatkan | Harga dikelola role berwenang, tanggal berlaku, snapshot harga transaksi | R-04 |
| Kapasitas petugas/unit terbatas | Antrean dan keterlambatan layanan | Validasi kapasitas & jam; status/antrean jelas | R-03 |
| Kesalahan input berat | Nilai transaksi tidak akurat | Konfirmasi sebelum selesai, validasi angka, catat petugas, koreksi beralasan | R-06 |
| Data/transaksi ganda | Saldo/riwayat tidak konsisten | ID unik, validasi status, idempotensi penyelesaian transaksi | R-10 |
| Akses tidak sah | Kebocoran data nasabah/transaksi | Role-based access, validasi server-side, pengujian akses | R-11 |
| Informasi jam/lokasi tidak akurat | Nasabah datang ketika unit tutup | Verifikasi informasi bersama unit; mekanisme pembaruan; tandai data simulasi | R-04 |
| Internet/perangkat tidak stabil | Proses input/transaksi terganggu | Status pengiriman, pesan error jelas, retry aman | R-05 |
| Adopsi rendah | Sistem tidak terpakai optimal | Desain sederhana, edukasi singkat, uji usability | R-08 |
| Scope terlalu luas | Sprint terlambat dan fitur inti tidak selesai | Prioritaskan P0, batasi WIP, pecah task, pindahkan fitur tambahan | R-02 |
| Mitra belum tersedia | Pilot operasional tertunda | Wawancara/validasi unit sebelum jadwal pilot; siapkan asumsi | R-01 |

Detail lengkap: `docs/RISIKO_OPERASIONAL.md`.

## 18. Asumsi, Batasan, dan Ketergantungan

### 18.1 Asumsi

- Akan ada setidaknya satu Bank Sampah Unit yang bersedia menjadi mitra uji coba **pada akhir MVP/fase pilot**.
- Bank Sampah dapat menyediakan informasi unit, kategori yang diterima, jam operasional, dan harga yang berlaku.
- Nasabah membawa sampah sendiri ke unit yang dipilih.
- Petugas melakukan penimbangan aktual dan bertanggung jawab atas konfirmasi transaksi.
- Tim memiliki akses ke perangkat pengembangan dan environment PostgreSQL lokal/CI.
- Temuan wawancara saat ini masih berupa ringkasan/konteks dan akan divalidasi ulang pada fase pilot.

### 18.2 Batasan

- Produk merupakan proyek pengembangan bertahap; kelayakan operasional harus divalidasi sebelum penggunaan luas.
- Nilai saldo pada MVP adalah catatan nilai transaksi, bukan layanan keuangan atau rekening penyimpanan uang.
- Fitur scan sampah, notifikasi push, integrasi mitra, penjemputan, dan ekspansi skala besar ditunda.
- Data harga, lokasi, jam, dan kapasitas contoh untuk prototype wajib ditandai sebagai **data simulasi** jika belum diverifikasi.
- MVP hanya mendukung alur **antar sendiri**; penjemputan tidak diimplementasikan.

### 18.3 Ketergantungan

- Validasi proses dengan pengelola Bank Sampah (ditunda sampai BSU tersedia di akhir MVP).
- Ketersediaan data kategori, harga, lokasi, jam operasional, dan kapasitas yang benar.
- Keputusan Product Owner yang menyetujui prioritas backlog dan PRD.
- Pengaturan keamanan database, autentikasi, dan otorisasi API.
- Kesiapan perangkat/jaringan petugas untuk pilot.

## 19. Rencana Pengembangan Berikutnya

- Pilot dengan satu atau beberapa Bank Sampah Unit dan mengukur keberhasilan alur setoran.
- Menyempurnakan dashboard dan laporan berdasarkan kebutuhan petugas.
- Mengembangkan notifikasi yang sesuai dengan kebutuhan pengguna.
- Mengevaluasi kelayakan scan/identifikasi sampah sebagai fitur bantuan.
- **Fase 2: layanan penjemputan** (permintaan, penugasan petugas, serah-terima, pembatalan/gagal jemput).
- Membangun kerja sama dengan perusahaan/CSR dan industri daur ulang setelah proses inti stabil.
- Menguji model pendapatan, termasuk langganan layanan digital atau kemitraan, sebelum menetapkan skema harga.

## 20. Glosarium dan Referensi Awal

| Istilah | Definisi |
| --- | --- |
| PRD | Product Requirements Document; dokumen yang menjelaskan tujuan, ruang lingkup, pengguna, kebutuhan, dan kriteria penerimaan produk. |
| MVP | Minimum Viable Product; versi awal dengan fitur minimum untuk menguji kebutuhan utama. |
| Scrum | Kerangka kerja Agile yang membagi pengembangan ke dalam Sprint dan melakukan inspeksi serta adaptasi berkala. |
| Product Backlog | Daftar kebutuhan dan pekerjaan produk yang diprioritaskan. |
| Acceptance Criteria | Kondisi yang harus dipenuhi agar suatu task/fitur dapat diterima. |
| B2B2C | Business-to-Business-to-Consumer; layanan bekerja sama dengan organisasi bisnis/mitra untuk melayani pengguna akhir. |
| Snapshot harga | Salinan harga yang berlaku saat transaksi sehingga transaksi lama tidak berubah ketika harga master diperbarui. |
| Idempotent | Sifat operasi yang aman diulang tanpa menghasilkan efek ganda (misalnya transaksi/saldo tidak bertambah dua kali). |
| RBAC | Role-Based Access Control; pembatasan akses berdasarkan peran pengguna. |
| BSU | Bank Sampah Unit. |
| PWA | Progressive Web App; aplikasi web yang dapat dipasang dan digunakan seperti aplikasi native. |

Referensi awal untuk konteks pengelolaan sampah:

- Damanhuri, E., & Padmi, T. (2010). *Pengelolaan Sampah Perkotaan di Indonesia*. Program Studi Teknik Lingkungan, Institut Teknologi Bandung.
- Kementerian Lingkungan Hidup dan Kehutanan. (2021). *Peraturan Menteri Lingkungan Hidup dan Kehutanan Nomor 14 Tahun 2021 tentang Pengelolaan Sampah pada Bank Sampah*.
- Catatan proyek: referensi di atas memberi konteks pengelolaan sampah; kebutuhan produk dan alur operasional dalam PRD ini tetap harus divalidasi langsung dengan pengguna serta calon mitra.

## Lampiran A. Log Keputusan Proyek

| ID | Keputusan / Isu | Keputusan Final | Status |
| --- | --- | --- | --- |
| D-01 | Penjemputan sampah vs antar mandiri | MVP **antar mandiri**; penjemputan **Fase 2** | Diputuskan 12 Nov 2026 |
| D-02 | Backend Supabase vs PostgreSQL + API sendiri | **PostgreSQL + REST API NestJS** (`be-bsd`) | Diputuskan 12 Nov 2026 |
| D-03 | PWA sama vs dashboard terpisah | **Satu aplikasi berbasis role** | Diputuskan 12 Nov 2026 |
| D-04 | Prioritas harga unit vs global | **Harga unit menimpa harga global** | Diputuskan 12 Nov 2026 |
| D-05 | Status Dibatalkan & alur koreksi | **Masuk MVP**; wajib alasan + audit `transaction_events` | Diputuskan 12 Nov 2026 |
| D-06 | Product Owner & Scrum Master | **Zhafran Najib** mengerjakan seluruh peran; pemilik prioritas: Zhafran Najib | Selesai 12 Nov 2026 |
| D-07 | Mitra Bank Sampah untuk pilot | **Ditunda**; BSU baru tersedia di akhir MVP, validasi aktual pada fase pilot | Ditunda |

> **Status dokumen:** PRD v1.1 **disetujui Product Owner** pada 12 November 2026 dan menjadi acuan resmi untuk BSD-12 (user story), BSD-13 (BPMN/RBAC), dan BSD-14 (ERD).
