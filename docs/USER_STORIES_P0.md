# User Story & Acceptance Criteria P0

## Bank Sampah Digital

**Dokumen kerja untuk BSD-12 — User story dan acceptance criteria P0**

> Acuan: `docs/PRD_Bank_Sampah_Digital_v1.1.md` (disetujui 12 November 2026). Dokumen ini hanya mencakup **FR prioritas P0 (wajib MVP)**. User story P1/P2 disusun terpisah setelah P0 stabil.

## Informasi Dokumen

| Item | Keterangan |
| --- | --- |
| Task | BSD-12 · User story dan acceptance criteria P0 |
| Versi | 1.0 |
| Tanggal | 12 November 2026 |
| Status | Selesai (v1.0) — siap digunakan; menunggu review Product Owner bila diperlukan |
| Acuan FR | PRD v1.1 bagian 7 dan prioritas bagian 14 |
| Format AC | Given-When-Then (Gherkin ringkas) |

## 1. Cara Membaca Dokumen

- **US-xx** = ID user story. Setiap story merujuk satu FR P0.
- **AC-xx.y** = acceptance criteria ke-y untuk US-xx.
- Format: **Given** (kondisi awal) — **When** (aksi) — **Then** (hasil yang diharapkan).
- Semua pesan error dan label antarmuka menggunakan **bahasa Indonesia**.
- Semua validasi otorisasi, kepemilikan data, harga, dan perhitungan dilakukan **di server**. UI hanya menampilkan.
- Data contoh (harga, lokasi, jam) yang belum diverifikasi wajib ditandai **SIMULASI**.

## 2. Ruang Lingkup P0

Berdasarkan PRD v1.1 bagian 14, FR yang wajib MVP adalah:

| FR | Fitur | User Story |
| --- | --- | --- |
| FR-01 | Autentikasi nasabah | US-01 |
| FR-02 | Autentikasi petugas/admin | US-02 |
| FR-04 | Daftar Bank Sampah | US-03 |
| FR-06 | Informasi jenis dan harga sampah | US-04 |
| FR-07 | Pengajuan setoran | US-05 |
| FR-08 | Ringkasan estimasi | US-06 |
| FR-09 | Daftar pengajuan petugas | US-07 |
| FR-10 | Pembaruan status | US-08 |
| FR-11 | Penimbangan aktual | US-09 |
| FR-12 | Perhitungan transaksi | US-10 |
| FR-13 | Konfirmasi transaksi | US-11 |
| FR-14 | Riwayat transaksi | US-12 |
| FR-15 | Saldo/nilai akumulatif | US-13 |
| FR-16 | Pengelolaan data master | US-14 |
| FR-22 | Pemeriksaan & penolakan sampah | US-15 |
| FR-23 | Pembatalan & koreksi transaksi | US-16 |
| NFR-01/02 | Kontrol akses & kepemilikan data | US-17 |

**Di luar cakupan dokumen ini (P1/P2):** FR-03 profil, FR-05 pencarian/filter, FR-17 dashboard, FR-18 konten edukasi, FR-19 scan opsional, FR-20 notifikasi, FR-21 bukti transaksi (P1).

## 3. Definisi Peran

| Peran | Deskripsi |
| --- | --- |
| Nasabah | Pengguna akhir yang mengajukan dan mengantar sampah sendiri ke unit. |
| Petugas | Staf unit yang menerima, memeriksa, menimbang, dan mengonfirmasi transaksi untuk unitnya. |
| Admin | Pengelola data master, akun, unit, kategori, harga, dan laporan. |
| Sistem | Proses otomatis di backend (validasi, perhitungan, pencatatan audit). |

---

## 4. User Stories P0

### US-01 · Registrasi dan login nasabah
**FR:** FR-01 · **Prioritas:** P0 · **Peran:** Nasabah

**Sebagai** calon nasabah,
**saya ingin** mendaftar, login, logout, dan meminta reset kata sandi,
**sehingga** saya dapat mengakses layanan setoran dengan aman.

