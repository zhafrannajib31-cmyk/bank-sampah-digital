# Product Requirements Document (PRD)

## Bank Sampah Digital

**Dokumen kebutuhan produk untuk aplikasi web PWA Native dan website pendukung**

> Konversi dari PDF `PRD_Bank_Sampah_Digital_v1.pdf` ke Markdown. Isi dan keputusan dalam dokumen dipertahankan sesuai sumber; format tabel dari PDF dirapikan seperlunya.
>
> **Status histori:** dokumen ini adalah PRD v1.0. Versi aktif adalah `docs/PRD_Bank_Sampah_Digital_v1.1.md`.

## Informasi Dokumen

Versi                                                      1.0 — Draft awal untuk kebutuhan proyek akademik
Status                                                     Draft untuk review dan validasi tim
Metode Pengembangan                                        SDLC Agile dengan Scrum
Platform                                                   Website Native PWA (Next.js), PostgreSQL
Project Manager, 2 System Analyst, UI/UX Designer, Software
Tim
Developer
Tanggal                                                    11 November 2026

Catatan: fitur, harga sampah, mitra, dan kebijakan operasional perlu divalidasi bersama Bank Sampah calon mitra
sebelum implementasi nyata.

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

## 1. Ringkasan Produk

Bank Sampah Digital adalah sistem pengelolaan sampah berbasis digital yang membantu masyarakat memilah dan
menyetorkan sampah, menemukan informasi Bank Sampah, serta memantau proses penimbangan dan transaksi
secara lebih mudah dan transparan. Sistem membantu petugas Bank Sampah mencatat nasabah, menerima setoran,
menginput hasil penimbangan, mengelola harga per kilogram, dan menyimpan riwayat transaksi. Website digunakan
sebagai media informasi dan edukasi serta dapat menyediakan dashboard pengelolaan sesuai kebutuhan.
Elemen                                                       Penjelasan
Informasi Bank Sampah sulit ditemukan, proses pencatatan
Masalah utama                                                dapat masih manual, dan nasabah tidak selalu mendapat
informasi transaksi yang terstruktur.
Aplikasi web native untuk nasabah dan petugas, serta website
Solusi
pendukung untuk informasi, edukasi, dan pengelolaan.
Mempermudah masyarakat mengubah sampah terpilah
Nilai utama
menjadi nilai ekonomi melalui proses digital yang tercatat.
MVP terlebih dahulu, diuji secara terbatas bersama calon
Model pengembangan
pengguna dan Bank Sampah mitra.
B2B2C: menghubungkan nasabah, Bank Sampah, dan mitra
Model bisnis awal                                            pengelolaan/daur ulang; pendapatan potensial dari layanan
digital, kemitraan, CSR, dan kerja sama industri.

## 2. Latar Belakang dan Permasalahan

Pengelolaan sampah melibatkan banyak pihak dan proses, mulai dari pemilahan rumah tangga, penyetoran,
penimbangan, pencatatan, hingga penyaluran sampah. Pada proses yang belum terdigitalisasi, informasi lokasi dan
jam operasional dapat sulit diakses, pencatatan transaksi berisiko tidak konsisten, dan nasabah kesulitan melihat
riwayat setoran atau nilai sampah yang sudah diterima.

### 2.1 Permasalahan yang ingin diselesaikan

- Nasabah membutuhkan informasi lokasi, jam operasional, dan layanan Bank Sampah.
- Proses pengajuan setoran dan penerimaan sampah perlu lebih terstruktur.
- Berat aktual dan harga sampah harus dicatat dengan jelas agar nilai transaksi dapat dipahami.
- Petugas membutuhkan pencatatan data nasabah, jenis sampah, penimbangan, dan transaksi yang rapi.
- Pengguna membutuhkan riwayat transaksi yang dapat ditinjau kembali.
- Informasi edukasi tentang pemilahan sampah perlu mudah diakses.

### 2.2 Pernyataan masalah

Bagaimana menyediakan platform digital yang membantu nasabah menemukan Bank Sampah dan melakukan
setoran secara terstruktur, serta membantu petugas mencatat hasil penimbangan dan transaksi dengan transparan?

## 3. Visi, Tujuan, dan Indikator Keberhasilan

### 3.1 Visi produk

Membangun ekosistem pengelolaan Bank Sampah yang lebih mudah diakses, transparan, dan terhubung melalui
teknologi digital.

