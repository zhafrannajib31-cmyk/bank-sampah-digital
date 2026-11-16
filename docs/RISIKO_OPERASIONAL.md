# Log Risiko Operasional — Bank Sampah Digital

Dokumen ini mencatat risiko operasional yang teridentifikasi selama validasi kebutuhan dan persiapan implementasi. Sumber utama risiko awal: `docs/Validasi_Mitra_Bank_Sampah_Digital_Terisi.md` (gabungan temuan survei masyarakat dan konteks proyek) serta `docs/BACKLOG..md`.

> Status: **risiko awal tercatat** — memenuhi kriteria BSD-09 ("risiko operasional dicatat").
> **Catatan penting:** Bank Sampah Unit (BSU) sebagai mitra belum tersedia; penerapannya direncanakan di **akhir MVP**. Karena itu, wawancara langsung dengan pengelola BSU belum dapat dilakukan dan sebagian risiko masih berbasis asumsi/survei.
> Data contoh/simulasi harus ditandai jelas dan tidak boleh diperlakukan sebagai fakta operasional mitra.

## Tabel risiko

| ID | Tanggal | Sumber | Risiko | Dampak | Mitigasi | PIC | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | 11 Nov 2026 | Catatan proyek (K-02), validasi mitra | Bank Sampah Unit (BSU) belum tersedia; penerapan direncanakan di akhir MVP | Validasi mitra dan data aktual (harga, jam operasional, kapasitas) tertunda | Desain memakai asumsi eksplisit + data simulasi bertanda; validasi aktual dilakukan pada fase pilot/akhir MVP | PM/SA | Terbuka (diterima sebagai asumsi) |
| R-02 | 12 Nov 2026 | Perencanaan | Perbedaan scope penjemputan (AGENTS/PRD v1.0 vs BACKLOG v2.0/E14) | Prioritas dan desain alur/data bisa berubah di tengah jalan | Konfirmasi keputusan PO (D-01) sebelum implementasi alur terkait | PM/PO | Terbuka |
| R-03 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Kapasitas petugas/unit dan kapasitas penjemputan terbatas | Antrean, jadwal penjemputan terlambat, atau permintaan tidak terpenuhi | Terapkan wilayah layanan dan slot jadwal berdasarkan kapasitas; desain status/antrean yang jelas | PM/SA | Terbuka |
| R-04 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Harga sampah berubah tetapi aplikasi belum diperbarui; data harga/lokasi awal belum terverifikasi | Estimasi nilai menyesatkan dan berbeda dari nilai akhir | Harga dikelola petugas/admin dengan tanggal pembaruan; nilai final setelah penimbangan; tandai data simulasi dan verifikasi saat pilot (BSD-93) | PM/SA | Terbuka |
| R-05 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Jaringan atau perangkat petugas bermasalah | Input/konfirmasi transaksi tertunda | Uji perangkat/jaringan; prosedur penanganan gangguan dan pencatatan sementara yang dapat direkonsiliasi (BSD-64) | BE/FE | Terbuka |
| R-06 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Berat/nilai transaksi berbeda dari estimasi atau kesalahan input petugas | Ketidakakuratan nilai transaksi dan ketidakpuasan pengguna | Tampilkan estimasi sebagai perkiraan; validasi input; rincian berat aktual, harga, dan nilai akhir sebelum konfirmasi; alasan & audit koreksi | BE/QA | Terbuka |
| R-07 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Jenis sampah pada aplikasi tidak sesuai dengan penerimaan unit | Pengajuan tidak dapat diproses atau sampah ditolak di unit | Daftar kategori mengikuti konfirmasi mitra; panduan jenis sampah; pemeriksaan petugas; alasan penolakan/koreksi | SA/PM | Terbuka |
| R-08 | 12 Nov 2026 | Perencanaan | Adopsi rendah pada nasabah/petugas | Sistem tidak terpakai optimal saat pilot | Desain sederhana, edukasi singkat, uji usability | PM/UI/UX | Terbuka |
| R-09 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Alamat atau jadwal penjemputan tidak akurat | Penjemputan gagal atau terlambat | Wajibkan alamat lengkap, titik lokasi, nomor kontak, dan konfirmasi jadwal | PM/SA | Terbuka |
| R-10 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | QR tidak valid atau sudah digunakan | Transaksi tidak dapat diselesaikan atau berisiko diproses ganda | Validasi QR, masa berlaku, dan status transaksi; saldo hanya bertambah satu kali setelah konfirmasi berhasil (idempotent) | BE/QA | Terbuka |
| R-11 | 12 Nov 2026 | Validasi mitra (survei masyarakat) | Data pengguna atau transaksi diakses pihak tidak berwenang | Risiko privasi dan penyalahgunaan data | Batasi hak akses berdasarkan peran di server; kumpulkan hanya data yang diperlukan | BE/QA | Terbuka |

## Panduan pengisian

- **ID**: `R-xx` berurutan.
- **Sumber**: dokumen/keputusan/wawancara (sebutkan referensi bila ada).
- **Dampak**: jelaskan dampak operasional/bisnis secara singkat.
- **Mitigasi**: tindakan pencegahan/pengurangan risiko yang konkret.
- **PIC**: penanggung jawab tindakan.
- **Status**: Terbuka / Dalam proses / Mitigasi terpasang / Ditutup.