**Aturan bisnis terkait:** registrasi publik hanya untuk role nasabah; akun petugas/admin hanya dibuat admin.

**Acceptance Criteria:**
- **AC-01.1** Given data registrasi valid (nama, email/telepon, kata sandi memenuhi aturan), When pengguna mengirim formulir, Then akun dibuat dengan role **nasabah** dan pengguna dapat login.
- **AC-01.2** Given email/telepon sudah terdaftar, When pengguna mendaftar, Then sistem menampilkan pesan kesalahan berbahasa Indonesia dan **tidak** membuat akun ganda.
- **AC-01.3** Given kredensial salah, When pengguna login, Then sistem menampilkan pesan umum yang tidak membocorkan apakah email atau kata sandi yang salah, dan tidak memberikan akses.
- **AC-01.4** Given pengguna sudah login, When pengguna logout, Then sesi berakhir dan halaman terlindungi tidak dapat diakses tanpa login ulang.
- **AC-01.5** Given pengguna lupa kata sandi, When meminta reset, Then sistem menampilkan/mengirim instruksi reset sesuai kebijakan dan tidak membocorkan status akun orang lain.
- **AC-01.6** Given registrasi publik, When pengguna memilih peran, Then sistem **tidak** mengizinkan pembuatan akun petugas/admin melalui registrasi publik.

---

### US-02 · Login petugas/admin dan pemeriksaan role
**FR:** FR-02 · **Prioritas:** P0 · **Peran:** Petugas, Admin

**Sebagai** petugas/admin,
**saya ingin** login dengan akun yang dibuat admin dan diarahkan sesuai role,
**sehingga** saya hanya dapat mengakses fitur yang menjadi kewenangan saya.

**Aturan bisnis terkait:** role diperiksa di server sebelum akses diberikan.

**Acceptance Criteria:**
- **AC-02.1** Given akun petugas aktif, When login berhasil, Then pengguna diarahkan ke area petugas dan hanya melihat menu petugas.
- **AC-02.2** Given akun admin aktif, When login berhasil, Then pengguna diarahkan ke area admin dan dapat membuka menu data master.
- **AC-02.3** Given akun nonaktif/ditangguhkan, When pengguna mencoba login, Then akses ditolak dengan pesan yang jelas.
- **AC-02.4** Given pengguna belum login, When mengakses halaman/endpoint terlindungi, Then sistem mengembalikan **401** atau mengarahkan ke login.
- **AC-02.5** Given pengguna dengan role nasabah, When memanggil endpoint petugas/admin, Then sistem mengembalikan **403**.
- **AC-02.6** Given pembuatan akun petugas/admin, When bukan admin yang mencoba membuat, Then permintaan ditolak.

---

### US-03 · Daftar dan detail Bank Sampah
**FR:** FR-04 · **Prioritas:** P0 · **Peran:** Nasabah, Pengunjung

**Sebagai** nasabah,
**saya ingin** melihat daftar dan detail Bank Sampah Unit,
**sehingga** saya dapat memilih unit yang sesuai sebelum menyetor.

**Acceptance Criteria:**
- **AC-03.1** Given terdapat unit berstatus terpublikasi, When nasabah membuka daftar unit, Then sistem menampilkan nama, alamat, jam operasional, status layanan, dan kontak bila tersedia.
- **AC-03.2** Given unit tidak dipublikasikan/nonaktif, When nasabah membuka daftar, Then unit tersebut tidak ditampilkan sebagai pilihan aktif.
- **AC-03.3** Given nasabah membuka detail unit, When halaman dimuat, Then informasi unit ditampilkan lengkap dan konsisten dengan data master.
- **AC-03.4** Given data unit masih berupa data simulasi, When ditampilkan, Then terdapat label **SIMULASI** yang jelas.
- **AC-03.5** Given belum ada unit terpublikasi, When membuka daftar, Then sistem menampilkan empty state berbahasa Indonesia.

