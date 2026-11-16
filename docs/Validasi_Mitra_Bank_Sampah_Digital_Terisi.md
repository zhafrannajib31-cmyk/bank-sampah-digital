# Validasi Mitra Bank Sampah --- Materi & Pencatatan

## Bank Sampah Digital

**Dokumen kerja:** BSD-09 --- Hubungi Calon Mitra Bank Sampah\
**Status:** Draf terisi berdasarkan konteks proyek dan hasil survei
masyarakat; validasi langsung dengan mitra masih perlu dilakukan.

> **Status task BSD-09:** ditutup melalui kriteria alternatif "risiko
> operasional dicatat" (lihat `docs/RISIKO_OPERASIONAL.md`, R-01 s.d.
> R-11). Bank Sampah Unit (BSU) belum tersedia dan direncanakan diterapkan
> di akhir MVP, sehingga wawancara langsung dengan mitra ditunda sampai
> fase pilot.

> **Catatan integritas data:** Dokumen ini menggabungkan temuan survei
> masyarakat yang telah dibahas dengan rancangan operasional Bank Sampah
> Digital. Informasi mengenai kebijakan, kapasitas, harga, jam
> operasional, dan kesediaan Bank Sampah Unit (BSU) belum dapat dianggap
> sebagai fakta sebelum dikonfirmasi melalui wawancara langsung. Tidak
> ada identitas atau jawaban narasumber yang dibuat-buat.

## 1. Tujuan dan Ruang Lingkup

### 1.1 Tujuan

Validasi mitra dilakukan untuk memastikan rancangan Bank Sampah Digital
sesuai dengan kondisi operasional bank sampah di lapangan. Validasi ini
berfokus pada: - Memahami proses penyetoran sampah yang sedang
berjalan. - Mengetahui jenis sampah yang diterima, mekanisme
penimbangan, penentuan harga, dan pencatatan transaksi. - Menilai
kemungkinan penerapan layanan penjemputan sampah. - Mengidentifikasi
kebutuhan informasi yang harus tersedia bagi nasabah. - Mengetahui
kesiapan calon mitra untuk mengikuti uji coba terbatas.

### 1.2 Ruang Lingkup

Ruang lingkup validasi mencakup: 1. **Setor mandiri:** pengajuan
setoran, kedatangan nasabah, pemeriksaan sampah, penimbangan, penentuan
nilai, dan pencatatan transaksi. 2. **Operasional unit:** jenis sampah,
harga, jam operasional, kapasitas, petugas, serta pencatatan. 3.
**Penjemputan:** wilayah layanan, jadwal, penugasan petugas, proses
serah-terima, dan penanganan pembatalan. 4. **Informasi nasabah:**
lokasi, jam operasional, jenis sampah yang diterima, harga, kontak, dan
status setoran.

## 2. Persiapan Sebelum Kontak

### 2.1 Gambaran Singkat Produk

Bank Sampah Digital merupakan aplikasi yang membantu masyarakat
mengajukan setoran sampah yang masih memiliki nilai ekonomi. Nasabah
dapat memilih jenis sampah, memasukkan estimasi berat, melihat estimasi
nilai, lalu memilih metode penyetoran: - **Antar sendiri:** nasabah
memilih lokasi Bank Sampah Unit dan mengantarkan sampah. - **Jemput
petugas:** nasabah mengisi alamat serta jadwal penjemputan, kemudian
menunggu konfirmasi petugas.

Setelah sampah diterima, petugas memeriksa jenis dan kondisi sampah,
melakukan penimbangan, serta menentukan nilai akhir berdasarkan berat
aktual dan harga yang berlaku. Nasabah menampilkan QR transaksi untuk
dipindai petugas sebagai konfirmasi. Saldo baru bertambah setelah
transaksi berhasil dikonfirmasi dan dicatat.

### 2.2 Hal yang Perlu Disiapkan

-   Menentukan nama dan lokasi calon Bank Sampah Unit.
-   Menghubungi pengelola atau petugas yang memahami operasional.
-   Menjelaskan bahwa kegiatan bertujuan untuk validasi kebutuhan dan
    proses, bukan penawaran kerja sama yang mengikat.
-   Menyiapkan daftar pertanyaan pada Bagian 4.
-   Mencatat tanggal, metode wawancara, serta peran narasumber.
-   Meminta izin sebelum mencatat nama, kontak, atau mengambil
    dokumentasi.

