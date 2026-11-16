# Spesifikasi Implementasi Frontend — Bank Sampah Digital (fe-bsd)

Status: **Draf untuk ditinjau** · Versi 0.1 · 16 November 2026
Sumber desain: Figma `Design-BSD` (file key `uuOxl8eqD6bt1k89ZbFX53`), halaman **Prototype PWA** (node `420:2`).
Cakupan: PWA Nasabah dan Petugas (Mobile 390, Tablet 768, Desktop 1280). Admin dan website publik di luar dokumen ini.

> Dokumen ini menerjemahkan prototype Figma menjadi kebutuhan implementasi di `fe-bsd/`. Aturan bisnis kritis tetap mengikuti `AGENTS.md` dan tidak diulang panjang di sini. Hal yang belum ada di dokumen BE/ERD ditandai **[BELUM ADA]** dan dikumpulkan di bagian 14.

---

## 1. Keputusan dan asumsi yang memengaruhi implementasi

| ID | Isi | Status | Dampak ke FE |
| --- | --- | --- | --- |
| D-13 | QR hanya identifikasi: nasabah menampilkan QR, petugas memindai, **hanya petugas** yang mengonfirmasi hingga Selesai | **Diusulkan** (menunggu PO) | Layar Hasil Timbang (Nasabah) dan Scan QR (Petugas) |
| D-14 / CR-03 | **Pickup (penjemputan) masuk MVP**, membalik sebagian D-01 | **Diusulkan** (menunggu PO) | Semua layar Pickup di bagian 4; PRD, BPMN, USER_FLOW, ERD masih menulis Fase 2 |
| — | Registrasi publik hanya Nasabah; akun Petugas/Admin dibuat Admin (aturan bisnis 6) | Tetap | Register tidak menampilkan pilihan Petugas |
| — | Saldo = catatan nilai setoran, bukan dana yang bisa ditarik (aturan 7) | Tetap | Tidak ada tombol tarik, e-wallet, atau OTP |

Asumsi: tidak ada layar Admin di tahap ini; poin/XP, reward, dan pencairan **tidak** dibuat; data harga, unit, petugas, armada, dan lokasi adalah **simulasi** dan harus berlabel.

---

## 2. Stack dan struktur

Stack mengikuti `fe-bsd/AGENTS.md`: Next.js App Router (16.x), React 19, TypeScript strict, Tailwind 4, PWA (manifest + service worker).

```text
fe-bsd/src/
├─ app/
│  ├─ (auth)/           login, register, lupa-password (+ terkirim)
│  ├─ nasabah/          halaman Nasabah (layout + bottom nav / rail)
│  ├─ petugas/          halaman Petugas
│  └─ onboarding/       splash dan onboarding 1-3
├─ components/ui/       komponen dasar yang sudah ada + tambahan (bagian 7)
├─ features/{nasabah,petugas}/   komponen dan hook per fitur
├─ lib/api/             SATU client API ke be-bsd (tidak ada fetch tersebar)
├─ lib/auth/            sesi, guard role, middleware helper
└─ middleware.ts        proteksi route per role (server)
```

Yang sudah ada dan perlu diganti: `src/features/nasabah/prototype-api.ts`, `prototype-store.tsx`, `draft.ts`, `mock-data.ts` (prototype BSD-17 memakai `localStorage`). Mock tetap boleh dipakai sampai endpoint tersedia, di belakang antarmuka `lib/api` yang sama.

**Dependency baru (perlu konfirmasi sebelum ditambah, sesuai `AGENTS.md`):** `zod` (validasi form, sudah diwajibkan di AGENTS), generator QR, pemindai QR berbasis kamera, dan pustaka PWA/service worker. Peta dan chat **tidak** memerlukan dependency di MVP (lihat bagian 12).

---

## 3. Responsif

| Ukuran | Lebar | Pola navigasi | Pola konten |
| --- | --- | --- | --- |
| Mobile | < 768 (acuan 390) | Menu bawah 5 item + tombol tengah | Satu kolom; aksi utama di bawah (zona jempol) |
| Tablet | 768-1023 | Menu bawah melebar (maks. 720) | 2 kolom kartu/daftar; layar langkah dalam kolom tengah |
| Desktop | >= 1024 (acuan 1280) | Rail vertikal kiri 80 px | 3 kolom kartu/daftar; layar langkah dalam kolom tengah; tanpa status bar |