### 3.2 Tujuan

- Memudahkan nasabah mencari Bank Sampah dan memahami cara menyetor sampah.
- Mengubah pencatatan setoran dan transaksi menjadi proses digital yang konsisten.
- Meningkatkan transparansi melalui informasi berat aktual, harga per kilogram, nilai transaksi, dan riwayat.
- Membantu petugas mengelola data nasabah dan transaksi.
- Mendukung edukasi pemilahan dan pengelolaan sampah.

### 3.3 Indikator keberhasilan awal

Indikator                                                   Target awal untuk pilot (dapat disesuaikan)
Minimal 90% peserta uji coba dapat menyelesaikan simulasi
Keberhasilan alur utama
setoran tanpa bantuan.
100% hasil perhitungan nilai pada skenario uji sesuai berat
Akurasi perhitungan
aktual × harga/kg.
Setiap transaksi selesai memiliki jenis sampah, berat aktual,
Kelengkapan transaksi
harga/kg, nilai, waktu, petugas, dan status.
Pengguna uji coba dapat menemukan alamat dan jam
Kegunaan informasi
operasional Bank Sampah yang dipilih.
Tidak ada bug kritis yang menghambat pengajuan,
Stabilitas pilot
penimbangan, atau penyimpanan transaksi saat uji coba.

Angka di atas adalah target awal untuk evaluasi proyek, bukan klaim performa sistem yang sudah berjalan.

## 4. Ruang Lingkup Produk

### 4.1 Dalam ruang lingkup MVP

- Aplikasi Website Native PWA Next.js untuk nasabah, dan petugas.
- Autentikasi nasabah: login, registrasi, dan lupa kata sandi.
- Autentikasi petugas melalui akun yang dibuat/diaktifkan admin; tidak ada registrasi petugas secara publik.
- Informasi dan pencarian Bank Sampah: nama, alamat, jam operasional, status layanan, dan informasi jarak bila
data lokasi tersedia.
- Pengajuan setoran dengan pilihan Bank Sampah dan jenis sampah.
- Status pengajuan sampai proses penimbangan dan transaksi selesai.
- Input berat aktual oleh petugas dan perhitungan nilai transaksi berdasarkan harga aktif.
- Riwayat setoran/transaksi dan informasi saldo/nilai akumulatif.
- Pengelolaan data dasar oleh petugas/admin sesuai hak akses.
- Website Next.js untuk informasi, edukasi, artikel, publikasi, dan halaman pendukung.
- Database terpusat menggunakan PostgreSQL.
- Fitur identifikasi jenis sampah berbasis scan dapat menjadi bantuan opsional; pengguna tetap dapat memilih
manual dan petugas dapat mengoreksi.

### 4.2 Di luar ruang lingkup MVP

- Layanan penjemputan sampah, kurir, ojek, atau perantara. Model operasional MVP adalah nasabah mengantar
sendiri ke Bank Sampah.
- Penarikan saldo ke rekening atau e-wallet.
- Pembayaran digital langsung ke rekening bank/e-wallet.
- Penetapan harga otomatis berdasarkan pasar tanpa verifikasi admin.
- Integrasi penuh dengan industri daur ulang atau sistem pemerintah.
- Identifikasi sampah berbasis AI sebagai penentu final jenis, berat, atau harga.
- Program reward/point kompleks, marketplace material daur ulang, dan fitur sosial berskala luas.

## 5. Pengguna dan Hak Akses

Pengguna                              Kebutuhan                                   Hak akses utama
Mengelola profil sendiri; membuat
Mencari Bank Sampah, mengajukan
Nasabah                                                                           pengajuan; melihat transaksi dan saldo
setoran, melihat status dan riwayat.
milik sendiri.
Melihat pengajuan yang ditujukan ke
Menerima sampah, menimbang, dan             unitnya; memperbarui status;
Petugas Bank Sampah
mencatat transaksi.                         memasukkan berat aktual;
menyelesaikan transaksi.

Mengelola akun/role, unit Bank Sampah,
Mengelola data master dan mengawasi
Admin                                                                                  jenis dan harga sampah, serta melihat
operasional.
laporan sesuai kewenangan.
Melihat halaman publik, artikel, informasi
Pengunjung website                          Mendapatkan informasi dan edukasi.         program dan Bank Sampah yang
dipublikasikan.

