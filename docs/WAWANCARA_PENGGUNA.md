# Wawancara Pengguna — Instrumen & Pencatatan (BSD-10)

Dokumen kerja untuk **BSD-10 (Wawancara pengguna)**. Berisi instrumen wawancara (Bagian A) dan format pencatatan temuan (Bagian B) agar output task ini dapat langsung menjawab kebutuhan **BSD-11 (PRD v1.1)**, **BSD-12 (user story & acceptance criteria)**, **BSD-13 (BPMN/use case/RBAC)**, dan **BSD-14 (ERD & kamus data)**.

> **Status:** instrumen siap dipakai; **temuan awal sudah diisi (12 Nov 2026)** berdasarkan ringkasan kebutuhan pemilik proyek dan konteks survei. **Wawancara langsung per responden belum dilaksanakan.**
> **Batasan penting:** Bank Sampah Unit (BSU) belum tersedia dan direncanakan diterapkan di **akhir MVP**. Wawancara dengan pengelola/petugas BSU dilakukan sebagai **role-play/simulasi** atau ditunda, dan **wajib ditandai sebagai asumsi** — bukan pernyataan mitra.
> Temuan survei masyarakat (`docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md`) **bukan** hasil wawancara dan tidak boleh ditulis sebagai validasi mitra.

## 1. Tujuan dan ruang lingkup

Tujuan:
- Memahami kebutuhan nyata **nasabah, petugas, pengelola unit, dan admin** pada alur setor sampah.
- Mengidentifikasi pain point, kebutuhan informasi, dan ekspektasi terhadap aplikasi.
- Menyediakan bukti yang dapat dilacak ke **FR/NFR** di PRD, lalu ke user story, BPMN, dan ERD.

Ruang lingkup:
- Alur setor mandiri (pengajuan → datang → pemeriksaan → penimbangan → konfirmasi → riwayat/saldo).
- Penjemputan (sesuai keputusan D-01; jika belum final, digali sebagai kebutuhan, bukan komitmen fitur).
- Kebutuhan operasional unit: harga, jam, kapasitas, penugasan, koreksi/pembatalan.
- Kebutuhan admin: pengelolaan akun, unit, harga, dan laporan.

Output yang harus dihasilkan:
- Dokumen temuan per peran + persona ringkas.
- Daftar kebutuhan P0/P1 dengan prioritas (MoSCoW).
- Matriks traceability temuan → FR/NFR → user story → acceptance criteria.
- Rekomendasi perubahan untuk PRD v1.1 dan daftar asumsi yang masih perlu divalidasi.

## 2. Metode dan batasan

Metode:
- Wawancara **semi-terstruktur**, 30–45 menit, satu responden per sesi.
- Boleh tatap muka, telepon, atau video; catat metode dan tanggal.
- Minta izin sebelum mencatat nama/kontak atau merekam.
- Gunakan pertanyaan terbuka, lalu probing ("mengapa", "bagaimana biasanya", "apa yang paling menyulitkan").

Target responden (minimum):
| Peran | Target | Catatan |
| --- | --- | --- |
| Nasabah / calon nasabah | 3–5 orang | Bisa dari masyarakat umum; utamakan yang pernah menyetor sampah |
| Petugas | 2–3 orang | **Simulasi/role-play** sampai BSU tersedia; tandai asumsi |
| Pengelola unit (BSU) | 1–2 orang | **Ditunda** sampai BSU tersedia; jika simulasi, tandai jelas |
| Admin | 1 orang | Simulasi peran admin sistem (pengelola data master) |

Aturan penandaan:
- Setiap temuan diberi label **`FAKTA`** (dari responden nyata) atau **`ASUMSI`** (role-play/simulasi/penalaran desain).
- Jangan mencampur temuan survei dengan hasil wawancara tanpa label sumber.

## 3. Profil responden

Isi satu baris per responden. Gunakan kode anonim, bukan nama lengkap.