---

### US-04 · Informasi jenis dan harga sampah
**FR:** FR-06 · **Prioritas:** P0 · **Peran:** Nasabah

**Sebagai** nasabah,
**saya ingin** melihat kategori sampah dan harga per kilogram yang berlaku,
**sehingga** saya dapat memperkirakan nilai setoran saya.

**Aturan bisnis terkait:** harga unit menimpa harga global (D-04); harga aktif memiliki periode berlaku.

**Acceptance Criteria:**
- **AC-04.1** Given terdapat kategori aktif dan harga aktif, When nasabah membuka informasi harga, Then sistem menampilkan nama kategori dan harga per kg.
- **AC-04.2** Given tersedia harga khusus unit dan harga global untuk kategori yang sama, When menampilkan harga untuk unit tersebut, Then **harga unit** yang digunakan.
- **AC-04.3** Given suatu harga memiliki periode `effective_from`/`effective_to`, When tanggal saat ini di luar periode, Then harga tersebut tidak ditampilkan sebagai harga aktif.
- **AC-04.4** Given harga masih berupa data simulasi, When ditampilkan, Then terdapat label **SIMULASI**.
- **AC-04.5** Given tidak ada kategori/harga aktif, When membuka halaman, Then sistem menampilkan pesan bahwa harga belum tersedia.

---

### US-05 · Pengajuan setoran
**FR:** FR-07 · **Prioritas:** P0 · **Peran:** Nasabah

**Sebagai** nasabah,
**saya ingin** mengajukan setoran dengan memilih unit, kategori, dan estimasi berat,
**sehingga** petugas dapat menyiapkan proses penerimaan sampah.

**Aturan bisnis terkait:** berat nasabah adalah estimasi; nasabah mengantar sendiri (D-01).

**Acceptance Criteria:**
- **AC-05.1** Given nasabah sudah login dan memilih unit aktif, minimal satu kategori, serta estimasi berat > 0, When mengirim pengajuan, Then sistem membuat deposit berstatus **Menunggu** dan mencatat `submitted_at`.
- **AC-05.2** Given data wajib belum lengkap atau estimasi berat tidak valid (≤ 0/bukan angka), When mengirim, Then sistem menampilkan validasi dan **tidak** membuat deposit.
- **AC-05.3** Given unit yang dipilih tidak menerima setoran/tidak aktif, When mengirim, Then sistem menolak dan meminta memilih unit lain.
- **AC-05.4** Given pengajuan berhasil dibuat, When petugas unit terkait membuka daftar pengajuan, Then pengajuan muncul pada antrean unit tersebut.
- **AC-05.5** Given nasabah mengirim pengajuan, Then `customer_id` diambil dari sesi server dan **tidak** dapat diisi dengan ID nasabah lain dari klien.
- **AC-05.6** Given pengajuan berhasil, Then ringkasan menegaskan bahwa sampah **di antar sendiri** ke unit dan berat masih **estimasi**.

---

### US-06 · Ringkasan estimasi
**FR:** FR-08 · **Prioritas:** P0 · **Peran:** Nasabah

**Sebagai** nasabah,
**saya ingin** melihat ringkasan estimasi berat dan nilai sebelum mengonfirmasi,
**sehingga** saya memahami bahwa nilainya belum final.

**Acceptance Criteria:**
- **AC-06.1** Given nasabah memilih kategori dan estimasi berat, When ringkasan ditampilkan, Then sistem menampilkan estimasi nilai per kategori dan total.
- **AC-06.2** Given ringkasan estimasi ditampilkan, Then terdapat label jelas **"estimasi, bukan nilai final"**.
- **AC-06.3** Given harga aktif berubah sebelum penimbangan, When ringkasan dihitung ulang, Then estimasi memakai harga aktif terbaru, sedangkan nilai final nanti memakai snapshot saat konfirmasi.
- **AC-06.4** Given berat aktual berbeda dari estimasi, Then nilai final tetap dihitung dari berat aktual (lihat US-10), bukan estimasi.

