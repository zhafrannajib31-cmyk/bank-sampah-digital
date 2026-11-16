# Target Performa FE (BSD-82, NFR-08)

Ditetapkan 16 Nov 2026. Profil uji: Lighthouse mobile (Moto G Power, 4G lambat simulasi), build produksi (`npm run build && npm start`).

## Target

| Metrik | Target |
| --- | --- |
| Skor Performance (Lighthouse mobile) | >= 90 pada halaman utama tiap role |
| LCP | <= 2,5 s |
| TBT | <= 200 ms |
| CLS | <= 0,1 |
| JS awal per halaman (terkompresi) | <= 200 KB |
| Font | <= 120 KB total |

Halaman utama: `/login`, `/nasabah`, `/nasabah/riwayat`, `/petugas`, `/petugas/antrean`.

## Hasil ukur awal (build produksi lokal, Performance API, mobile 375 px)

| Halaman | TTFB | DOMContentLoaded | JS | CSS | Font | CLS | Request |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /login | 27 ms | 171 ms | 176 KB | 12 KB | 105 KB | 0 | 17 |
| /onboarding | 58 ms | 129 ms | 144 KB | 12 KB | 105 KB | 0 | 16 |
| /nasabah | 98 ms | 170 ms | 152 KB | 12 KB | 105 KB | 0 | 16 |
| /nasabah/riwayat | 82 ms | 126 ms | 150 KB | 12 KB | 105 KB | 0 | 16 |

Seluruh anggaran JS dan font terpenuhi. **Belum terukur:** skor Lighthouse, LCP, dan TBT
(Lighthouse belum terpasang; panel browser tidak melaporkan paint). Ukur ulang dengan:

```bash
npx lighthouse http://localhost:3000/nasabah --preset=perf --form-factor=mobile
```

## Perubahan

- `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` untuk gambar statis di
  `public/` (nasabah, petugas, auth, onboarding, icons). Sebelumnya `max-age=0`, sehingga tiap kunjungan
  ulang memvalidasi puluhan SVG. Halaman, `sw.js`, dan manifest tidak di-cache lama.