Aturan umum: layar **langkah** (form berurutan) dirender sebagai kolom maks. 430 px di tengah pada Tablet/Desktop; layar **daftar** memakai grid; layar **autentikasi** memakai gradien penuh dengan formulir di tengah. Target sentuh >= 44 px, teks >= 12 px, kontras tombol hijau memakai teks cokelat gelap `foreground` (bukan putih).

---

## 4. Peta rute dan layar

Kolom "Frame" = nama frame di Figma (tanpa akhiran ukuran layar). Kolom "State" = state tambahan di luar loading/empty/error umum.

### 4.1 Autentikasi dan onboarding (semua pengguna)

| Rute | Frame | Catatan |
| --- | --- | --- |
| `/onboarding` | Splash, Onboarding 1-3 | Tampil sekali; "Lewati" menuju login. Teks onboarding 2 membahas penjemputan |
| `/login` | Login, Login Gagal | Pemilih peran **Nasabah / Petugas** hanya mengubah salinan teks bantu; peran sebenarnya dari server. State: kredensial salah, **akun dinonaktifkan** (Petugas), loading |
| `/lupa-password` | Lupa Kata Sandi, Lupa Terkirim | Terkirim: pesan berlaku 30 menit, "Kirim ulang" |
| `/register` | Register | **Nasabah saja** (nama, email, WhatsApp +62, kata sandi + kekuatan, konfirmasi, persetujuan S&K) |

### 4.2 Nasabah

| Rute | Frame | Tujuan dan state |
| --- | --- | --- |
| `/nasabah` | Beranda | Saldo setoran (catatan), dua aksi cepat (Antar Sendiri, Jemput), Transaksi Terakhir, Dampak, Tips. Empty: belum ada transaksi |
| `/nasabah/saldo` | Saldo | Total nilai setoran + daftar setoran selesai; label "bukan dana yang bisa ditarik" |
| `/nasabah/setor` | Daftar Bank Sampah | Cari, filter (Buka Sekarang, Terdekat, Menerima Logam), kartu unit; unit Tutup tidak bisa dipilih. Langkah 1 dari 5 |
| `/nasabah/setor/[unitId]` | Detail Bank Sampah | Alamat, jam, kontak, harga/kg (label simulasi), cara menyetor; tombol "Setor ke Unit Ini" |
| `/nasabah/setor/[unitId]/jenis` | Setor | Pilih jenis (grid), multi-pilih. Langkah 2 dari 5 |
| `/nasabah/setor/[unitId]/berat` | Berat Sampah | Input estimasi per jenis (stepper -/+ dan angka), subtotal **estimasi**, total, catatan "bukan nilai final". Langkah 3 dari 5 |
| `/nasabah/setor/[unitId]/metode` | Metode Setor | Antar Sendiri atau Jemput oleh Petugas. Langkah 4 dari 5 |
| `/nasabah/setor/[unitId]/pickup` | Atur Pickup | Lokasi (alamat + peta), tanggal, jam, catatan. Hanya jika memilih Jemput |
| `/nasabah/setor/ringkasan` | Konfirmasi Setoran | Ringkasan estimasi + catatan penimbangan; tombol kirim dengan idempotency key. Langkah 5 dari 5. State: gagal kirim + coba lagi |
| `/nasabah/riwayat` | Status (Riwayat Setoran) | Filter Semua/Menunggu/Diproses/Selesai; baris per status; Dibatalkan menampilkan alasan |
| `/nasabah/setoran/[id]` | (diturunkan dari status) | Router ke tampilan sesuai status dan metode |
| `/nasabah/setoran/[id]/dibatalkan` | Detail Dibatalkan | Alasan, waktu, "Nilai setoran: tidak ada", tombol Ajukan Setoran Baru |
| `/nasabah/setoran/[id]/penjemputan` | Status Penjemputan | Timeline 7 tahap, kartu petugas, jadwal, alamat |
| `/nasabah/setoran/[id]/chat` | Hubungi Petugas | Lihat bagian 12 (simulasi pada MVP) |
| `/nasabah/setoran/[id]/peta` | Lihat di Peta | Lihat bagian 12 (skematis pada MVP) |
| `/nasabah/setoran/[id]/hasil` | Hasil Timbang | Rincian berat aktual petugas, total **sementara**, QR (kedaluwarsa), catatan "sampaikan ke petugas bila tidak sesuai" |
| `/nasabah/setoran/[id]/selesai` | Setoran Selesai | Nilai final, saldo sebelum/sekarang, rincian, tombol Lihat Bukti |
| `/nasabah/profil` | Profil | Data diri, menu (Saldo, Ubah Kata Sandi, Notifikasi, Bantuan), Keluar |