---

### US-07 · Daftar pengajuan petugas
**FR:** FR-09 · **Prioritas:** P0 · **Peran:** Petugas

**Sebagai** petugas,
**saya ingin** melihat pengajuan yang ditujukan ke unit saya,
**sehingga** saya dapat memproses setoran yang datang.

**Acceptance Criteria:**
- **AC-07.1** Given petugas terhubung ke Unit A, When membuka daftar pengajuan, Then hanya pengajuan Unit A yang ditampilkan.
- **AC-07.2** Given petugas Unit A mencoba membuka pengajuan Unit B, When mengakses detail/endpoint, Then sistem mengembalikan **403/404**.
- **AC-07.3** Given pengajuan baru berstatus Menunggu, When daftar dimuat, Then pengajuan muncul dengan status yang benar.
- **AC-07.4** Given daftar pengajuan, When petugas memfilter berdasarkan status, Then daftar menampilkan hasil sesuai filter.
- **AC-07.5** Given belum ada pengajuan, When membuka daftar, Then sistem menampilkan empty state.

---

### US-08 · Pembaruan status pengajuan
**FR:** FR-10 · **Prioritas:** P0 · **Peran:** Petugas

**Sebagai** petugas,
**saya ingin** memperbarui status pengajuan sesuai tahap proses,
**sehingga** nasabah dapat memantau progres setorannya.

**Aturan bisnis terkait:** transisi status mengikuti alur Menunggu → Diproses → Selesai/Dibatalkan; perubahan dicatat di `transaction_events`.

**Acceptance Criteria:**
- **AC-08.1** Given pengajuan berstatus Menunggu, When petugas mulai memproses, Then status berubah menjadi **Diproses**, `processed_at` terisi, dan event mencatat aktor serta waktu.
- **AC-08.2** Given transisi status tidak valid (misalnya Menunggu → Selesai tanpa penimbangan), When petugas mencoba, Then sistem menolak perubahan.
- **AC-08.3** Given status berubah, When nasabah membuka status pengajuan, Then nasabah melihat status terbaru.
- **AC-08.4** Given pengajuan dibatalkan, Then sistem mewajibkan alasan dan mencatatnya (lihat US-15/US-16).
- **AC-08.5** Given petugas Unit A, When mencoba mengubah status pengajuan Unit B, Then ditolak.

---

### US-09 · Penimbangan aktual
**FR:** FR-11 · **Prioritas:** P0 · **Peran:** Petugas

**Sebagai** petugas,
**saya ingin** memasukkan berat aktual per kategori,
**sehingga** nilai transaksi dihitung dari hasil timbang yang benar.

**Acceptance Criteria:**
- **AC-09.1** Given pengajuan berstatus Diproses, When petugas memasukkan berat aktual per kategori yang diterima, Then berat tersimpan dengan presisi Decimal yang disepakati.
- **AC-09.2** Given berat aktual ≤ 0 atau bukan angka valid, When menyimpan, Then sistem menampilkan validasi dan tidak menyimpan.
- **AC-09.3** Given kategori ditolak, When petugas menandai tolak, Then berat tidak wajib diisi dan alasan penolakan wajib dicatat.
- **AC-09.4** Given petugas menyimpan berat, Then identitas petugas dan waktu input tercatat untuk audit.
- **AC-09.5** Given petugas Unit A, When menginput berat untuk pengajuan Unit B, Then ditolak.

---

### US-10 · Perhitungan transaksi di server
**FR:** FR-12 · **Prioritas:** P0 · **Peran:** Sistem

**Sebagai** sistem,
**saya ingin** menghitung nilai per kategori dan total dari berat aktual × harga snapshot,
**sehingga** nilai transaksi akurat dan dapat ditelusuri.

**Aturan bisnis terkait:** nilai = berat aktual × harga/kg; harga unit menimpa global; snapshot disimpan di `deposit_items.unit_price_snapshot`.