| Kode | Peran | Segmen/domisili | Usia (opsional) | Literasi digital | Tanggal | Metode | Izin | Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-NS-01 | Nasabah | | | Rendah/Sedang/Tinggi | | | Ya/Tidak | FAKTA |
| R-NS-02 | Nasabah | | | | | | | FAKTA |
| R-PT-01 | Petugas | | | | | | | ASUMSI |
| R-PU-01 | Pengelola unit | | | | | | | ASUMSI |
| R-AD-01 | Admin | | | | | | | ASUMSI |

## 4. Panduan pertanyaan

### A. Nasabah / calon nasabah

**Screening**
1. Apakah Anda pernah menyetor sampah ke bank sampah/pengepul? Seberapa sering?
2. Sampah jenis apa yang biasanya Anda pisahkan atau setorkan?

**Kebiasaan & hambatan**
3. Bagaimana alur Anda membuang/menyetor sampah saat ini, dari rumah sampai tercatat?
4. Apa hambatan terbesar untuk mengantar sampah sendiri (jarak, waktu, tenaga, volume, transportasi)?
5. Apa yang membuat Anda batal atau malas menyetor sampah?

**Kebutuhan informasi**
6. Informasi apa yang Anda butuhkan **sebelum** berangkat menyetor? (lokasi, jam, jenis sampah, harga, kontak, status)
7. Bagaimana Anda ingin mengetahui harga per kg dan apakah harga sering berubah?
8. Apakah Anda butuh tahu estimasi nilai sebelum menyetor? Seberapa penting?

**Alur aplikasi**
9. Jika ada aplikasi, langkah apa yang Anda harapkan saat mengajukan setoran?
10. Apakah Anda lebih memilih antar sendiri atau dijemput? Mengapa? (jika jemput: syarat apa yang penting?)
11. Bagaimana Anda ingin menerima bukti transaksi dan melihat saldo/riwayat?
12. Apa yang membuat Anda percaya bahwa berat dan nilai transaksi sudah benar?

**Digital & akses**
13. Perangkat apa yang biasa dipakai (Android/iPhone, versi lama/baru)? Bagaimana kualitas internet di rumah/lokasi setor?
14. Apakah Anda nyaman memindai QR atau menunjukkan kode ke petugas?

### B. Petugas

> Sampai BSU tersedia, jawaban pada bagian ini adalah **ASUMSI** hasil role-play. Jangan diperlakukan sebagai kebijakan unit nyata.

1. Bagaimana alur menerima sampah dari nasabah, dari kedatangan sampai transaksi dicatat?
2. Bagaimana cara memeriksa jenis/kondisi sampah dan apa kriteria sampah ditolak?
3. Bagaimana proses penimbangan dilakukan? Siapa yang berwenang mengonfirmasi hasil?
4. Data apa yang paling penting diinput saat menimbang, dan data apa yang justru memperlambat?
5. Bagaimana Anda menangani kesalahan input berat/harga setelah transaksi tercatat?
6. Bagaimana proses pembatalan atau koreksi dilakukan, dan siapa yang menyetujui?
7. Apa kendala perangkat/jaringan saat melayani nasabah? Bagaimana Anda mencatat sementara jika sistem bermasalah?
8. Bagaimana Anda mengetahui tugas penjemputan (jika ada) dan membuktikan serah-terima sampah?
9. Berapa banyak nasabah yang bisa dilayani per jam/hari, dan pada jam apa paling ramai?
10. Fitur apa yang paling membantu pekerjaan Anda, dan fitur apa yang sebaiknya tidak ada?

### C. Pengelola unit (BSU)

> Ditunda sampai BSU tersedia. Jika dilakukan sebagai role-play, tandai **ASUMSI**.