Catatan: kewenangan final perlu disepakati. Akun petugas dan admin tidak boleh memperoleh akses hanya dengan
mendaftar sebagai nasabah.

## 6. Alur Bisnis Utama

### 6.1 Alur setoran mandiri

## 21. Nasabah login ke aplikasi.

## 22. Nasabah memilah sampah dan membuka menu Setor.

## 23. Nasabah memilih Bank Sampah Unit berdasarkan informasi lokasi, jam operasional, dan layanan.

## 24. Nasabah memilih jenis sampah dan memasukkan perkiraan jumlah/berat jika diperlukan.

## 25. Sistem menampilkan ringkasan estimasi; nilai ini bukan nilai final.

## 26. Nasabah mengonfirmasi pengajuan setoran dan membawa sampah sendiri ke Bank Sampah yang dipilih.

## 27. Petugas menerima sampah dan memeriksa jenis serta kondisi sampah.

## 28. Petugas menimbang sampah dan memasukkan berat aktual serta harga/kg yang berlaku.

## 29. Sistem menghitung nilai final: berat aktual × harga/kg, lalu menampilkan ringkasan untuk diperiksa.

## 30. Petugas mengonfirmasi transaksi selesai.

## 31. Sistem menyimpan transaksi, memperbarui riwayat dan saldo/nilai akumulatif nasabah, serta menampilkan bukti

transaksi.

### 6.2 Status setoran

Status                                                           Makna
Pengajuan sudah dibuat dan menunggu nasabah datang atau
Menunggu
ditangani petugas.
Diproses                                                         Sampah telah diterima dan sedang diperiksa/ditimbang.
Selesai                                                          Berat dan nilai final telah dikonfirmasi, transaksi tersimpan.
Pengajuan dibatalkan dengan alasan yang tercatat; status ini
Dibatalkan
perlu disepakati untuk implementasi.

Status yang terlihat kepada nasabah perlu menggunakan bahasa yang konsisten. Untuk MVP, status minimal yang
disarankan adalah Menunggu, Diproses, dan Selesai.

## 7. Kebutuhan Fungsional

ID          Fitur                 Kebutuhan                                                                              Prioritas
FR-01       Autentikasi nasabah   Nasabah dapat mendaftar, login, logout, dan meminta reset kata sandi.                  High
Autentikasi           Petugas dan admin login menggunakan akun yang diatur oleh admin; role diperiksa
FR-02                                                                                                                    High
petugas/admin         sebelum akses diberikan.
FR-03       Profil nasabah        Nasabah dapat melihat dan memperbarui data profil yang diizinkan.                      Medium
Daftar Bank           Sistem menampilkan daftar unit beserta nama, alamat, jam operasional, status, dan
FR-04                                                                                                                    High
Sampah                detail kontak bila tersedia.
FR-05       Pencarian/filter      Nasabah dapat mencari unit dan memfilter informasi dasar yang tersedia.                Medium
Informasi jenis dan   Sistem menampilkan kategori sampah dan harga/kg aktif per unit atau kebijakan
FR-06                                                                                                                    High
harga sampah          yang ditentukan.
Nasabah memilih unit, jenis sampah, dan data estimasi, kemudian mengirim
FR-07       Pengajuan setoran                                                                                            High
pengajuan.
Sistem menampilkan berat/nilai estimasi dan menjelaskan bahwa nilai final
FR-08       Ringkasan estimasi                                                                                           High
ditentukan dari penimbangan petugas.
Daftar pengajuan
FR-09                             Petugas dapat melihat pengajuan yang ditujukan ke unitnya.                             High
petugas