**Acceptance Criteria:**
- **AC-10.1** Given berat aktual dan harga aktif tersedia, When sistem menghitung, Then `line_total = actual_weight × unit_price_snapshot` sesuai aturan pembulatan yang disepakati.
- **AC-10.2** Given tersedia harga unit dan harga global, When menghitung, Then sistem memakai **harga unit** (D-04) dan menyimpannya sebagai snapshot.
- **AC-10.3** Given transaksi sudah selesai dan harga master berubah, When transaksi lama dibuka, Then nilai transaksi lama **tidak berubah** karena memakai snapshot.
- **AC-10.4** Given beberapa kategori diterima, When menghitung, Then total transaksi = jumlah seluruh `line_total`.
- **AC-10.5** Given klien mengirim nilai/berat yang dimanipulasi, Then server menghitung ulang dan tidak memercayai nilai dari klien.

---

### US-11 · Konfirmasi transaksi atomik dan idempotent
**FR:** FR-13 · **Prioritas:** P0 · **Peran:** Petugas

**Sebagai** petugas,
**saya ingin** mengonfirmasi transaksi final,
**sehingga** status menjadi Selesai tepat satu kali tanpa data ganda saat retry.

**Aturan bisnis terkait:** konfirmasi harus atomik (satu DB transaction) dan idempotent (retry aman).

**Acceptance Criteria:**
- **AC-11.1** Given pengajuan Diproses dengan berat dan harga valid, When petugas mengonfirmasi, Then dalam **satu transaksi database**: deposit menjadi **Selesai**, data transaksi dibuat, total tersimpan, dan event tercatat.
- **AC-11.2** Given permintaan konfirmasi diulang dengan idempotency key yang sama, When diproses, Then sistem **tidak** membuat transaksi/saldo ganda.
- **AC-11.3** Given terjadi kegagalan di tengah proses, When transaksi database gagal, Then seluruh perubahan di-rollback dan tidak ada data parsial.
- **AC-11.4** Given pengajuan sudah Selesai, When petugas mengonfirmasi lagi, Then sistem menolak atau mengembalikan respons idempotent tanpa efek ganda.
- **AC-11.5** Given konfirmasi berhasil, When nasabah membuka status/riwayat, Then transaksi tampil sebagai Selesai dengan nilai final.
- **AC-11.6** Given petugas Unit A, When mengonfirmasi transaksi Unit B, Then ditolak.

---

### US-12 · Riwayat transaksi nasabah
**FR:** FR-14 · **Prioritas:** P0 · **Peran:** Nasabah

**Sebagai** nasabah,
**saya ingin** melihat riwayat setoran/transaksi milik saya,
**sehingga** saya dapat memverifikasi catatan setoran.

**Acceptance Criteria:**
- **AC-12.1** Given nasabah sudah login, When membuka riwayat, Then hanya transaksi miliknya yang ditampilkan, terbaru lebih dulu.
- **AC-12.2** Given transaksi Selesai, When membuka detail, Then sistem menampilkan tanggal, unit, kategori, berat aktual, harga/kg, nilai, dan status.
- **AC-12.3** Given nasabah mencoba membuka ID transaksi milik nasabah lain, When mengakses, Then sistem mengembalikan **403/404**.
- **AC-12.4** Given transaksi Dibatalkan, When ditampilkan, Then alasan pembatalan ikut ditampilkan.
- **AC-12.5** Given belum ada transaksi, When membuka riwayat, Then sistem menampilkan empty state.

---

### US-13 · Saldo/nilai akumulatif
**FR:** FR-15 · **Prioritas:** P0 · **Peran:** Nasabah

**Sebagai** nasabah,
**saya ingin** melihat nilai akumulatif setoran saya,
**sehingga** saya mengetahui total nilai yang tercatat.

**Aturan bisnis terkait:** saldo adalah catatan nilai setoran, **bukan** dana yang dapat ditarik.

