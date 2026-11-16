# Design System — Bank Sampah Digital

Status: **Selesai (BSD-16)** · Versi 1.0 · 12 November 2026
Sumber token: `fe-bsd/Design/design-tokens.json`
Implementasi: `fe-bsd/src/app/globals.css`, `fe-bsd/src/components/ui/`
Pratinjau: `/design-system`

> Keputusan BSD-16: design system diimplementasikan langsung di repository (token Tailwind + komponen React + dokumen ini), bukan di Figma. Halaman `/design-system` menjadi bukti visual dan sarana verifikasi komponen.

---

## 1. Prinsip

- **Mobile-first**, target sentuh minimal 44 px untuk kontrol utama.
- **Hijau = utama**, **biru = aksen**, **putih = latar**, **cokelat = netral/teks**.
- Warna dan tipografi berasal dari token; jangan menulis nilai hex/px baru di komponen.
- Estimasi dan nilai final **wajib dibedakan** secara visual dan label.
- Saldo adalah catatan nilai setoran, **bukan dana yang bisa ditarik**.
- Semua halaman wajib punya state **loading**, **empty**, dan **error**.
- Pesan untuk pengguna memakai bahasa Indonesia yang jelas.

---

## 2. Token warna

Token Figma yang mengandung spasi/kolon dipetakan ke nama aman Tailwind. Contoh `green / normal :hover` menjadi `green-normal-hover`.

### 2.1 Foundation

| Kelompok | Token Tailwind | Nilai | Pemakaian utama |
| --- | --- | --- | --- |
| Green | `green-light` / `green-light-hover` / `green-light-active` | `#e6fdee` / `#d9fce6` / `#b0f8cb` | Latar lembut, badge selesai |
| Green | `green-normal` / `green-normal-hover` / `green-normal-active` | `#00ea56` / `#00d34d` / `#00bb45` | Tombol utama, aksen merek |
| Green | `green-dark` / `green-dark-hover` / `green-dark-active` | `#00b041` / `#008c34` / `#006927` | Hover/active alternatif |
| Green | `green-darker` | `#00521e` | Teks di atas latar hijau muda, spinner |
| Brown | `brown-light` / `brown-light-hover` / `brown-light-active` | `#f0ede9` / `#e8e4de` / `#cfc7ba` | Latar netral, border, tombol sekunder |
| Brown | `brown-normal` / `brown-normal-hover` / `brown-normal-active` | `#654a21` / `#5b431e` / `#513b1a` | Teks muted, ikon |
| Brown | `brown-dark` / `brown-dark-hover` / `brown-dark-active` | `#4c3819` / `#3d2c14` / `#2d210f` | Teks kuat |
| Brown | `brown-darker` | `#231a0c` | Teks utama |
| Blue | `blue-light` / `blue-light-hover` / `blue-light-active` | `#e7f6fd` / `#dbf2fc` / `#b4e3f8` | Latar informasi, badge diproses |
| Blue | `blue-normal` / `blue-normal-hover` / `blue-normal-active` | `#0ea5e9` / `#0d95d2` / `#0b84ba` | Fokus, tautan, aksen |
| Blue | `blue-dark` / `blue-dark-hover` / `blue-dark-active` | `#0b7caf` / `#08638c` / `#064a69` | Teks di atas biru muda |
| Blue | `blue-darker` | `#053a52` | Teks informasi kuat |

### 2.2 Alias semantik

Gunakan alias ini di komponen agar mudah diubah di masa depan.

| Alias | Nilai | Kegunaan |
| --- | --- | --- |
| `primary` | `#00ea56` | Aksi utama |
| `primary-hover` | `#00d34d` | Hover aksi utama |
| `primary-active` | `#00bb45` | Active aksi utama |
| `primary-soft` | `#e6fdee` | Latar hijau lembut |
| `primary-strong` | `#00521e` | Teks hijau kuat |
| `accent` | `#0ea5e9` | Fokus/aksen biru |
| `accent-soft` | `#e7f6fd` | Latar biru lembut |
| `accent-strong` | `#053a52` | Teks biru kuat |
| `foreground` | `#231a0c` | Teks utama |
| `muted` | `#654a21` | Teks sekunder |
| `border` | `#cfc7ba` | Border netral |
| `surface` | `#ffffff` | Latar kartu/halaman |
| `surface-muted` | `#f0ede9` | Latar section |
| `danger` | `#dc2626` | Error, aksi destruktif |
| `danger-hover` | `#b91c1c` | Hover aksi destruktif |
| `danger-soft` | `#fee2e2` | Latar error |
| `danger-dark` | `#991b1b` | Teks error kuat |