### 4.3 Petugas

| Rute | Frame | Tujuan dan state |
| --- | --- | --- |
| `/petugas` | Beranda | Kartu antrean, ringkasan hari ini, pengajuan terbaru, catatan |
| `/petugas/antrean` | Antrean, Diproses, Antrean Kosong, Riwayat | Satu halaman dengan 3 tab (parameter `?tab=` bernilai `menunggu`, `diproses`, atau `selesai`). Diproses menampilkan **tahap** per baris. Selesai memuat Selesai + Dibatalkan |
| `/petugas/pengajuan/[id]` | Detail Pengajuan, Detail Pickup | Satu rute; tampilan mengikuti metode. Aksi: Terima & Periksa / Terima Pickup, Tolak (dialog "Yakin?") |
| `/petugas/pengajuan/[id]/tolak` | Tolak Pengajuan | Pilih satu alasan (wajib). Hasil: Dibatalkan + event |
| `/petugas/pengajuan/[id]/tugaskan` | Tugaskan Petugas | Daftar petugas penjemput (tersedia/sibuk). Hanya Pickup |
| `/petugas/pengajuan/[id]/pickup` | Status Pickup | Timeline; aksi "Sampah Diambil" menuju Periksa |
| `/petugas/pengajuan/[id]/chat`, `/peta` | Hubungi Nasabah, Rute Pickup | Seperti sisi Nasabah |
| `/petugas/pengajuan/[id]/periksa` | Periksa Sampah | Sesuai atau Tidak sesuai (menuju Tolak) |
| `/petugas/pengajuan/[id]/timbang` | Timbang Sampah | Input **berat aktual** per jenis; nilai tampil dari server; tombol Konfirmasi dan Batalkan (dialog) |
| `/petugas/pengajuan/[id]/hasil` | Konfirmasi Hasil | Ringkasan, metode, tanggal; Ubah Data kembali ke Timbang |
| `/petugas/pengajuan/[id]/scan` | Scan QR Nasabah, Scan QR Gagal | Kamera; terbaca/valid; gagal: "Scan Ulang" |
| `/petugas/pengajuan/[id]/konfirmasi` | Konfirmasi Transaksi, Memproses, Gagal | Konfirmasi sekali; tombol nonaktif saat proses; gagal: aman diulang (idempotent) |
| `/petugas/pengajuan/[id]/berhasil` | Transaksi Berhasil | Rincian, Lihat Detail |
| `/petugas/transaksi/[id]` | Detail Transaksi | Read-only; harga per kg; catatan koreksi pasca-Selesai hanya Admin |
| `/petugas/profil` | Profil | Data diri, Riwayat Unit, Keluar |

**Dialog konfirmasi (komponen, bukan rute):** Tolak Pengajuan, Tolak Pickup, Batalkan Setoran, Batal Transaksi. Dua tombol: aksi (merah) dan Kembali.

---

## 5. Navigasi

| Peran | Item (kiri ke kanan; di rail: atas ke bawah) | Tombol tengah |
| --- | --- | --- |
| Nasabah | Beranda, Riwayat, **+ Setor**, Saldo, Profil | Mulai setor (menuju Daftar Bank Sampah) |
| Petugas | Beranda, Antrean, **Scan**, Riwayat, Profil | Buka pemindai QR (pilih pengajuan Diproses lebih dulu) |

Aturan: item aktif sesuai rute (`aria-current="page"`); label berbahasa Indonesia; layar langkah dan layar detail menyembunyikan menu bawah dan menampilkan tombol kembali 44 px; indikator langkah (bar progres + "Langkah x dari 5") di header layar setor.

---

## 6. Aturan bisnis menjadi aturan UI