FR-10     Pembaruan status       Petugas dapat memperbarui status pengajuan sesuai tahap proses.                       High
FR-11     Penimbangan aktual     Petugas dapat memasukkan berat aktual untuk setiap jenis sampah yang diterima.        High
Perhitungan            Sistem menghitung nilai per jenis sampah dan total berdasarkan berat aktual ×
FR-12                                                                                                                  High
transaksi              harga/kg yang berlaku.
FR-13     Konfirmasi transaksi   Petugas mengonfirmasi hasil akhir sebelum transaksi ditandai selesai.                 High
FR-14     Riwayat transaksi      Nasabah dapat melihat daftar dan detail transaksi miliknya.                           High
Saldo/nilai            Sistem menampilkan nilai transaksi yang tercatat sebagai saldo/nilai akumulatif
FR-15                                                                                                                  High
akumulatif             sesuai kebijakan Bank Sampah.
Pengelolaan data
FR-16                            Admin mengelola unit, kategori sampah, harga aktif, akun, dan status publikasi.       High
master
Dashboard              Petugas/admin dapat melihat ringkasan pengajuan dan transaksi sesuai
FR-17                                                                                                                  Medium
petugas/admin          kewenangannya.
Konten edukasi
FR-18                            Pengunjung dapat membaca informasi pemilahan, artikel, berita, dan program.           Medium
website
Identifikasi sampah    Jika dikembangkan, scan hanya memberi saran kategori dan selalu menyediakan
FR-19                                                                                                                  Low
opsional               pilihan manual/koreksi petugas.
Sistem memberi informasi perubahan status di dalam aplikasi; push notification
FR-20     Notifikasi status                                                                                            Low
dapat menjadi pengembangan lanjutan.
Setelah transaksi selesai, sistem menampilkan detail transaksi yang dapat ditinjau
FR-21     Bukti transaksi                                                                                              High
kembali.

## 8. Kebutuhan Non-Fungsional

ID                                         Kategori                                    Kebutuhan
Akses data dibatasi berdasarkan role
NFR-01                                     Keamanan                                    dan kepemilikan; nasabah hanya dapat
melihat data miliknya.
Data pribadi dikumpulkan seperlunya
NFR-02                                     Privasi                                     dan tidak ditampilkan ke pengguna yang
tidak berwenang.
Nilai transaksi dihitung sistem; berat
NFR-03                                     Integritas data                             aktual, harga/kg, petugas, dan waktu
transaksi tersimpan.
Perubahan harga dan transaksi penting
menyimpan informasi waktu dan
NFR-04                                     Auditability
pengguna yang melakukan perubahan
bila memungkinkan.
Antarmuka menggunakan bahasa
NFR-05                                     Usability                                   Indonesia yang jelas, alur singkat, dan
status yang mudah dipahami.
Website dapat digunakan pada layar
NFR-06                                     Responsiveness
desktop dan perangkat mobile.
Sistem menampilkan pesan kesalahan
yang jelas dan tidak menggandakan
NFR-07                                     Reliability
transaksi saat pengguna mengulangi
aksi.
Halaman utama dan daftar data umum
ditargetkan tampil dalam waktu yang
NFR-08                                     Performance
wajar pada jaringan normal; target angka
ditetapkan saat pengujian.
Kode, komponen UI, skema database,
NFR-09                                     Maintainability                             dan konfigurasi disusun agar mudah
dipelihara.
Strategi backup dan pemulihan data
NFR-10                                     Backup/recovery
ditentukan sebelum pilot operasional.
Teks mudah dibaca, kontras memadai,
NFR-11                                     Accessibility                               dan kontrol utama memiliki label yang
jelas.
Aplikasi diuji pada perangkat Android
NFR-12                                     Compatibility                               sasaran; dukungan iOS mengikuti
prioritas dan sumber daya tim.

## 9. Aturan Bisnis

## 32. Nasabah mengantar sampah sendiri ke Bank Sampah yang dipilih; sistem MVP tidak menyediakan layanan

penjemputan.

## 33. Berat yang dimasukkan nasabah adalah estimasi, bukan dasar nilai transaksi final.

## 34. Berat aktual ditentukan oleh petugas melalui penimbangan di Bank Sampah.

## 35. Nilai final setiap kategori = berat aktual (kg) × harga per kg yang berlaku untuk transaksi tersebut.

## 36. Total transaksi adalah penjumlahan nilai seluruh kategori sampah yang diterima.

## 37. Harga sampah dikelola oleh admin atau pihak berwenang dan dapat berbeda berdasarkan jenis/unit/periode

sesuai kebijakan.

## 38. Harga yang digunakan pada transaksi harus tersimpan sebagai snapshot agar perubahan harga berikutnya tidak

mengubah transaksi lama.

## 39. Transaksi hanya berstatus Selesai setelah berat aktual dan nilai final dikonfirmasi petugas.

## 40. Saldo/nilai akumulatif pada MVP merupakan catatan nilai setoran; bukan berarti dana dapat ditarik ke rekening

atau e-wallet.