> **Tambahan di luar token Figma:** `danger` dan turunannya ditambahkan atas persetujuan Product Owner karena file token tidak menyediakan warna error/danger. Warna ini hanya untuk error, validasi, dan aksi destruktif.

### 2.3 Kontras

- Tombol `primary` memakai teks `foreground` (cokelat gelap) di atas hijau terang; jangan memakai teks putih di atas `primary`.
- Tombol `danger` memakai teks putih di atas `#dc2626`.
- Jangan menaruh teks `muted` di atas `surface-muted` untuk teks penting tanpa pengecekan kontras.
- Fokus keyboard memakai ring `accent`.

---

## 3. Tipografi

Font: **Poppins** (400, 600, 700) via `next/font/google`, variabel `--font-poppins`.

Skala mengikuti token mobile. Untuk layar besar, gunakan skala yang sama kecuali desain halaman secara eksplisit menentukan lain.

| Utility | Ukuran / line-height | Weight | Pemakaian |
| --- | --- | --- | --- |
| `text-display` | 40 / 44 px | 700 | Hero/angka besar |
| `text-h1` | 33 / 38 px | 700 | Judul halaman |
| `text-h2` | 27.5 / 33 px | 700 | Judul section |
| `text-h3` | 23 / 29 px | 600 | Sub-section |
| `text-h4` | 19 / 25 px | 600 | Judul kartu/modal |
| `text-body-lg` | 17.5 / 26 px | 400 | Paragraf utama |
| `text-body` | 16 / 24 px | 400 | Teks default, input |
| `text-body-sm` | 14.5 / 21 px | 400 | Teks sekunder, bantuan |
| `text-caption` | 13.5 / 19 px | 400 | Label kecil, badge |

Aturan:
- Jangan memakai heading utility untuk teks yang bukan heading.
- Jangan mencampur font selain Poppins pada MVP.
- Line-height mengikuti token; jangan menimpa dengan `leading-none` pada paragraf.

---

## 4. Komponen

Semua komponen diekspor dari `@/components/ui`.

### 4.1 `Button`

```tsx
import { Button } from "@/components/ui";

<Button>Simpan</Button>
<Button variant="secondary">Batal</Button>
<Button variant="danger" isLoading loadingText="Membatalkan…">Batalkan</Button>
```

- Varian: `primary` (default), `secondary`, `outline`, `ghost`, `danger`.
- Ukuran: `sm`, `md` (default), `lg`.
- `isLoading` menonaktifkan tombol otomatis dan menampilkan spinner.
- `leftIcon` / `rightIcon` menerima React node.
- Untuk aksi kirim/konfirmasi: nonaktifkan tombol saat proses, kirim idempotency key dari layer API, dan tampilkan pesan gagal yang bisa dicoba ulang.

### 4.2 `Input`

```tsx
<Input
  label="Berat estimasi (kg)"
  name="estimated_weight"
  hint="Berat ini masih estimasi, bukan nilai final."
  error={errors.estimated_weight?.message}
  inputMode="decimal"
/>
```

- `label`, `hint`, dan `error` otomatis terhubung lewat `aria-describedby`.
- `error` mengubah border, menampilkan pesan, dan menandai `aria-invalid`.
- Wajib memberi `name` atau `id` agar label terhubung ke input.
- Validasi client (zod) hanya untuk UX; server tetap penentu.

### 4.3 `Card`