| Aturan | Penerapan FE |
| --- | --- |
| 1. Nilai dihitung server | FE tidak menghitung nilai final; kolom nilai ditampilkan dari respons API. Subtotal estimasi (Nasabah) boleh ditampilkan dari respons server yang sama, berlabel Estimasi |
| 2. Snapshot harga | Tampilkan harga snapshot dari `deposit_items.unit_price_snapshot` pada transaksi lama; jangan ambil harga terkini |
| 3. Berat nasabah = estimasi | Label "Estimasi" + "bukan nilai final" di semua layar Nasabah sebelum Selesai |
| 4. Selesai hanya setelah konfirmasi petugas | Tombol konfirmasi: `disabled` saat proses, kirim header `Idempotency-Key`, retry aman |
| 5. Akses per pemilik/unit | Guard route + 403/404 tanpa membocorkan data; FE tidak menjadi penentu |
| 6. Registrasi hanya nasabah | Tidak ada pilihan Petugas di Register |
| 7. Saldo bukan dana cair | Salin teks "catatan nilai setoran, bukan dana yang bisa ditarik" di Beranda, Saldo, Profil, dan Selesai |
| 8. Pembatalan/koreksi wajib alasan | Form alasan wajib (min. 10 karakter); Detail menampilkan alasan |
| 9. Status | Menunggu, Diproses, Selesai, Dibatalkan (dengan alasan) |
| 10. Data contoh = simulasi | Label "Data contoh (simulasi)" di halaman yang memuat data mock |

Estimasi memakai warna netral (`brown-light`); nilai final memakai hijau (`green-light`) dan hanya muncul pada status Selesai.

---

## 7. Komponen