**Acceptance Criteria:**
- **AC-13.1** Given nasabah memiliki transaksi Selesai, When membuka saldo/nilai akumulatif, Then nilai = jumlah nilai transaksi yang sah sesuai kebijakan.
- **AC-13.2** Given ada transaksi Dibatalkan atau dikoreksi, When saldo dihitung, Then hanya nilai yang sah yang diperhitungkan.
- **AC-13.3** Given saldo ditampilkan, Then terdapat penjelasan jelas bahwa ini **catatan nilai setoran, bukan dana cair/yang dapat ditarik**.
- **AC-13.4** Given belum ada transaksi, When membuka saldo, Then nilai 0 dengan penjelasan.
- **AC-13.5** Given nasabah lain, When mengakses saldo, Then hanya saldo miliknya yang dapat dilihat.

---

### US-14 · Pengelolaan data master
**FR:** FR-16 · **Prioritas:** P0 · **Peran:** Admin

**Sebagai** admin,
**saya ingin** mengelola unit, kategori, harga, akun, dan status publikasi,
**sehingga** data operasional akurat dan terkontrol.

**Acceptance Criteria:**
- **AC-14.1** Given admin, When membuat/mengubah unit, kategori, atau harga, Then perubahan tersimpan dan mencatat aktor serta waktu.
- **AC-14.2** Given admin mengubah harga, When disimpan, Then harga baru memiliki `effective_from` dan transaksi lama **tidak** berubah (snapshot).
- **AC-14.3** Given admin membuat akun petugas/admin, Then role ditetapkan admin dan status aktivasi dikendalikan admin.
- **AC-14.4** Given admin menonaktifkan akun, When pengguna tersebut mencoba login, Then akses ditolak.
- **AC-14.5** Given admin mengubah status publikasi unit, Then hanya unit terpublikasi yang tampil ke nasabah.
- **AC-14.6** Given pengguna bukan admin, When memanggil endpoint data master, Then sistem mengembalikan **403**.
- **AC-14.7** Given dua periode harga untuk kategori dan unit yang sama tumpang tindih, When disimpan, Then sistem menolak.

---

### US-15 · Pemeriksaan dan penolakan sampah
**FR:** FR-22 · **Prioritas:** P0 · **Peran:** Petugas

**Sebagai** petugas,
**saya ingin** mencatat hasil pemeriksaan dan alasan penolakan,
**sehingga** sampah yang tidak sesuai ditangani dengan benar dan tercatat.

**Aturan bisnis terkait:** penolakan wajib alasan dan tercatat di `transaction_events`.

**Acceptance Criteria:**
- **AC-15.1** Given sampah diterima petugas, When petugas mencatat hasil pemeriksaan, Then hasil (diterima/ditolak per kategori) tersimpan.
- **AC-15.2** Given petugas menolak sampah, When menyimpan tanpa alasan, Then sistem menolak dan mewajibkan alasan.
- **AC-15.3** Given penolakan disimpan, Then status pengajuan menjadi **Dibatalkan** dan event mencatat aktor, alasan, serta waktu.
- **AC-15.4** Given hanya sebagian kategori ditolak, Then kategori yang diterima lanjut ke penimbangan, sedangkan kategori ditolak tercatat dengan alasan.
- **AC-15.5** Given pengajuan Dibatalkan, When nasabah membuka status, Then nasabah melihat status dan alasan penolakan.

---

### US-16 · Pembatalan dan koreksi transaksi
**FR:** FR-23 · **Prioritas:** P0 · **Peran:** Petugas, Admin

**Sebagai** petugas/admin berwenang,
**saya ingin** membatalkan atau mengoreksi transaksi dengan alasan,
**sehingga** kesalahan dapat diperbaiki tanpa menghilangkan jejak audit.

**Aturan bisnis terkait:** koreksi setelah Selesai tidak menghapus riwayat; semua perubahan tercatat di `transaction_events`.