1. Bagaimana struktur operasional unit: siapa mengelola harga, petugas, dan jadwal?
2. Bagaimana harga per kg ditentukan, diperbarui, dan disosialisasikan? Apakah berbeda per unit/wilayah?
3. Berapa kapasitas penerimaan dan jumlah petugas ideal per hari?
4. Bagaimana aturan penugasan petugas dan penentuan unit tujuan (khusus penjemputan)?
5. Bagaimana kebijakan pembatalan, gagal jemput, alamat tidak ditemukan, dan keterlambatan?
6. Laporan apa yang dibutuhkan pengelola (harian, periode, per jenis sampah, per petugas)?
7. Bagaimana proses serah-terima sampah dari petugas lapangan ke unit?
8. Apa syarat kesediaan unit mengikuti pilot (perangkat, pelatihan, PIC, waktu)?

### D. Admin (sistem)

> Simulasi peran admin; tandai **ASUMSI**.

1. Data master apa yang perlu dikelola admin (akun, unit, petugas, kategori sampah, harga)?
2. Bagaimana alur pembuatan/aktivasi akun petugas dan pengelola unit?
3. Bagaimana admin memastikan perubahan harga tidak mengubah transaksi lama?
4. Laporan/dashboard apa yang paling penting, dan untuk keputusan apa?
5. Bagaimana admin menangani permintaan koreksi/pembatalan dan jejak auditnya?

### E. Pertanyaan penutup (semua peran)
1. Jika hanya **satu** hal yang bisa diperbaiki dari proses saat ini, apa itu?
2. Apakah ada hal penting yang belum saya tanyakan?

## 5. Pencatatan hasil

### 5.1 Ringkasan temuan awal (12 Nov 2026)

> **Sumber:** ringkasan kebutuhan dari pemilik proyek, dilengkapi konteks survei masyarakat (`docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md`).
> **Label:** **ASUMSI/KONTEKS** — belum merupakan hasil wawancara langsung per responden. Wajib diverifikasi pada sesi wawancara dan fase pilot BSU.

**Masalah utama yang teridentifikasi**

| No | Masalah | Dampak bagi pengguna | Kebutuhan sistem | FR/NFR terkait |
| --- | --- | --- | --- | --- |
| M-01 | Risiko kehilangan buku tabungan/catatan kertas | Riwayat setoran dan saldo tidak dapat dibuktikan | Pencatatan digital, riwayat transaksi, bukti transaksi | FR-14, FR-15, FR-21; NFR-03 |
| M-02 | Antrean pencatatan di unit | Waktu tunggu lama, petugas kewalahan | Pengajuan setoran sebelum datang, daftar pengajuan petugas, status yang jelas | FR-07, FR-09, FR-10 |
| M-03 | Kesalahan perhitungan nilai | Nilai transaksi tidak akurat, potensi sengketa | Input berat aktual, perhitungan otomatis di server, konfirmasi sebelum selesai | FR-11, FR-12, FR-13; NFR-03 |
| M-04 | Keterbatasan informasi lokasi dan jam operasional | Nasabah datang sia-sia atau ke unit yang salah | Daftar unit + alamat, jam operasional, status, kontak | FR-04, FR-05 |
| M-05 | Prosedur penyetoran belum jelas | Nasabah ragu, bertanya berulang, proses tidak konsisten | Panduan alur pengajuan → kedatangan → penimbangan → konfirmasi | FR-07, FR-08; konten edukasi (FR-18) |
| M-06 | Informasi harga per kilogram belum terbuka | Nasabah tidak dapat memperkirakan nilai setoran | Kategori sampah + harga/kg aktif per unit | FR-06, FR-08 |

**Kebutuhan per peran**