## 41. Petugas hanya boleh memproses setoran untuk unit yang menjadi tanggung jawabnya.

## 42. Scan/identifikasi sampah bersifat bantuan; hasilnya tidak menggantikan pemeriksaan petugas.

## 43. Setiap pembatalan atau koreksi transaksi setelah konfirmasi perlu memiliki alasan dan jejak perubahan.

## 10. Data dan Struktur Database Awal

Struktur berikut merupakan rancangan awal untuk diskusi dengan developer dan perlu disesuaikan dengan kebijakan
data serta kemampuan Supabase.
Entitas                               Data utama                                   Catatan relasi
id, nama, email/telepon, role, status        Terhubung ke autentikasi; role
profiles/users
akun, created_at                             nasabah/petugas/admin.
id, nama, alamat, koordinat opsional,        Satu unit dapat memiliki banyak petugas
bank_sampah_units
jam operasional, status, kontak              dan setoran.
Menghubungkan petugas dengan unit
unit_staff                            id, user_id, unit_id, status
yang ditangani.
waste_categories                      id, nama kategori, deskripsi, status         Kategori sampah yang diterima sistem.
id, unit_id opsional, category_id,
Menyimpan histori harga; aturan prioritas
waste_prices                          price_per_kg, effective_from,
harga perlu ditentukan.
effective_to, status
id, customer_id, unit_id, status,
Satu pengajuan dapat memiliki beberapa
deposits                              submitted_at, processed_at,
detail kategori.
completed_at, notes
id, deposit_id, category_id,
Menyimpan estimasi, hasil timbang
deposit_items                         estimated_weight, actual_weight,
aktual, dan nilai final.
unit_price_snapshot, line_total
id, deposit_id, customer_id, unit_id,
Dibuat/ditetapkan ketika setoran
transactions                          total_weight, total_value, confirmed_by,
dikonfirmasi selesai.
confirmed_at
id, deposit_id/transaction_id, old_status,
transaction_events                                                                 Jejak perubahan status dan koreksi.
new_status, actor_id, note, created_at
id, title, slug, body, author_id,
content_articles                                                                   Konten edukasi website.
published_at, status
id, user_id, title, message, read_at,        Untuk notifikasi dalam aplikasi jika
notifications (opsional)
created_at                                   masuk MVP.

Catatan desain: transaksi harus menyimpan harga saat transaksi (snapshot), bukan hanya mengambil harga terbaru
dari tabel harga. Aturan akses baris (misalnya Row Level Security pada Supabase) perlu diterapkan dan diuji.

## 11. Integrasi dan Arsitektur Teknologi

Komponen                              Teknologi                                    Tanggung jawab
Website PWA Native                    Next.js                                      Antarmuka utama nasabah dan

antarmuka operasional petugas jika
diputuskan berada dalam satu aplikasi
berbasis role.
Informasi publik, edukasi, artikel, dan
Website                              Next.js                                   dashboard admin/operasional sesuai
kebutuhan.
Autentikasi, penyimpanan data, API, dan
Backend & database                   PostgreSQL
kontrol akses.
User flow, wireframe, design system,
Design                               Figma atau alat desain setara
dan prototype UI/UX.
Product backlog, sprint backlog,
Project tracking                     Jira Scrum
assignee, status, dan review pekerjaan.

Keputusan yang perlu dikonfirmasi: apakah petugas memakai aplikasi web native yang sama dengan role petugas
atau dashboard web. Rekomendasi MVP: pilih opsi yang paling ringan untuk dikembangkan dan paling mudah
digunakan saat uji coba.

## 12. Model Bisnis

### 12.1 Model utama

Model yang direncanakan adalah B2B2C: platform menghubungkan nasabah sebagai pengguna akhir dengan Bank
Sampah sebagai mitra operasional, serta membuka peluang kerja sama dengan perusahaan, program CSR, dan
industri daur ulang. Pada tahap awal, prioritasnya adalah validasi kebutuhan dan penggunaan, bukan
memaksimalkan biaya transaksi.

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
Pendapatan di atas merupakan opsi bisnis, belum menjadi komitmen fitur atau pendapatan aktual. Model harga perlu
diuji dengan Bank Sampah mitra dan calon sponsor.

## 13. UI/UX dan Prinsip Desain

