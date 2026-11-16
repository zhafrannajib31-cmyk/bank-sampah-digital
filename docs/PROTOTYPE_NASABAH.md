# Prototype Halaman Nasabah — Bank Sampah Digital

Status: **Selesai (BSD-17)** · Versi 1.0 · 12 November 2026
Implementasi: `fe-bsd/src/app/nasabah/`, `fe-bsd/src/features/nasabah/`
Pratinjau lokal: `npm run dev` lalu buka `/nasabah`

> Prototype ini menggantikan prototype Figma (keputusan D-11/D-12). Tujuannya memvalidasi alur nasabah langsung di Next.js dengan design system BSD-16, memakai **data simulasi** dan penyimpanan `localStorage`.

---

## 1. Tujuan dan batasan

Tujuan:
- Membuktikan alur setoran dapat diklik dari awal sampai riwayat dan detail.
- Membuktikan estimasi dan nilai final dibedakan jelas pada UI.
- Menjadi acuan implementasi nyata saat API `be-bsd` tersedia (BSD-21+).

Batasan:
- **Bukan aplikasi produksi.** Tidak ada autentikasi, otorisasi, atau API.
- Data disimpan di perangkat pengguna (`localStorage`), bukan di server.
- Harga, unit, dan transaksi adalah **data simulasi** dan ditandai di setiap halaman.
- Belum ada integrasi pembayaran/pencairan; saldo hanya catatan nilai setoran.

---

## 2. Peta halaman

| Route | Halaman | State yang tersedia |
| --- | --- | --- |
| `/nasabah` | Beranda: ringkasan nilai setoran, pengajuan aktif, riwayat terbaru, cara setor | empty (tidak ada pengajuan aktif/riwayat) |
| `/nasabah/setor` | Pilih unit Bank Sampah | unit tutup (tombol nonaktif), data kosong tidak berlaku (data simulasi statis) |
| `/nasabah/setor/[unitId]` | Pilih jenis sampah + estimasi berat | loading (Suspense), error (unit tidak ditemukan, validasi input) |
| `/nasabah/setor/ringkasan` | Ringkasan estimasi sebelum kirim | loading, empty (draft hilang), error (gagal kirim + coba lagi) |
| `/nasabah/setoran/[id]` | Detail/status setoran | loading (Suspense), error (setoran tidak ditemukan), dibatalkan (alasan) |
| `/nasabah/riwayat` | Riwayat + filter status | empty (per filter) |
| `/nasabah/saldo` | Saldo/nilai akumulatif | empty (belum ada transaksi selesai) |
| `/nasabah/profil` | Profil ringkas + reset data prototype | validasi, sukses, error |

Navigasi mobile-first: header ringkas + bottom navigation 5 item (Beranda, Setor, Riwayat, Saldo, Profil). Item aktif memakai `usePathname` di dalam `<Suspense>` agar route tetap dapat diprerender.

---

## 3. Alur yang dapat diklik

```text
Beranda → Setor → Pilih unit → Pilih jenis + estimasi berat
        → Ringkasan estimasi → Konfirmasi pengajuan
        → Detail status (Menunggu) → Riwayat → Detail
```

1. **Pilih unit** — hanya unit berstatus buka yang bisa dipilih.
2. **Pilih jenis + berat** — minimal satu jenis, berat harus > 0. Angka dari nasabah selalu diberi label estimasi.
3. **Ringkasan** — menampilkan rincian estimasi (`berat estimasi × harga/kg`) dan total estimasi dengan badge **“Bukan nilai final”**.
4. **Konfirmasi** — tombol nonaktif saat proses, lalu pengajuan dibuat berstatus `menunggu` dan diarahkan ke detail.
5. **Detail & riwayat** — status ditampilkan lewat `StatusBadge`; pembatalan menampilkan alasan; transaksi selesai menampilkan nilai final, berat aktual, dan harga snapshot.

---

## 4. Estimasi vs nilai final

| Aspek | Estimasi (nasabah) | Nilai final (petugas/server) |
| --- | --- | --- |
| Sumber angka | Input berat nasabah | Berat aktual hasil timbangan petugas |
| Perhitungan | Simulasi `calculateEstimate` di `prototype-api.ts` | Server pada aplikasi nyata (aturan bisnis 1) |
| Label UI | “Estimasi”, “Bukan nilai final” | “Nilai final” |
| Warna | Cokelat netral (`brown-light`) | Hijau (`green-light`) |
| Kapan muncul | Saat memilih jenis dan di ringkasan | Hanya saat status `selesai` |

Aturan yang dipegang prototype:
- FE tidak pernah dianggap sumber kebenaran nilai transaksi.
- Harga disimpan sebagai `unitPriceSnapshot` pada item transaksi selesai; perubahan harga tidak mengubah transaksi lama.
- Berat nasabah tidak pernah diberi label “berat aktual”.

---

## 5. Data simulasi