| Peran | Kebutuhan | FR/NFR terkait | Prioritas |
| --- | --- | --- | --- |
| Nasabah | Informasi kategori dan harga sampah | FR-06 | Must |
| Nasabah | Estimasi nilai setoran (ditandai bukan nilai final) | FR-08 | Must |
| Nasabah | Lokasi unit dan jam operasional | FR-04, FR-05 | Must |
| Nasabah | Pengajuan setoran | FR-07 | Must |
| Nasabah | Status pengajuan/setoran | FR-10, FR-20 | Should |
| Nasabah | Riwayat transaksi dan bukti transaksi | FR-14, FR-15, FR-21 | Must |
| Petugas | Daftar pengajuan yang ditujukan ke unitnya | FR-09 | Must |
| Petugas | Pemeriksaan jenis/kondisi sampah | FR-11 + aturan penolakan (perlu diperjelas di PRD) | Must |
| Petugas | Input berat aktual per kategori | FR-11 | Must |
| Petugas | Perhitungan nilai otomatis | FR-12 | Must |
| Petugas | Konfirmasi transaksi | FR-13 | Must |
| Admin | Pengelolaan akun petugas/admin | FR-16 | Must |
| Admin | Pengelolaan unit | FR-16 | Must |
| Admin | Pengelolaan kategori sampah | FR-16 | Must |
| Admin | Pengelolaan harga aktif | FR-16 | Must |
| Admin | Laporan pengajuan/transaksi | FR-17 | Should |

**Alur bisnis utama (sesuai input)**

1. Nasabah mengajukan setoran (memilih unit, kategori, estimasi berat).
2. Nasabah **datang langsung** ke unit.
3. Petugas memeriksa sampah dan menimbang berat aktual.
4. Petugas mengonfirmasi transaksi; nilai dihitung sistem dan dicatat.
5. Nasabah dapat melihat status, riwayat, saldo/nilai akumulatif, dan bukti transaksi.

> **Catatan scope:** alur yang disebutkan adalah **antar sendiri**, bukan penjemputan. Ini mendukung opsi (a) pada keputusan **D-01**, tetapi keputusan final tetap di Product Owner. Kebutuhan penjemputan belum tervalidasi dan tetap ditandai asumsi.

### 5.2 Format pencatatan per sesi

Catat ringkas (bukan transkrip penuh). Satu tabel per sesi.

**Header sesi**
- Kode responden: · Peran: · Tanggal: · Metode: · Durasi: · Label: FAKTA / ASUMSI

| No | Pertanyaan | Jawaban ringkas | Kutipan penting | Pain point | Kebutuhan | Prioritas (MoSCoW) | FR/NFR terkait | Label |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

Panduan kolom:
- **Prioritas**: Must / Should / Could / Won't (untuk MVP).
- **FR/NFR terkait**: rujuk ID di `docs/PRD_Bank_Sampah_Digital_v1.1.md`; tulis "baru" jika belum ada.
- **Label**: FAKTA (responden nyata) / ASUMSI (simulasi/role-play/penalaran desain).

## 6. Matriks traceability

Isi setelah semua sesi. Satu baris per temuan/kebutuhan yang layak masuk PRD/user story.