## 3. Profil Mitra

  -----------------------------------------------------------------------
  Item                                Keterangan
  ----------------------------------- -----------------------------------
  Nama Bank Sampah Unit               Belum ditentukan --- diisi setelah
                                      calon mitra dipilih

  Alamat / wilayah layanan            Belum dikonfirmasi

  Narasumber (nama & peran)           Belum diwawancarai

  Tanggal & metode validasi           Belum dilaksanakan

  Kontak (bila diizinkan)             Belum tersedia

  Status validasi                     **Belum --- persiapan materi
                                      selesai**
  -----------------------------------------------------------------------

## 4. Daftar Pertanyaan Validasi

Pertanyaan berikut merupakan panduan wawancara. Jawaban harus dicatat
berdasarkan keterangan langsung dari pengelola atau petugas mitra.

### A. Alur Setor Mandiri

1.  Bagaimana alur nasabah menyetor sampah saat ini, mulai dari datang
    hingga transaksi dicatat?
2.  Apakah nasabah perlu mendaftar terlebih dahulu? Data apa yang
    diperlukan?
3.  Bagaimana petugas memeriksa jenis dan kondisi sampah? Apa kriteria
    sampah yang ditolak?
4.  Bagaimana proses penimbangan dilakukan dan siapa yang mengonfirmasi
    hasilnya?
5.  Apakah terdapat biaya, potongan, batas minimal setoran, atau
    ketentuan khusus?

**Fokus validasi untuk aplikasi:** memastikan tahapan pengajuan,
pemeriksaan, penimbangan, penentuan nilai, dan konfirmasi transaksi
sesuai dengan proses nyata di unit.

### B. Data dan Harga

6.  Jenis sampah apa saja yang diterima dan jenis apa yang paling banyak
    disetorkan?
7.  Bagaimana harga per kilogram ditentukan dan seberapa sering
    mengalami perubahan?
8.  Apakah harga berbeda antarunit atau wilayah? Bagaimana informasi
    perubahan harga disampaikan kepada nasabah?
9.  Bagaimana transaksi dicatat saat ini: buku, spreadsheet, atau
    aplikasi?

**Fokus validasi untuk aplikasi:** memperoleh daftar kategori sampah dan
mekanisme pembaruan harga agar estimasi pada aplikasi tidak menyesatkan.
Nilai akhir tetap ditentukan setelah penimbangan aktual.

### C. Operasional Unit

10. Apa hari dan jam operasional unit?
11. Berapa perkiraan kapasitas penerimaan sampah dan jumlah petugas yang
    bertugas?
12. Bagaimana unit menangani antrean atau peningkatan jumlah nasabah?
13. Bagaimana pembatalan atau koreksi transaksi dilakukan jika terjadi
    kesalahan pencatatan?

**Fokus validasi untuk aplikasi:** memastikan informasi lokasi, jam
operasional, kapasitas layanan, serta prosedur koreksi dapat ditampilkan
dan dikelola dengan tepat.

### D. Penjemputan

14. Apakah saat ini unit menyediakan layanan penjemputan? Jika belum,
    apakah layanan tersebut memungkinkan untuk diterapkan?
15. Wilayah mana yang realistis untuk dijangkau oleh petugas?
16. Bagaimana jadwal penjemputan yang paling sesuai dengan kapasitas
    unit?
17. Siapa yang menentukan unit tujuan dan menugaskan petugas penjemput?
18. Bagaimana proses serah-terima sampah dari nasabah kepada petugas dan
    dari petugas ke unit?
19. Bagaimana penanganan pembatalan, alamat tidak ditemukan, nasabah
    tidak berada di lokasi, atau petugas terlambat?

**Fokus validasi untuk aplikasi:** menguji kebutuhan layanan penjemputan
yang muncul dari survei masyarakat. Layanan ini perlu mempertimbangkan
cakupan wilayah, ketersediaan petugas, kendaraan, kapasitas, dan biaya
operasional.

### E. Kebutuhan Informasi dan Teknologi

20. Informasi apa yang paling dibutuhkan nasabah sebelum menyetor:
    lokasi, jam buka, jenis sampah, harga, kontak, atau status layanan?
21. Kendala operasional apa yang paling sering terjadi dan berpotensi
    dibantu oleh sistem digital?
22. Apakah petugas memiliki perangkat dan jaringan internet yang
    memadai? Adakah ketentuan terkait keamanan dan privasi data?

**Fokus validasi untuk aplikasi:** menguji kebutuhan informasi lokasi
dan jam operasional, transparansi harga, pelacakan status setoran,
pencatatan digital, serta kemampuan petugas menggunakan aplikasi.

### F. Kesediaan dan Kesiapan Pilot

23. Apakah unit bersedia mempertimbangkan uji coba terbatas? Apa
    persyaratannya?