- Gunakan bahasa Indonesia yang sederhana dan konsisten.
- Prioritaskan tugas utama: cari Bank Sampah, ajukan setoran, lihat status, dan periksa riwayat.
- Bedakan dengan jelas estimasi dari hasil timbang aktual dan nilai final.
- Tampilkan jam operasional, alamat, status layanan, dan petunjuk setoran sebelum pengguna mengonfirmasi.
- Gunakan desain visual yang bersih dengan warna hijau sebagai asosiasi lingkungan, biru sebagai
kepercayaan/teknologi, dan putih sebagai latar; warna final diputuskan designer.
- Berikan empty state, loading state, error state, dan konfirmasi untuk aksi penting.
- Jangan menyamarkan saldo catatan setoran sebagai uang yang dapat dicairkan jika fitur penarikan belum
tersedia.
- Pastikan tampilan responsif dan komponen dapat digunakan kembali.

### 13.1 Daftar halaman utama

Platform                                                           Halaman
Login, Register, Lupa Password, Home, Daftar Bank Sampah,
Detail Bank Sampah, Pilih Jenis Sampah, Konfirmasi Setoran,
Native PWA — Nasabah
Status Setoran, Ringkasan Transaksi, Riwayat, Detail
Riwayat, Saldo/Nilai Akumulatif, Profil.
Login, Dashboard, Daftar Pengajuan, Detail Pengajuan, Input
Native PWA — Petugas (jika satu aplikasi)
Penimbangan, Konfirmasi Transaksi, Riwayat Unit.
Beranda, Tentang, Cara Kerja, Informasi Bank Sampah,
Website publik
Edukasi/Artikel, Berita/Kegiatan, Kontak.
Login, Dashboard, Manajemen Unit, Pengguna/Petugas,
Website admin                                                      Kategori Sampah, Harga Sampah, Pengajuan/Transaksi,
Konten, Laporan.

## 14. Prioritas Product Backlog

Prioritas                                   Fitur                                         Alasan
Autentikasi dan role; data unit;
kategori/harga; pengajuan setoran;
Mendukung alur setoran dari awal
P0 — Wajib MVP                              status; input berat aktual; hitung
hingga transaksi selesai.
transaksi; riwayat; saldo/nilai akumulatif;
kontrol akses.
Pencarian/filter unit; dashboard
Meningkatkan kemudahan penggunaan
P1 — Penting                                petugas/admin; artikel edukasi; laporan
dan operasional.
ringkas; bukti transaksi.
Scan identifikasi sampah; notifikasi
Membutuhkan validasi tambahan atau
P2 — Lanjutan                               push; analitik lanjutan; integrasi mitra;
kompleksitas teknis.
reward.

Prioritas dapat berubah setelah wawancara dan validasi bersama calon pengguna. Fitur yang terlihat menarik tidak
otomatis lebih prioritas daripada kebutuhan inti transaksi.

## 15. Rencana Implementasi Scrum

Scrum dijalankan dalam Sprint berdurasi yang disepakati tim (misalnya 1–2 minggu). Setiap Sprint memiliki Sprint
Goal, backlog terpilih, hasil yang dapat direview, dan retrospective.
Sprint                                      Fokus                                         Output yang diharapkan
Requirement, user story, BPMN/use
case, ERD awal, user flow,
Sprint 1                                    Analisis kebutuhan dan desain awal
wireframe/prototype awal, setup
repository dan environment.
Skema database awal, login/role, profil,
Sprint 2                                    Fondasi sistem dan autentikasi
data unit, kategori dan harga dasar.
Daftar/detail unit, pengajuan setoran,
Sprint 3                                    Alur pengajuan setoran                        ringkasan estimasi, status pengajuan,
daftar pengajuan petugas.
Input berat aktual, snapshot harga,
Sprint 4                                    Penimbangan dan transaksi                     kalkulasi nilai, konfirmasi transaksi,
saldo/nilai akumulatif dan riwayat.
Website informasi/edukasi, integrasi alur
Sprint 5                                    Integrasi, website, dan testing               utama, pengujian end-to-end, perbaikan
bug dan persiapan pilot.

### 15.1 Peran tim

Peran proyek                                                       Tanggung jawab utama
Menjaga tujuan, koordinasi, timeline, board Jira, hambatan,
Project Manager / Scrum coordination                               review, dan komunikasi tim. Dalam Scrum formal, fungsi
Product Owner dan Scrum Master perlu ditetapkan; PM dapat