| ID Temuan | Temuan / Kebutuhan | Peran sumber | FR/NFR | User story (BSD-12) | Acceptance criteria | BPMN/ERD terkait | Prioritas | Status validasi |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-01 | Catatan kertas berisiko hilang; butuh riwayat dan bukti transaksi digital | Nasabah | FR-14, FR-15, FR-21; NFR-03 | US-xx | Nasabah melihat daftar/detail transaksi dan bukti setelah selesai | ERD: transactions, deposit_items; BPMN: riwayat | Must | ASUMSI (perlu wawancara) |
| T-02 | Pengajuan setoran sebelum datang untuk mengurangi antrean | Nasabah | FR-07 | US-xx | Nasabah memilih unit, kategori, estimasi berat, lalu mengirim pengajuan | ERD: deposits; BPMN: pengajuan setoran | Must | ASUMSI |
| T-03 | Petugas butuh daftar pengajuan yang ditujukan ke unitnya | Petugas | FR-09 | US-xx | Petugas hanya melihat pengajuan unitnya | ERD: deposits, units, unit_staff | Must | ASUMSI |
| T-04 | Input berat aktual per kategori oleh petugas | Petugas | FR-11 | US-xx | Berat aktual tersimpan per item; dapat dikoreksi dengan alasan | ERD: deposit_items | Must | ASUMSI |
| T-05 | Perhitungan nilai otomatis dan konsisten | Petugas, Admin | FR-12; NFR-03 | US-xx | Nilai = berat aktual × harga snapshot; dihitung server | ERD: deposit_items.unit_price_snapshot | Must | ASUMSI |
| T-06 | Konfirmasi transaksi harus final dan tidak ganda | Petugas | FR-13; NFR-03 | US-xx | Konfirmasi atomik & idempotent; transaksi selesai sekali | ERD: transactions, transaction_events | Must | ASUMSI |
| T-07 | Informasi lokasi, jam operasional, dan kontak unit | Nasabah | FR-04, FR-05 | US-xx | Nasabah mencari unit dan melihat alamat/jam/status | ERD: units | Must | ASUMSI |
| T-08 | Kategori dan harga per kg harus transparan | Nasabah | FR-06 | US-xx | Kategori dan harga aktif tampil per unit/kebijakan | ERD: waste_categories, waste_prices | Must | ASUMSI |
| T-09 | Estimasi nilai membantu keputusan, tetapi bukan nilai final | Nasabah | FR-08 | US-xx | Estimasi ditandai "bukan nilai final"; nilai final setelah timbang | ERD: deposits | Must | ASUMSI |
| T-10 | Status pengajuan/setoran perlu jelas | Nasabah | FR-10, FR-20 | US-xx | Status Menunggu/Diproses/Selesai/Dibatalkan tampil konsisten | ERD: deposits, transactions | Should | ASUMSI |
| T-11 | Admin mengelola akun, unit, kategori, harga, dan laporan | Admin | FR-16, FR-17 | US-xx | Admin dapat CRUD data master dan melihat laporan | ERD: users, units, waste_categories, waste_prices | Must | ASUMSI |

## 7. Sintesis temuan

### 7.1 Persona ringkas
| Persona | Tujuan utama | Pain point utama | Kebutuhan kunci | Catatan |
| --- | --- | --- | --- | --- |
| Nasabah | Menyetor sampah dengan mudah, nilai transparan, catatan aman | Catatan kertas hilang, antre, prosedur & harga tidak jelas, info lokasi/jam terbatas | Info kategori/harga, estimasi nilai, lokasi & jam, pengajuan, status, riwayat/bukti | ASUMSI/KONTEKS — belum wawancara langsung |
| Petugas | Melayani setoran cepat dan akurat | Antrean pencatatan, risiko salah hitung, input manual berulang | Daftar pengajuan, pemeriksaan sampah, input berat aktual, perhitungan otomatis, konfirmasi | ASUMSI (role-play) |
| Pengelola unit | Operasional tertib, data harga/unit akurat, laporan tersedia | Pencatatan tersebar, kapasitas & penugasan belum jelas | Data unit, kategori, harga, akun petugas, laporan | Belum divalidasi (BSU akhir MVP) |
| Admin | Data master akurat dan akses terkontrol | Perubahan harga/akun tidak terpusat | Kelola akun, unit, kategori, harga, laporan | ASUMSI (simulasi peran) |

### 7.2 Journey dan pain point
| Tahap | Yang dilakukan | Pain point | Peluang perbaikan | Bukti (ID temuan) |
| --- | --- | --- | --- | --- |
| Sebelum setor | Mencari lokasi, jam, jenis sampah, dan harga | Informasi terbatas/tidak terbuka | Direktori unit + kategori + harga | M-04, M-06; T-07, T-08 |
| Pengajuan | Menyiapkan sampah dan datang ke unit | Prosedur belum jelas; antre | Pengajuan setoran + panduan alur + estimasi | M-02, M-05; T-02, T-09 |
| Kedatangan/penimbangan | Petugas memeriksa dan menimbang | Antrean pencatatan; salah hitung | Daftar pengajuan, input berat aktual, kalkulasi otomatis | M-02, M-03; T-03, T-04, T-05 |
| Konfirmasi | Petugas mengonfirmasi transaksi | Risiko transaksi ganda/salah final | Konfirmasi atomik & idempotent | M-03; T-06 |
| Setelah transaksi | Mencatat di buku dan menyimpan bukti | Buku/catatan kertas berisiko hilang | Riwayat, saldo/nilai akumulatif, bukti digital | M-01; T-01 |