| Berkas | Isi |
| --- | --- |
| `src/features/nasabah/mock-data.ts` | 3 unit (2 buka, 1 tutup), 4 kategori + harga/kg, profil nasabah, 5 setoran contoh (menunggu, diproses, 2 selesai, dibatalkan) |
| `src/features/nasabah/types.ts` | Tipe `BankUnit`, `WasteCategory`, `Deposit`, `DepositItem`, `DepositEvent`, `DepositDraft`, `NasabahProfile` |
| `src/features/nasabah/prototype-api.ts` | Simulasi layer server: `calculateEstimate`, `buildDeposit` (membuat kode & event awal) |
| `src/features/nasabah/prototype-store.tsx` | Store `useSyncExternalStore` + persistensi `localStorage` |
| `src/features/nasabah/draft.ts` | Draft pengajuan antar halaman (`sessionStorage`) |
| `src/features/nasabah/format.ts` | Format rupiah, berat, jarak, tanggal (`id-ID`, zona `Asia/Jakarta`) |

Status memakai nilai lowercase sesuai ERD/API: `menunggu`, `diproses`, `selesai`, `dibatalkan`.

---

## 6. Kunci penyimpanan

| Kunci | Media | Isi | Kapan dihapus |
| --- | --- | --- | --- |
| `bsd.nasabah.prototype.v1` | `localStorage` | `{ deposits, profile }` | Tombol **Reset data prototype** di halaman profil |
| `bsd.nasabah.draft.v1` | `sessionStorage` | `{ unitId, items }` draft pengajuan | Setelah pengajuan berhasil dikirim, atau reset prototype |

Catatan teknis:
- Store memakai `useSyncExternalStore` dengan snapshot server berupa data seed, sehingga tidak ada hydration mismatch.
- Jika `localStorage` rusak/tidak dapat diakses, store kembali ke data seed dan menampilkan peringatan di console.
- Tidak ada data pribadi nyata di dalam prototype.

---

## 7. Struktur berkas

```text
fe-bsd/src/
├─ app/nasabah/
│  ├─ layout.tsx                  # PrototypeProvider + NasabahShell
│  ├─ page.tsx                    # Beranda
│  ├─ setor/page.tsx              # Pilih unit
│  ├─ setor/[unitId]/page.tsx     # Server page + Suspense
│  ├─ setor/ringkasan/page.tsx    # Ringkasan estimasi
│  ├─ setoran/[id]/page.tsx       # Server page + Suspense
│  ├─ riwayat/page.tsx
│  ├─ saldo/page.tsx
│  └─ profil/page.tsx
└─ features/nasabah/
   ├─ nasabah-shell.tsx           # Layout + header + Suspense nav
   ├─ nasabah-nav.tsx             # Bottom navigation (client)
   ├─ pilih-kategori-form.tsx     # Form jenis + berat (client)
   ├─ detail-setoran.tsx          # Detail status (client)
   ├─ deposit-card.tsx
   ├─ prototype-notice.tsx
   ├─ icons.tsx
   ├─ types.ts / mock-data.ts / prototype-api.ts / prototype-store.tsx / draft.ts / format.ts
```

---

## 8. Cara mencoba

```bash
cd fe-bsd
npm run dev
# buka http://localhost:3000/nasabah
```

Skenario uji manual:
1. Beranda → **Mulai setor sampah** → pilih unit Sukamaju.
2. Centang dua kategori, isi berat (mis. `2,5` dan `1`), lanjut ke ringkasan.
3. Periksa badge “Bukan nilai final”, lalu **Konfirmasi pengajuan**.
4. Halaman detail menampilkan status **Menunggu** dan total estimasi.
5. Buka **Riwayat** → filter status → buka transaksi **Selesai** untuk melihat nilai final dan snapshot harga.
6. Buka **Profil** → ubah nama → simpan; muat ulang halaman untuk memastikan data bertahan.
7. **Reset data prototype** untuk kembali ke kondisi awal.

Verifikasi teknis yang sudah dijalankan: `npm run lint`, `npx tsc --noEmit`, `npm run build` (22 route, dua route dinamis berstatus partial prerender).

---

## 9. Yang belum dicakup (lanjutan)

- Autentikasi, sesi, dan proteksi route per role (E4).
- Data dari API nyata, idempotency key, dan penanganan jaringan putus.
- Pemeriksaan/penolakan sampah dan penimbangan oleh petugas (BSD-18).
- Pembatalan/koreksi oleh nasabah dengan alasan (aturan D-05; alur UI menyusul).
- Notifikasi dan bukti transaksi unduhan.
- Usability test formal (BSD-20).

---

## 10. Traceability

| Kebutuhan | Implementasi prototype |
| --- | --- |
| US-03/US-04 — daftar unit, jenis, dan harga | `/nasabah/setor`, `/nasabah/setor/[unitId]` |
| US-05/US-06 — pengajuan dan ringkasan estimasi | Form jenis + berat, `/nasabah/setor/ringkasan` |
| US-08 — pembaruan status | `/nasabah/setoran/[id]`, riwayat status |
| US-12 — riwayat transaksi | `/nasabah/riwayat`, `/nasabah/setoran/[id]` |
| US-13 — saldo/nilai akumulatif | `/nasabah/saldo` (label “bukan dana yang bisa ditarik”) |
| FR-12/FR-13 — estimasi vs final | §4 dan komponen `EstimateCard`/`FinalValueCard` |
| FR-22 — penolakan dengan alasan | Kartu pembatalan pada detail setoran |
| NFR aksesibilitas & mobile-first | Bottom nav berlabel, `aria-current`, target sentuh ≥ 44 px |

Rujukan: `docs/USER_FLOW.md`, `docs/USER_STORIES_P0.md`, `docs/DESIGN_SYSTEM.md`, `docs/ERD_KAMUS_DATA.md`.