**Sudah ada** (`components/ui`): `Button` (primary, secondary, outline, ghost, danger), `Input`, `Card`, `Badge`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState`.

**Perlu perubahan:** `Button` primary: teks `foreground` di atas `primary` (jangan putih); varian target sentuh minimal 44 px.

**Perlu dibuat:**

| Komponen | Dipakai di |
| --- | --- |
| `BottomNav` / `SideRail` (+ tombol tengah berlabel) | Semua layar utama |
| `StepHeader` (tombol kembali 44 px, judul, "Langkah x dari 5", bar progres) | Alur setor |
| `TabPills` (Menunggu, Diproses, Selesai; tinggi 42 px) | Antrean, Riwayat |
| `UnitCard` (nama, alamat, jam, jarak, jenis, badge Buka/Tutup) | Daftar Bank Sampah, Tugaskan Petugas (varian petugas) |
| `CategoryCard` (pilih/centang, harga/kg, deskripsi singkat) | Setor, Tolak (varian alasan) |
| `WeightStepper` (-, angka desimal koma, +, satuan kg) | Berat, Timbang |
| `DepositRow` (ikon status, judul, detail, nilai/estimasi, badge) | Riwayat, Antrean, Beranda |
| `SummaryCard` (rincian per jenis, total, label Estimasi atau Final) | Konfirmasi, Hasil, Selesai |
| `Timeline` (tahap, selesai/aktif/menunggu) | Status Penjemputan, Status Pickup |
| `StageBadge` (tahap Diproses: lihat bagian 8) | Antrean tab Diproses |
| `QrPanel` (tampil + hitung mundur kedaluwarsa) / `QrScanner` (kamera + hasil) | Hasil Timbang, Scan QR |
| `ConfirmDialog` (judul, isi, aksi merah, kembali; fokus terkunci) | Aksi destruktif |
| `Toast` | Umpan balik sukses singkat (opsional MVP) |
| `Skeleton` | Loading daftar dan detail |
| `DateTimePicker` ringan (kartu tanggal + chip jam) | Atur Pickup |

Semua komponen memakai token dari `globals.css` (warna, tipografi Poppins 400/600/700, radius, bayangan); **tidak menulis hex baru** (kecuali merah `danger` yang sudah disetujui).

---

## 8. Status dan tahap

| Status | Label | Warna `StatusBadge` |
| --- | --- | --- |
| `menunggu` | Menunggu | warning (cokelat) |
| `diproses` | Diproses | info (biru) |
| `selesai` | Selesai | success (hijau) |
| `dibatalkan` | Dibatalkan | danger (merah) |

Tahap pada status Diproses (tampil di tab Diproses dan Timeline): **Menunggu Penjemputan, Dalam Perjalanan, Sampah Sudah Diterima, Menunggu Penimbangan, Sedang Ditimbang, Menunggu Konfirmasi, Menunggu Scan QR**. Tahap penjemputan hanya untuk metode Pickup. **[BELUM ADA]** di ERD (`deposits` hanya punya 4 status): FE memerlukan field tahap (`process_stage`) atau turunannya dari event.

---

## 9. Kontrak API yang dibutuhkan FE

Mengacu pada matriks hak akses di `docs/BPMN_USE_CASE_RBAC.md` §5.3. Bentuk payload final mengikuti kontrak BE; di sini hanya kebutuhan data FE.

| Kebutuhan | Endpoint (acuan) | Catatan FE |
| --- | --- | --- |
| Registrasi, login, logout, lupa/reset kata sandi | `POST /auth/register`, `/auth/login`, ... | Respons menyertakan peran; akun nonaktif -> kode khusus untuk pesan "akun dinonaktifkan" |
| Unit, kategori, harga | `GET /units`, `/waste-categories`, `/waste-prices` | Filter buka/jarak/jenis; harga unit menimpa global |
| Buat pengajuan | `POST /deposits` | Body: unit, item (kategori + estimasi), metode, (alamat, jadwal, catatan); `Idempotency-Key` |
| Daftar milik sendiri / antrean unit | `GET /deposits` (+ `status`, `stage`, halaman) | Nasabah 🔒, Petugas 🏢 |
| Detail pengajuan | `GET /deposits/:id` | Item, estimasi, status, tahap, alasan batal, metode, petugas penjemput |
| Terima / mulai proses, tolak | `PATCH /deposits/:id/status` | Tolak: alasan wajib |
| Input berat aktual | `POST /deposits/:id/weigh` | Respons: nilai per baris + total (server) |
| Konfirmasi transaksi | `POST /deposits/:id/confirm` | `Idempotency-Key`; respons transaksi final |
| Batalkan | `POST /transactions/:id/cancel` (atau status) | Alasan wajib; Petugas hanya sebelum Selesai |
| Riwayat dan detail transaksi | `GET /transactions`, `/transactions/:id` | Termasuk harga snapshot per baris |
| Saldo | `GET /balance` | Catatan nilai; bukan dana |
| QR nasabah / validasi petugas | **[BELUM ADA]** | Token sekali pakai + masa berlaku (mis. 5 menit); validasi mengembalikan ringkasan transaksi |
| Penjemputan: jadwal, penugasan, tahap, rute | **[BELUM ADA]** | Entitas Fase 2 di ERD §8 (`pickup_requests`, `pickup_assignments`, `pickup_events`) |
| Chat nasabah-petugas | **[BELUM ADA]** | Lihat bagian 12 |

Format error seragam: `{ statusCode, message, code }`, pesan berbahasa Indonesia. FE memetakan `code` ke pesan dan aksi (coba lagi, login ulang, hubungi admin).

---

## 10. Data, sesi, dan keamanan

- **Client API tunggal** di `lib/api`; base URL dari `NEXT_PUBLIC_API_URL` (satu-satunya env publik). Tidak ada rahasia di FE.
- **Sesi:** disarankan cookie `HttpOnly` dari BE agar token tidak tersimpan di JS (**[perlu keputusan]** karena `AGENTS.md` hanya menetapkan env publik). `middleware.ts` memeriksa sesi dan peran sebelum merender; menu yang disembunyikan bukan pengamanan.
- **Pengambilan data:** komponen server untuk daftar/detail awal; komponen klien untuk aksi (kirim, konfirmasi). Setiap halaman wajib punya state loading, kosong, dan error.
- **Idempotency:** kunci dibuat saat pengguna membuka layar konfirmasi dan dipakai ulang saat retry; dibuat baru hanya untuk transaksi baru.
- **Jaringan putus:** tampilkan pesan "Koneksi terputus", pertahankan input, tombol "Coba Lagi" aman (kunci sama).
- **Cache:** service worker network-first untuk data pengguna (transaksi, saldo, antrean); jangan cache agresif.

---

## 11. Form dan validasi (zod; server tetap penentu)

| Form | Aturan |
| --- | --- |
| Login | Email valid; kata sandi wajib |
| Register | Nama wajib; email valid; WhatsApp format Indonesia (+62); kata sandi >= 8 karakter + indikator kekuatan; konfirmasi sama; S&K dicentang |
| Lupa kata sandi | Email valid |
| Berat estimasi (Nasabah) | Angka > 0; desimal koma/titik; maks. 3 desimal; minimal satu jenis dipilih |
| Berat aktual (Petugas) | Angka >= 0; maks. 3 desimal; satuan kg |
| Atur Pickup | Alamat wajib; tanggal dan jam dari pilihan tersedia; catatan opsional (maks. 200 karakter) |
| Alasan tolak/batal | Wajib; min. 10 karakter bila "Lainnya"; tercatat sebagai event |

Pesan error berbahasa Indonesia, spesifik, dan terhubung ke kolom (`aria-describedby`, `aria-invalid`).

---

## 12. PWA, kamera, peta, dan chat

**PWA:** manifest (nama, ikon 192/512 + maskable, `display: standalone`, `theme_color` hijau, `lang: id`), service worker (cache aset statis; halaman offline sederhana; data pengguna network-first), prompt pasang (setelah login pertama berhasil, bisa ditolak). Ikon dan splash memakai logo BSD.

**Kamera (Scan QR):** minta izin saat layar Scan dibuka; keadaan izin ditolak dan kamera tidak ada diberi pesan dan jalan alternatif (masukkan kode manual **[perlu keputusan]**). Hanya HTTPS.

**Peta:** MVP memakai tampilan **skematis berlabel "Peta skematis · bukan lokasi aktual"** seperti prototype; integrasi peta sungguhan dan pelacakan GPS di luar MVP kecuali PO memutuskan lain.

**Chat:** MVP memakai tampilan **contoh percakapan berlabel simulasi**; kanal komunikasi nyata (WhatsApp/telepon) atau layanan chat adalah keputusan terbuka (bagian 14).

---

## 13. Aksesibilitas, performa, dan kualitas

- Target sentuh >= 44 px; teks >= 12 px; kontras tombol dan nilai mengikuti `docs/DESIGN_SYSTEM.md` §2.3; fokus keyboard terlihat; status tidak hanya lewat warna.
- Semua kontrol berlabel (`aria-label`); ikon dekoratif `aria-hidden`; judul halaman (`h1`) unik; `lang="id"`.
- Format angka dan tanggal memakai `Intl` locale `id-ID`, zona `Asia/Jakarta`; rupiah tanpa desimal.
- Performa: gambar/ilustrasi onboarding dioptimalkan (`next/image`), font Poppins hanya bobot 400/600/700, target LCP < 2,5 dtk pada jaringan 4G.
- Lint, `tsc --noEmit`, dan `next build` harus lulus; tidak ada `any` tanpa alasan.

---

## 14. Kesenjangan dan pertanyaan terbuka

| # | Pertanyaan | Pemilik |
| --- | --- | --- |
| 1 | Konfirmasi PO atas **D-14 (Pickup masuk MVP)** dan **D-13 (peran QR)**; pembaruan PRD, BPMN, USER_FLOW, ERD, BACKLOG | PO |
| 2 | Field/enum **tahap proses** (7 tahap) dan status penjemputan di BE | PO + BE |
| 3 | Kontrak QR: format token, masa berlaku, satu kali pakai, alur kegagalan | BE + FE |
| 4 | Kontrak Pickup: alamat, jadwal, penugasan petugas, perhitungan jarak, jam slot | BE |
| 5 | Mekanisme chat/komunikasi dan peta (simulasi vs nyata) | PO |
| 6 | Penyimpanan sesi (cookie HttpOnly vs token) dan CSRF | BE + FE |
| 7 | Dependency baru: QR generator, QR scanner, PWA/service worker, zod | Tim |
| 8 | Layar Admin dan Website publik belum didesain di Prototype PWA | PO |
| 9 | Menu Profil: Ubah Kata Sandi, Notifikasi Status, Bantuan belum punya layar | PO + desain |
| 10 | Notifikasi (lonceng di Beranda): perlu atau tidak di MVP | PO |
| 11 | Keadaan loading/error untuk layar selain yang sudah ada di Figma perlu mengikuti komponen `LoadingState`/`ErrorState` | FE |

---

## 15. Urutan pengerjaan yang disarankan

1. **Fondasi:** perbaikan komponen dasar (tombol, teks, target sentuh), `BottomNav`/`SideRail`, `StepHeader`, `TabPills`, `ConfirmDialog`, `Skeleton`, client API + mock di belakang antarmuka yang sama, `middleware.ts`.
2. **Autentikasi:** onboarding, login (+gagal/nonaktif), register, lupa kata sandi, sesi dan guard.
3. **Nasabah inti (antar sendiri):** Beranda, Daftar/Detail unit, Jenis, Berat, Metode, Konfirmasi, Riwayat/Status, Detail Dibatalkan, Hasil Timbang, Selesai, Saldo, Profil.
4. **Petugas inti:** Beranda, Antrean (3 tab), Detail, Tolak, Periksa, Timbang, Hasil, Konfirmasi (+memproses/gagal), Berhasil, Detail Transaksi, Profil.
5. **QR:** `QrPanel`, `QrScanner`, layar Scan (+gagal). Bergantung pada kontrak QR.
6. **Pickup:** Atur Pickup, Status Penjemputan, Tugaskan, Status Pickup, chat dan peta (simulasi). Bergantung pada keputusan D-14 dan kontrak BE.
7. **PWA dan penyempurnaan:** manifest, service worker, offline, aksesibilitas, performa.

Nomor task BSD mengikuti `docs/BACKLOG..md`; pemetaan task ke urutan di atas belum dibuat.

---

## 16. Kriteria selesai (per layar)

- Rute terlindungi sesuai peran dan unit (verifikasi dengan akun peran lain: 403/404, tidak bocor data).
- State **loading**, **kosong**, dan **error** tersedia; aksi kirim/konfirmasi nonaktif saat proses dan aman diulang.
- Estimasi dan nilai final dibedakan dan berlabel; tidak ada tombol tarik atau istilah dana cair.
- Responsif pada 390, 768, dan 1280 px sesuai bagian 3; tidak ada teks terpotong atau tumpang tindih.
- Teks >= 12 px, target sentuh >= 44 px, kontras memenuhi; semua kontrol berlabel.
- `npm run lint`, `npx tsc --noEmit`, dan `npm run build` lulus; alur utama diuji manual pada Mobile.
- Data simulasi berlabel.

---

## Lampiran A. Frame Figma pada halaman Prototype PWA

- **Nasabah (26):** Splash, Onboarding 1-3, Login, Login Gagal, Lupa Kata Sandi, Lupa Terkirim, Register, Beranda, Saldo, Daftar Bank Sampah, Detail Bank Sampah, Setor, Berat Sampah, Metode Setor, Atur Pickup, Konfirmasi Setoran, Status, Detail Dibatalkan, Status Penjemputan, Hubungi Petugas, Lihat di Peta, Hasil Timbang, Setoran Selesai, Profil.
- **Petugas (31):** Login, Login Gagal, Lupa Kata Sandi, Lupa Terkirim, Beranda, Antrean, Antrean Kosong, Diproses, Detail Pengajuan, Dialog Tolak Pengajuan, Detail Pickup, Dialog Tolak Pickup, Tugaskan Petugas, Status Pickup, Hubungi Nasabah, Rute Pickup, Tolak Pengajuan, Periksa Sampah, Timbang, Dialog Batalkan Setoran, Konfirmasi Hasil, Scan QR, Scan QR Gagal, Konfirmasi Transaksi, Dialog Batal Transaksi, Konfirmasi Memproses, Konfirmasi Gagal, Transaksi Berhasil, Riwayat, Detail Transaksi, Profil.
- Setiap frame ada dalam tiga ukuran (Mobile, Tablet, Desktop); frame tertaut sehingga alur dapat diputar pada mode Present.

Rujukan: `AGENTS.md`, `fe-bsd/AGENTS.md`, `be-bsd/AGENTS.md`, `docs/DESIGN_SYSTEM.md`, `docs/BPMN_USE_CASE_RBAC.md`, `docs/ERD_KAMUS_DATA.md`, `docs/USER_FLOW.md`, `docs/USER_STORIES_P0.md`, `docs/CATATAN PENGERJAAN – Bank Sampah Digital.md` (D-13, D-14, CR-03).