### 7.3 Kebutuhan P0/P1
| Kebutuhan | Prioritas | Alasan | FR/NFR | Sumber |
| --- | --- | --- | --- | --- |
| Informasi unit: lokasi, jam operasional, status, kontak | P0 (Must) | Mengurangi salah datang dan pertanyaan berulang | FR-04, FR-05 | M-04 |
| Kategori sampah dan harga/kg aktif | P0 (Must) | Transparansi harga sebelum menyetor | FR-06 | M-06 |
| Pengajuan setoran | P0 (Must) | Mengurangi antrean pencatatan | FR-07 | M-02, M-05 |
| Estimasi nilai (bukan nilai final) | P0 (Must) | Membantu keputusan nasabah | FR-08 | M-05, M-06 |
| Daftar pengajuan untuk petugas | P0 (Must) | Petugas tahu pekerjaan yang masuk | FR-09 | M-02 |
| Input berat aktual per kategori | P0 (Must) | Dasar nilai transaksi | FR-11 | M-03 |
| Perhitungan nilai otomatis di server | P0 (Must) | Mengurangi kesalahan hitung | FR-12; NFR-03 | M-03 |
| Konfirmasi transaksi atomik & idempotent | P0 (Must) | Mencegah transaksi ganda | FR-13; NFR-03 | M-03 |
| Riwayat transaksi dan bukti transaksi | P0 (Must) | Menggantikan catatan kertas | FR-14, FR-21 | M-01 |
| Pengelolaan akun, unit, kategori, harga | P0 (Must) | Data master harus akurat | FR-16 | Kebutuhan admin |
| Status pengajuan/setoran | P1 (Should) | Kejelasan proses bagi nasabah | FR-10, FR-20 | M-05 |
| Saldo/nilai akumulatif | P1 (Should) | Rekap nilai setoran (bukan dana cair) | FR-15 | M-01 |
| Laporan pengajuan/transaksi | P1 (Should) | Monitoring operasional | FR-17 | Kebutuhan admin |

### 7.4 Rekomendasi untuk PRD v1.1 (BSD-11)
- **Perubahan/penambahan FR:**
  - Perjelas FR untuk **pemeriksaan dan penolakan sampah** (kriteria, alasan penolakan) — saat ini belum eksplisit.
  - Perjelas FR **pembatalan/koreksi setelah konfirmasi** beserta alasan dan jejak audit (`transaction_events`).
  - Pastikan FR-08 menegaskan estimasi **bukan nilai final**.
- **Perubahan NFR:**
  - Tegaskan **idempotensi konfirmasi** dan integritas perhitungan (NFR-03).
  - Tegaskan pembatasan akses per peran di server (NFR-01, NFR-02).
- **Aturan bisnis yang perlu diperjelas:**
  - Prioritas harga unit vs global (D-04) dan snapshot harga (`unit_price_snapshot`).
  - Status transaksi: Menunggu, Diproses, Selesai, Dibatalkan + alasan (D-05).
  - Saldo = catatan nilai setoran, **bukan dana yang bisa ditarik**.
- **Keputusan (D-01 s.d. D-07) yang terdampak:**
  - **D-01**: alur utama yang diberikan adalah **antar sendiri**; penjemputan belum tervalidasi.
  - **D-04**, **D-05**: perlu keputusan final sebelum skema & user story dikunci.
  - **D-07**: mitra BSU baru tersedia di akhir MVP; validasi aktual ditunda.