**Acceptance Criteria:**
- **AC-16.1** Given pengguna berwenang, When membatalkan/mengoreksi, Then sistem mewajibkan alasan sebelum menyimpan.
- **AC-16.2** Given koreksi transaksi Selesai, When disimpan, Then nilai lama tetap dapat ditelusuri dan nilai baru tercatat.
- **AC-16.3** Given pembatalan/koreksi, Then event mencatat status lama, status baru, aktor, alasan, dan waktu.
- **AC-16.4** Given pengguna tidak berwenang atau beda unit, When mencoba membatalkan/mengoreksi, Then sistem mengembalikan **403/404**.
- **AC-16.5** Given pembatalan/koreksi berhasil, Then riwayat dan saldo konsisten serta **tidak ada data yang dihapus permanen**.
- **AC-16.6** Given permintaan diulang, Then efeknya idempotent dan tidak membuat event ganda.

---

### US-17 · Kontrol akses dan kepemilikan data (lintas fitur)
**FR:** NFR-01, NFR-02 · **Prioritas:** P0 · **Peran:** Sistem

**Sebagai** sistem,
**saya ingin** menegakkan role dan kepemilikan data di server,
**sehingga** data nasabah dan unit tidak bocor atau disalahgunakan.

**Acceptance Criteria:**
- **AC-17.1** Given nasabah meminta data milik nasabah lain, When endpoint dipanggil, Then sistem mengembalikan **403/404**.
- **AC-17.2** Given petugas meminta data unit lain, When endpoint dipanggil, Then sistem mengembalikan **403/404**.
- **AC-17.3** Given permintaan tanpa autentikasi, Then sistem mengembalikan **401**.
- **AC-17.4** Given role tidak sesuai, Then sistem mengembalikan **403**.
- **AC-17.5** Given UI menyembunyikan tombol/menu, When pengguna memanggil endpoint langsung, Then server tetap menolak (defense in depth).
- **AC-17.6** Given data pribadi ditampilkan, Then hanya field yang diperlukan dan sesuai kewenangan yang ditampilkan.

---

## 5. Matriks Traceability FR → User Story → Test Case

| FR | User Story | Test Case PRD 16.1 |
| --- | --- | --- |
| FR-01 | US-01 | TC-01 |
| FR-02 | US-02 | TC-01 |
| FR-04 | US-03 | TC-02 |
| FR-06 | US-04 | TC-13 |
| FR-07 | US-05 | TC-03, TC-10 |
| FR-08 | US-06 | TC-14 |
| FR-09 | US-07 | TC-03, TC-08 |
| FR-10 | US-08 | TC-03 |
| FR-11 | US-09 | TC-04 |
| FR-12 | US-10 | TC-04, TC-05, TC-13, TC-14 |
| FR-13 | US-11 | TC-06, TC-09 |
| FR-14 | US-12 | TC-07 |
| FR-15 | US-13 | TC-06 |
| FR-16 | US-14 | TC-13 |
| FR-22 | US-15 | TC-11 |
| FR-23 | US-16 | TC-12 |
| NFR-01/02 | US-17 | TC-07, TC-08 |

## 6. Catatan dan Asumsi

- Acceptance criteria ini adalah **dasar** untuk test case dan implementasi; detail teknis (nama endpoint, bentuk payload, aturan pembulatan) ditetapkan pada BSD-13/BSD-14 dan kontrak API.
- Harga, lokasi, jam, dan kapasitas contoh wajib ditandai **SIMULASI** sampai diverifikasi bersama BSU pada fase pilot.
- Temuan pengguna masih berlabel **ASUMSI/KONTEKS** (lihat `docs/WAWANCARA_PENGGUNA.md`).
- Perubahan acceptance criteria yang memengaruhi scope, database, atau API harus melalui Product Owner.
- User story P1/P2 (profil, pencarian/filter, dashboard, edukasi, scan, notifikasi, bukti transaksi) disusun setelah P0 disetujui dan stabil.