membantu koordinasi, tetapi keputusan prioritas produk harus
jelas pemiliknya.
Menggali kebutuhan pengguna, memetakan proses bisnis,
System Analyst 1
BPMN, aturan bisnis, dan validasi kebutuhan.
Menyusun user story, acceptance criteria, use case,
System Analyst 2
rancangan data/ERD, serta membantu pengujian.
Membuat user flow, wireframe, design system, prototype, dan
UI/UX Designer
mengevaluasi kemudahan penggunaan.
Menyiapkan repository/environment, mengimplementasikan
Software Developer                                              aplikasi, website, database/integrasi, kontrol akses, dan
memperbaiki bug.
Sprint Planning, Daily Scrum singkat, Sprint Review,
Seluruh tim                                                     Retrospective, dan memastikan hasil sesuai Definition of
Done.

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

ID                                        Skenario                                   Hasil yang diharapkan
Akun valid dapat masuk; data tidak valid
TC-01                                     Nasabah membuat akun dan login.
mendapat pesan yang jelas.
Nasabah mencari dan membuka detail
TC-02                                                                                Informasi unit yang benar tampil.
unit.
Pengajuan tersimpan dengan status
TC-03                                     Nasabah mengirim pengajuan setoran.        awal dan muncul pada akun petugas unit
terkait.
Petugas memasukkan berat aktual dan        Sistem menghitung nilai per kategori dan
TC-04
harga.                                     total dengan benar.
Harga berubah setelah transaksi lama       Nilai transaksi lama tetap sesuai
TC-05
selesai.                                   snapshot harga ketika transaksi terjadi.
Status menjadi Selesai, riwayat dan nilai
TC-06                                     Petugas menyelesaikan transaksi.
akumulatif diperbarui satu kali.
Nasabah mencoba membuka transaksi
TC-07                                                                                Akses ditolak.
milik orang lain.
Petugas mencoba mengakses unit lain
TC-08                                                                                Akses ditolak.
tanpa kewenangan.
Sistem memberi feedback dan
Jaringan terputus saat pengiriman
TC-09                                                                                mencegah transaksi ganda saat dicoba
transaksi.
kembali.
Sistem meminta pengguna melengkapi
TC-10                                     Data wajib belum diisi.
data sebelum melanjutkan.

### 16.2 Kriteria penerimaan MVP

- Alur pengajuan → penimbangan → transaksi selesai dapat dijalankan end-to-end.
- Perhitungan nilai benar dan dapat ditelusuri berdasarkan berat aktual serta harga yang tersimpan.
- Nasabah hanya dapat mengakses data sendiri.
- Petugas hanya dapat memproses transaksi unit yang diizinkan.

- Riwayat transaksi menampilkan informasi penting dan konsisten.
- Informasi Bank Sampah yang dipublikasikan telah diverifikasi oleh pihak terkait.
- Uji coba pengguna menghasilkan daftar temuan, prioritas perbaikan, dan keputusan kesiapan pilot.

## 17. Risiko dan Mitigasi

Risiko                                Dampak                                       Mitigasi
Harga dikelola oleh role berwenang,
Harga sampah berubah                  Nilai transaksi keliru atau diperdebatkan.   gunakan tanggal berlaku dan snapshot
harga transaksi.
Konfirmasi sebelum selesai, validasi
Kesalahan input berat                 Nilai transaksi tidak akurat.                angka, catat petugas, dan sediakan
proses koreksi beralasan.
Gunakan ID unik, validasi status, dan
Data ganda atau transaksi ganda       Saldo/riwayat tidak konsisten.               mekanisme idempotensi pada
penyelesaian transaksi.
Role-based access, kebijakan RLS,
Akses tidak sah                       Kebocoran data nasabah/transaksi.            validasi server-side, dan pengujian
akses.
Verifikasi informasi bersama unit dan
Informasi jam/lokasi tidak akurat     Nasabah datang ketika unit tutup.
sediakan mekanisme pembaruan.
Tampilkan status pengiriman, pesan
Internet tidak stabil                 Proses input atau transaksi terganggu.       error yang jelas, dan mekanisme retry
yang aman.
Pengguna kurang terbiasa dengan                                                    Desain sederhana, edukasi singkat, dan
Adopsi rendah.
aplikasi                                                                           uji usability dengan pengguna sasaran.
Prioritaskan P0, batasi WIP, pecah task,
Sprint terlambat dan fitur inti tidak
Scope terlalu luas                                                                 dan pindahkan fitur tambahan ke
selesai.
backlog.
Lakukan wawancara dan dapatkan
Mitra belum tersedia                  Pilot operasional tertunda.                  persetujuan unit sebelum menentukan
jadwal pilot.