### 7.5 Asumsi yang wajib divalidasi ke BSU
| Asumsi | Dampak jika salah | Cara validasi | Target waktu |
| --- | --- | --- | --- |
| Temuan berasal dari ringkasan pemilik proyek/survei, bukan wawancara langsung | Kebutuhan bisa tidak mewakili pengguna nyata | Wawancara 3–5 nasabah + role-play petugas | Sprint 1 |
| Alur utama = antar sendiri; penjemputan tidak termasuk MVP | Scope/desain bisa berubah jika PO memilih penjemputan | Konfirmasi D-01 ke Product Owner | Sebelum BSD-11 final |
| Kategori & harga aktual belum tersedia | Estimasi dan nilai transaksi tidak sesuai unit nyata | Data harga/kategori dari BSU saat pilot | Akhir MVP/pilot |
| Kapasitas, jam operasional, dan jumlah petugas belum diketahui | Desain antrean/status bisa tidak realistis | Wawancara/observasi unit | Akhir MVP/pilot |
| Perangkat & jaringan petugas memadai | Konfirmasi transaksi bisa terhambat | Uji perangkat/jaringan di unit | Sebelum pilot |
| Kebijakan pembatalan/koreksi belum final | Aturan status & audit bisa salah | Konfirmasi D-05 + SOP unit | Sebelum implementasi transaksi |

### 7.6 Pertanyaan terbuka
- Apakah nasabah mengisi pengajuan **sebelum** berangkat atau saat tiba di unit?
- Berapa lama antrean pencatatan saat ini dan pada jam berapa paling ramai?
- Apakah QR konfirmasi dibutuhkan, atau cukup konfirmasi petugas di layar?
- Bagaimana preferensi nasabah menerima bukti transaksi (layar, unduh, cetak)?
- Siapa PIC pembaruan harga/kategori di unit dan seberapa sering berubah?
- Apakah penjemputan perlu masuk MVP atau tetap Fase 2?

## 8. Log sesi

| Tanggal | Kode responden | Peran | Metode | Ringkasan | Label | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 12 Nov 2026 | — (ringkasan) | Nasabah, Petugas, Admin | Input pemilik proyek + konteks survei masyarakat | Masalah utama (catatan kertas, antrean, salah hitung, info lokasi/jam, prosedur, harga) dan kebutuhan per peran; alur setor antar sendiri | ASUMSI/KONTEKS | Tercatat (belum wawancara langsung) |

## 9. Kriteria selesai BSD-10

BSD-10 dinyatakan selesai apabila:
- [x] Dokumen temuan dan validasi alur setoran tersedia (bagian 5–7 terisi).
- [x] Matriks traceability terisi dan kebutuhan P0 teridentifikasi.
- [x] Rekomendasi untuk PRD v1.1 tercatat.
- [x] Cakupan per peran dicatat jujur:

| Peran | Cakupan | Status | Catatan |
| --- | --- | --- | --- |
| Nasabah | Masalah utama & kebutuhan (info, estimasi, lokasi, pengajuan, status, riwayat) | Sebagian | Ringkasan pemilik proyek/survei; wawancara langsung belum |
| Petugas | Daftar pengajuan, pemeriksaan, berat aktual, perhitungan, konfirmasi | Sebagian | ASUMSI/role-play sampai BSU tersedia |
| Pengelola unit | Data unit, harga, kategori, laporan | Belum | BSU baru tersedia di akhir MVP |
| Admin | Kelola akun, unit, kategori, harga, laporan | Sebagian | ASUMSI/simulasi peran |

> Jika peran pengelola/petugas BSU belum bisa diwawancarai, task tetap dapat dicatat selesai **hanya jika** temuan nasabah + simulasi peran lain tersedia dan seluruh asumsi ditandai jelas. Jika tidak, status task tetap terbuka.

## 10. Etika dan privasi

- Minta persetujuan lisan/tertulis sebelum wawancara dan sebelum mencatat kutipan.
- Gunakan kode anonim; jangan simpan nama, kontak, atau alamat detail tanpa izin.
- Jangan meminta data sensitif yang tidak diperlukan.
- Hapus rekaman (jika ada) setelah temuan diringkas, kecuali disetujui untuk disimpan.
- Sampaikan bahwa temuan dipakai untuk perbaikan rancangan, bukan penawaran komersial.