24. Apakah perangkat, jaringan, dan sumber daya petugas memungkinkan
    untuk mendukung uji coba?
25. Siapa yang dapat menjadi penanggung jawab komunikasi dan pembaruan
    informasi unit, seperti harga serta jam operasional?

**Fokus validasi untuk aplikasi:** mengetahui apakah calon mitra
memiliki kapasitas dan kesediaan untuk menguji alur setor mandiri
terlebih dahulu, kemudian layanan penjemputan jika dinilai memungkinkan.

## 5. Pencatatan Hasil Validasi

### 5.1 Temuan Awal dari Survei Masyarakat

Temuan berikut berasal dari survei masyarakat yang telah dibahas dalam
laporan proyek. Temuan ini merupakan sudut pandang calon pengguna, bukan
hasil wawancara dengan pengelola BSU.

  -----------------------------------------------------------------------
  Topik             Temuan awal dari  Kesesuaian dengan Tindak lanjut
                    survei masyarakat rencana MVP       kepada mitra
  ----------------- ----------------- ----------------- -----------------
  Alur setor        Masyarakat        Mendukung fitur   Konfirmasi
  mandiri           membutuhkan       pengajuan setoran tahapan
                    proses penyetoran dan informasi     pelayanan,
                    yang lebih mudah  prosedur.         persyaratan, dan
                    dan informasi                       kemungkinan
                    alur yang jelas.                    antrean.

  Data dan harga    Responden menilai Mendukung katalog Minta daftar
                    informasi harga   jenis sampah dan  jenis sampah,
                    per kilogram yang informasi         harga, satuan,
                    terbuka penting   estimasi nilai.   dan mekanisme
                    sebelum menyetor.                   pembaruan.

  Operasional unit  Informasi lokasi  Mendukung         Konfirmasi
                    dan jam           direktori lokasi  alamat, jam buka,
                    operasional       dan detail unit.  hari layanan,
                    menjadi kebutuhan                   kapasitas, dan
                    calon pengguna.                     kontak.

  Penjemputan       Jarak, waktu, dan Mendukung opsi    Konfirmasi
                    kecilnya volume   penjemputan       wilayah, jadwal,
                    setoran menjadi   sebagai layanan   armada, petugas,
                    hambatan untuk    yang perlu diuji. kapasitas, dan
                    mengantar sampah                    biaya.
                    sendiri.                            

  Informasi dan     Pengguna          Mendukung status  Uji kesiapan
  teknologi         membutuhkan       setoran, riwayat, perangkat,
                    informasi yang    saldo, dan QR     jaringan, dan
                    mudah diakses     konfirmasi.       prosedur petugas
                    serta pencatatan                    dalam menggunakan
                    saldo dan                           sistem.
                    transaksi secara                    
                    digital.                            

  Kesediaan pilot   Belum ada data    Belum dapat       Tanyakan
                    kesediaan dari    dinilai.          kesediaan,
                    pihak mitra.                        persyaratan, PIC,
                                                        dan waktu uji
                                                        coba.
  -----------------------------------------------------------------------

### 5.2 Status Informasi Mitra

  Informasi yang harus diperoleh            Status
  ----------------------------------------- --------------------
  Nama dan alamat unit                      Belum dikonfirmasi
  Jenis sampah yang diterima                Belum dikonfirmasi
  Daftar harga per kilogram                 Belum dikonfirmasi
  Jam dan hari operasional                  Belum dikonfirmasi
  Kapasitas penerimaan dan jumlah petugas   Belum dikonfirmasi
  Proses pemeriksaan dan penimbangan        Belum dikonfirmasi
  Sistem pencatatan transaksi               Belum dikonfirmasi
  Wilayah dan kapasitas penjemputan         Belum dikonfirmasi
  Kesiapan perangkat dan jaringan           Belum dikonfirmasi
  Kesediaan mengikuti pilot                 Belum dikonfirmasi

### 5.3 Kesimpulan Validasi Mitra Sementara

**Poin yang telah didukung oleh survei masyarakat:** - Calon pengguna
membutuhkan informasi lokasi, jam operasional, prosedur, dan harga
sampah yang lebih jelas. - Proses antar mandiri memiliki hambatan jarak,
waktu, tenaga, dan volume sampah. - Layanan penjemputan berpotensi
menjawab hambatan tersebut. - Pengguna membutuhkan status setoran dan
pencatatan transaksi yang transparan.

**Poin yang masih perlu divalidasi kepada mitra:** - Kesesuaian alur
aplikasi dengan prosedur operasional BSU. - Jenis sampah yang diterima
dan harga aktual. - Kapasitas petugas, jam operasional, serta wilayah
layanan. - Kelayakan penjemputan dari sisi armada, jadwal, dan biaya. -
Kesiapan perangkat, jaringan, serta kesediaan mitra mengikuti pilot.