`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

`CardTitle` menerima `as="h2" | "h3" | "h4"` agar hierarki heading halaman tetap benar.

### 4.4 `Badge` dan `StatusBadge`

`Badge` untuk label umum (`neutral`, `success`, `info`, `warning`, `danger`).
`StatusBadge` untuk status setoran dengan nilai lowercase sesuai API:

| `status` | Label UI | Varian |
| --- | --- | --- |
| `menunggu` | Menunggu | `warning` (cokelat) |
| `diproses` | Diproses | `info` (biru) |
| `selesai` | Selesai | `success` (hijau) |
| `dibatalkan` | Dibatalkan | `danger` (merah) |

```tsx
<StatusBadge status="selesai" />
```

Jangan menampilkan status mentah dari API; selalu lewat `StatusBadge` agar label dan warna konsisten.

### 4.5 State

- `LoadingState` — `role="status"`, label default “Memuat data…”.
- `EmptyState` — judul, deskripsi, ikon opsional, dan aksi opsional.
- `ErrorState` — `role="alert"`, judul/deskripsi, dan tombol “Coba lagi” bila `onRetry` diberikan.

```tsx
<LoadingState label="Memuat daftar setoran…" />

<EmptyState
  title="Belum ada setoran"
  description="Setoran yang Anda ajukan akan muncul di sini."
  action={<Button size="sm">Ajukan setoran</Button>}
/>

<ErrorState
  description="Daftar setoran gagal dimuat."
  onRetry={() => refetch()}
/>
```

`ErrorState` dengan `onRetry` harus dipakai di dalam Client Component karena meneruskan event handler.

---

## 5. Aturan tampilan data transaksi

- **Berat estimasi** dari nasabah diberi label “Estimasi” dan catatan “bukan nilai final”.
- **Berat aktual** dan **nilai final** hanya muncul setelah petugas mengonfirmasi.
- Nilai transaksi dihitung server; FE hanya menampilkan angka dari API.
- Format rupiah memakai `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })`.
- Jangan menampilkan saldo sebagai “dana cair” atau “bisa ditarik”.
- Status `Dibatalkan` wajib disertai alasan yang terlihat pengguna.

---

## 6. Aksesibilitas

- Semua kontrol punya label; input tanpa `id`/`name` tidak boleh dipakai.
- Target sentuh minimal 44 px (`Button` md/lg sudah memenuhi).
- Fokus keyboard terlihat (`focus-visible:ring-2`).
- Jangan menyampaikan status hanya lewat warna; `StatusBadge` selalu menyertakan teks.
- Teks error memakai `role="alert"` pada `ErrorState`; error field memakai `aria-invalid`.
- Bahasa halaman: `lang="id"`.
- Ikon dekoratif memakai `aria-hidden`.

---

## 7. Struktur file

```text
fe-bsd/
├─ Design/design-tokens.json       # sumber token (read-only untuk FE)
└─ src/
   ├─ app/
   │  ├─ globals.css               # @theme: token Tailwind
   │  └─ (public)/design-system/   # pratinjau komponen
   ├─ components/ui/
   │  ├─ button.tsx
   │  ├─ input.tsx
   │  ├─ card.tsx
   │  ├─ badge.tsx
   │  ├─ states.tsx
   │  └─ index.ts
   └─ lib/cn.ts                    # penggabung className tanpa dependency
```

---

## 8. Menambah/mengubah komponen

1. Pastikan nilai berasal dari token di `globals.css`; jangan menambah hex baru tanpa persetujuan.
2. Tambahkan komponen di `src/components/ui/`, ekspor lewat `index.ts`.
3. Tambahkan contoh pemakaian di `/design-system`.
4. Perbarui dokumen ini bila ada varian, status, atau aturan baru.
5. Jalankan `npm run lint`, `npx tsc --noEmit`, dan `npm run build` di `fe-bsd`.

---

## 9. Traceability

| Kebutuhan | Implementasi |
| --- | --- |
| FR-01/FR-02 (informasi & tampilan status) | `StatusBadge`, `Card`, tipografi |
| FR-12/FR-13 (estimasi vs final, konfirmasi) | Aturan tampilan §5, state tombol loading |
| FR-22 (penolakan/dibatalkan dengan alasan) | `StatusBadge` `dibatalkan`, `ErrorState`/`EmptyState` |
| NFR aksesibilitas & mobile-first | §1, §6, target sentuh 44 px |
| US-01, US-06, US-12 | Komponen state dan badge status |

Rujukan: `docs/PRD_Bank_Sampah_Digital_v1.1.md`, `docs/USER_STORIES_P0.md`, `docs/USER_FLOW.md`.