## 18. Asumsi, Batasan, dan Ketergantungan

### 18.1 Asumsi

- Akan ada setidaknya satu Bank Sampah yang bersedia menjadi mitra uji coba.
- Bank Sampah dapat menyediakan informasi unit, kategori yang diterima, jam operasional, dan harga yang
berlaku.
- Nasabah membawa sampah sendiri ke unit yang dipilih.
- Petugas melakukan penimbangan aktual dan bertanggung jawab atas konfirmasi transaksi.
- Tim memiliki akses ke perangkat pengembangan dan layanan Supabase.

### 18.2 Batasan

- Produk merupakan proyek pengembangan bertahap; kelayakan operasional harus divalidasi sebelum
penggunaan luas.
- Nilai saldo pada MVP adalah catatan nilai transaksi, bukan layanan keuangan atau rekening penyimpanan uang.
- Fitur scan sampah, notifikasi push, integrasi mitra, dan ekspansi skala besar dapat ditunda.
- Data harga dan lokasi contoh untuk prototype harus ditandai sebagai data simulasi jika belum diverifikasi.

### 18.3 Ketergantungan

- Validasi proses dengan pengelola Bank Sampah.
- Keputusan apakah petugas menggunakan native web atau dashboard web.
- Keputusan pemilik produk yang menyetujui prioritas backlog.
- Pengaturan keamanan database dan autentikasi.

- Ketersediaan data kategori, harga, lokasi, dan jam operasional yang benar.

## 19. Rencana Pengembangan Berikutnya

- Pilot dengan satu atau beberapa Bank Sampah Unit dan mengukur keberhasilan alur setoran.
- Menyempurnakan dashboard dan laporan berdasarkan kebutuhan petugas.
- Mengembangkan notifikasi yang sesuai dengan kebutuhan pengguna.
- Mengevaluasi kelayakan scan/identifikasi sampah sebagai fitur bantuan.
- Membangun kerja sama dengan perusahaan/CSR dan industri daur ulang setelah proses inti stabil.
- Menguji model pendapatan, termasuk langganan layanan digital atau kemitraan, sebelum menetapkan skema
harga.

## 20. Glosarium dan Referensi Awal

Istilah                                                     Definisi
Product Requirements Document, dokumen yang menjelaskan
PRD                                                         tujuan, ruang lingkup, pengguna, kebutuhan, dan kriteria
penerimaan produk.
Minimum Viable Product, versi awal dengan fitur minimum
MVP
untuk menguji kebutuhan utama.
Kerangka kerja Agile yang membagi pengembangan ke dalam
Scrum
Sprint dan melakukan inspeksi serta adaptasi secara berkala.
Product Backlog                                             Daftar kebutuhan dan pekerjaan produk yang diprioritaskan.
Kondisi yang harus dipenuhi agar suatu task/fitur dapat
Acceptance Criteria
diterima.
Business-to-Business-to-Consumer; layanan bekerja sama
B2B2C                                                       dengan organisasi bisnis/mitra untuk melayani pengguna
akhir.
Salinan harga yang berlaku saat transaksi sehingga transaksi
Snapshot harga
lama tidak berubah ketika harga master diperbarui.
BSU                                                         Bank Sampah Unit.

Referensi awal untuk konteks pengelolaan sampah
- Damanhuri, E., & Padmi, T. (2010). Pengelolaan Sampah Perkotaan di Indonesia. Program Studi Teknik
Lingkungan, Institut Teknologi Bandung.
- Kementerian Lingkungan Hidup dan Kehutanan. (2021). Peraturan Menteri Lingkungan Hidup dan Kehutanan
Nomor 14 Tahun 2021 tentang Pengelolaan Sampah pada Bank Sampah.
- Catatan proyek: referensi di atas memberi konteks pengelolaan sampah; kebutuhan produk dan alur operasional
dalam PRD ini tetap harus divalidasi langsung dengan pengguna serta calon mitra.