**Risiko operasional awal dan mitigasi:**

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi awal
  ----------------------- ----------------------- -----------------------
  Harga sampah berubah    Estimasi nilai tidak    Harga dikelola
  tetapi aplikasi belum   sesuai dengan nilai     petugas/admin dan
  diperbarui              akhir                   diberi tanggal
                                                  pembaruan; nilai final
                                                  ditetapkan setelah
                                                  penimbangan.

  Jenis sampah pada       Pengajuan tidak dapat   Daftar kategori
  aplikasi tidak sesuai   diproses                mengikuti konfirmasi
  dengan penerimaan unit                          masing-masing mitra.

  Kapasitas penjemputan   Jadwal terlambat atau   Terapkan wilayah
  terbatas                permintaan tidak        layanan dan slot jadwal
                          terpenuhi               berdasarkan kapasitas
                                                  petugas.

  Alamat atau jadwal      Penjemputan gagal       Wajibkan alamat
  penjemputan tidak                               lengkap, titik lokasi,
  akurat                                          nomor kontak, dan
                                                  konfirmasi jadwal.

  Berat atau nilai        Muncul ketidakpuasan    Tampilkan estimasi
  transaksi berbeda dari  pengguna                sebagai perkiraan;
  estimasi                                        berikan rincian berat
                                                  aktual, harga, dan
                                                  nilai akhir sebelum
                                                  konfirmasi QR.

  Jaringan atau perangkat Konfirmasi transaksi    Siapkan prosedur
  petugas bermasalah      tertunda                penanganan gangguan dan
                                                  pencatatan sementara
                                                  yang dapat
                                                  direkonsiliasi.

  QR tidak valid atau     Transaksi tidak dapat   Validasi QR, masa
  sudah digunakan         diselesaikan atau       berlaku, dan status
                          berisiko diproses ganda transaksi; saldo hanya
                                                  bertambah satu kali
                                                  setelah konfirmasi
                                                  berhasil.

  Data pengguna atau      Risiko privasi dan      Batasi hak akses
  transaksi diakses pihak penyalahgunaan data     berdasarkan peran dan
  tidak berwenang                                 hanya kumpulkan data
                                                  yang diperlukan.
  -----------------------------------------------------------------------

**Rekomendasi langkah berikutnya:** 1. Pilih minimal satu Bank Sampah
Unit yang berpotensi menjadi mitra. 2. Lakukan wawancara menggunakan
pertanyaan pada Bagian 4. 3. Lengkapi profil mitra dan tabel status
informasi pada Bagian 3 dan 5. 4. Perbarui rancangan fitur berdasarkan
hasil wawancara, terutama daftar harga, jam operasional, dan wilayah
penjemputan. 5. Jika mitra bersedia, lakukan uji coba terbatas pada alur
setor mandiri sebelum memperluas layanan penjemputan.

## 6. Kriteria Selesai (BSD-09)

BSD-09 dapat dinyatakan selesai apabila: - Minimal satu calon mitra
telah memberikan informasi awal mengenai alur setor mandiri dan
kebutuhan penjemputan; atau - Risiko operasional utama telah dicatat
beserta mitigasi awalnya.

**Status saat dokumen ini disusun:** materi validasi dan risiko awal
telah disiapkan berdasarkan konteks proyek serta survei masyarakat.
Kriteria wawancara mitra belum terpenuhi karena belum tersedia hasil
kontak langsung yang dapat dicatat sebagai data aktual.

## 7. Log Pelaksanaan

  --------------------------------------------------------------------------
  Tanggal        Mitra          Metode         Hasil singkat  Status
  -------------- -------------- -------------- -------------- --------------
  Belum          Belum          Belum          Persiapan      Persiapan
  dilaksanakan   ditentukan     ditentukan     instrumen dan  selesai;
                                               pemetaan       menunggu
                                               temuan awal    wawancara
                                               dari survei    mitra
                                               masyarakat     
                                               telah          
                                               dilakukan.     

  --------------------------------------------------------------------------

------------------------------------------------------------------------

## Catatan Penggunaan Dokumen

Dokumen ini merupakan draf kerja untuk membantu pelaksanaan validasi
mitra. Bagian yang berstatus **belum dikonfirmasi** harus diperbarui
setelah wawancara dengan pengelola atau petugas Bank Sampah Unit. Temuan
survei masyarakat tidak boleh ditulis sebagai pernyataan atau
persetujuan dari pihak mitra.
